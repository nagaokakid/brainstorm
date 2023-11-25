using Database.CollectionContracts;
using Database.Data;
using Logic.Data;
using Logic.DTOs.Messages;
using Logic.DTOs.User;
using Logic.Helpers;
using Logic.Services;
using Microsoft.AspNetCore.SignalR;
using System.Numerics;
using System.Text;

namespace Logic.Hubs
{
    public class ChatRoomHub : Hub
    {
        private readonly IChatRoomService chatRoomService;
        private readonly IUserCollection userCollection;
        private readonly IBrainstormService brainstormService;

        public ChatRoomHub(IChatRoomService chatRoomService, IUserCollection userCollection, IBrainstormService brainstormService)
        {
            this.chatRoomService = chatRoomService;
            this.userCollection = userCollection;
            this.brainstormService = brainstormService;
        }

        public async Task JoinChatRoom(string joinCode, string first, string userId, string firstName, string lastName)
        {
            if (joinCode != null && userId != null && firstName != null)
            {
                // get room for chatRoomCode
                var foundChatRoom = await chatRoomService.GetRoomByJoinCode(joinCode);

                // add member to group
                if (foundChatRoom != null)
                {
                    var member = new FriendlyUserInfo
                    {
                        UserId = userId,
                        FirstName = firstName,
                        LastName = lastName,
                    };

                    // add new member to signalR connection group
                    await Groups.AddToGroupAsync(Context.ConnectionId, foundChatRoom.Id);

                    if (first == "First")
                    {
                        var users = await userCollection.GetAll();
                        if (users != null)
                        {
                            await Clients.Client(Context.ConnectionId).SendAsync("ReceiveChatRoomInfo", foundChatRoom.ToDTO(users));
                        }
                    }

                    // check if user is already a member of the chatroom when they join
                    var found = foundChatRoom.MemberIds.FirstOrDefault(x => x == userId);
                    if (found == null && userId.Length != 1)
                    {
                        // add new member to chatroom
                        await chatRoomService.AddNewUserToChatRoom(userId, foundChatRoom.Id);
                        await Clients.Group(foundChatRoom.Id).SendAsync("NewMemberJoined", member, foundChatRoom.Id);

                        // add chatRoomId to user object
                        await userCollection.AddChatRoomToUser(userId, foundChatRoom.Id);
                    }
                }
            }
        }

        private async Task SendChatRoomMessage(string chatRoomId, MessageInfo msg)
        {
            await Clients.Group(chatRoomId).SendAsync("ReceiveChatRoomMessage", msg);
        }
        public async Task SendChatRoomMessage(string userId, string chatRoomId, string firstName, string lastName, string msg)
        {
            if (chatRoomId != null && userId != null && firstName != null && msg != null)
            {
                var msgInfo = new MessageInfo
                {
                    MessageId = Guid.NewGuid().ToString(),
                    FromUserInfo = new FriendlyUserInfo { UserId = userId, FirstName = firstName, LastName = lastName },
                    ChatRoomId = chatRoomId,
                    Message = msg,
                    Timestamp = DateTime.Now
                };

                // add message to chatroom
                chatRoomService.AddMessageToChatRoom(msgInfo.ChatRoomId, msgInfo);

                // send message to everyone in the chatRoom
                SendChatRoomMessage(chatRoomId, msgInfo);
            }
        }

        public override Task OnDisconnectedAsync(Exception? exception)
        {
            return base.OnDisconnectedAsync(exception);
        }

        public override Task OnConnectedAsync()
        {
            return base.OnConnectedAsync();
        }

        public async Task CreateBrainstormSession(string title, string description, string chatRoomId, string creatorId, string creatorFirstName, string creatorLastName, string timer)
        {
            if (title != null && description != null && chatRoomId != null && creatorId != null)
            {
                var creator = new FriendlyUserInfo { UserId = creatorId, FirstName = creatorFirstName, LastName = creatorLastName };
                var session = new BrainstormSession { Title = title, Description = description, ChatRoomId = chatRoomId, CanJoin = true, Creator = creator, SessionId = Guid.NewGuid().ToString(), Ideas = new Dictionary<string, Idea>(), JoinedMembers = new List<FriendlyUserInfo> { creator }, IdeasAvailable = DateTime.Now.AddDays(1), TimerSeconds =  int.TryParse(timer, out var resultt) ? resultt : 0};

                // add created session to dictionary
                await brainstormService.Add(session);

                // add creator of session to brainstorming session group
                await Groups.AddToGroupAsync(Context.ConnectionId, session.SessionId);

                // send message to chatroom saying a new brainstorming session has started
                var msg = new MessageInfoJoinSession
                {
                    ChatRoomId = chatRoomId,
                    Message = $"Join {title}",
                    FromUserInfo = creator,
                    Timestamp = DateTime.Now,
                    Brainstorm = session.ToDTO(),
                };
                Clients.Group(session.ChatRoomId).SendAsync("ReceiveChatRoomMessage", msg, session.TimerSeconds);
                NotifyAllMemberHasJoined(session.SessionId, creatorId, 1, session.TimerSeconds);
            }
        }
        private async Task NotifyAllMemberHasJoined(string sessionId, string userId, int count, int timer)
        {
            Clients.Group(sessionId).SendAsync("UserJoinedBrainstormingSession", sessionId, userId, count, timer);
        }
        public async Task JoinBrainstormSession(string sessionId, string userId, string firstName, string lastName)
        {
            if (sessionId != null && userId != null)
            {
                var user = new FriendlyUserInfo { UserId = userId, FirstName = firstName, LastName = lastName };
                await brainstormService.Join(sessionId, user);

                var session = await brainstormService.GetSession(sessionId);

                if (session != null && session.CanJoin)
                {
                    // notify all joined members that a new user has joined
                    await Groups.AddToGroupAsync(Context.ConnectionId, sessionId);
                    await NotifyAllMemberHasJoined(sessionId, userId, session.JoinedMembers.Count, session.TimerSeconds);
                }
                else
                {
                    // notify joining member that the session has already started
                    await Clients.Clients(Context.ConnectionId).SendAsync("SessionStartedNotAllowedToJoin", sessionId);
                }
            }
        }

        public async Task StartSession(string sessionId, int seconds)
        {
            if (sessionId != null)
            {
                await brainstormService.StartSession(sessionId);

                // let all users know that brainstorm session has started
                Clients.Group(sessionId).SendAsync("BrainstormSessionStarted", sessionId, seconds);
            }
        }

        public async Task EndSession(string sessionId)
        {
            if (sessionId != null)
            {
                await brainstormService.EndSession(sessionId);

                // notify all users that sessionId has ended
                await Clients.Group(sessionId).SendAsync("BrainstormSessionEnded", sessionId);

                // start timer to send all ideas
                await brainstormService.SendAllIdeasTimer(sessionId, null);
            }
        }

        public async Task ReceiveAllIdeas(string sessionId, List<string> ideas)
        {
            if (sessionId != null && ideas != null)
            {
                await brainstormService.AddIdeas(sessionId, ideas);
            }
        }

        private static string VoteResultsToMessage(List<Idea> ideas, string title)
        {
            StringBuilder message = new StringBuilder($"Voting Results from {title}\n");

            foreach (var idea in ideas)
            {
                message.Append($"\nLikes {idea.Likes}:\n{idea.Thought}\n");
            }

            return message.ToString();
        }

        public async Task RemoveSession(string sessionId, FriendlyUserInfo userInfo)
        {
            if (sessionId != null)
            {
                var session = await brainstormService.GetSession(sessionId);
                if (session != null)
                {

                    var msgIdea = VoteResultsToMessage(session.Ideas.Select(x => x.Value)?.OrderBy(x=>x.Likes).ToList(), session.Title);
                    var msgInfo = new MessageInfo
                    {
                        ChatRoomId = session.ChatRoomId,
                        MessageId = Guid.NewGuid().ToString(),
                        FromUserInfo = userInfo,
                        Message = msgIdea,
                        Timestamp = DateTime.Now,
                    };

                    // send message with voting results to chat
                    SendChatRoomMessage(session.ChatRoomId, msgInfo);

                    // save the message in the DB
                    chatRoomService.AddMessageToChatRoom(session.ChatRoomId, msgInfo);

                    // remove brainstorm session 
                    brainstormService.RemoveSession(sessionId);
                }
            }
        }

        public async Task SendAllVotes(string sessionId)
        {
            await Clients.Group(sessionId).SendAsync("SendVotes");

            // set timer to send all votes after x time
            await brainstormService.SendVotesTimer(sessionId, null);
        }

        public async Task ReceiveVotes(string sessionId, List<Idea> ideas)
        {
            await brainstormService.AddVotes(sessionId, ideas);
        }

        public async Task VoteAnotherRound(string sessionId)
        {
            var result = await brainstormService.VoteAnotherRound(sessionId);
            Clients.Groups(sessionId).SendAsync("ReceiveAllIdeas", sessionId, result);
        }

        public async Task RemoveChatRoomMessage(string chatRoomId, string messageId)
        {
            if (!string.IsNullOrEmpty(chatRoomId) && !string.IsNullOrEmpty(messageId))
            {
                chatRoomService.RemoveMessage(chatRoomId, messageId);
                Clients.Groups(chatRoomId).SendAsync("RemoveChatRoomMessage", chatRoomId, messageId);
            }
        }
    }
}
