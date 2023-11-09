using Database.CollectionContracts;
using Logic.Data;
using Logic.DTOs.Messages;
using Logic.DTOs.User;
using Logic.Helpers;
using Logic.Services;
using Microsoft.AspNetCore.SignalR;

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
        public async Task SendChatRoomMessage(string userId, string chatRoomId, string firstName, string lastName, string msg)
        {
            if (chatRoomId != null && userId != null && firstName != null && msg != null)
            {
                var msgInfo = new MessageInfo
                {
                    FromUserInfo = new FriendlyUserInfo { UserId = userId, FirstName = firstName, LastName = lastName },
                    ChatRoomId = chatRoomId,
                    Message = msg,
                    Timestamp = DateTime.Now
                };

                // add message to chatroom
                chatRoomService.AddMessageToChatRoom(msgInfo.ChatRoomId, msgInfo);

                // send message to everyone in the chatRoom
                Clients.Group(chatRoomId).SendAsync("ReceiveChatRoomMessage", msgInfo);
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

        public async Task CreateBrainstormSession(string title, string description, string chatRoomId, string creatorId, string creatorFirstName, string creatorLastName)
        {
            if (title != null && description != null && chatRoomId != null && creatorId != null)
            {
                var creator = new FriendlyUserInfo { UserId = creatorId, FirstName = creatorFirstName, LastName = creatorLastName };
                var session = new BrainstormSession { Title = title, Description = description, ChatRoomId = chatRoomId, CanJoin = true, Creator = creator, SessionId = Guid.NewGuid().ToString(), Ideas = new List<string>(), JoinedMembers = new List<FriendlyUserInfo> { creator }, IdeasAvailable = DateTime.Now.AddDays(1) };

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
                Clients.Group(session.ChatRoomId).SendAsync("ReceiveChatRoomMessage", msg);
            }
        }

        public async Task JoinBrainstormSession(string sessionId, string userId, string firstName, string lastName)
        {
            if (sessionId != null && userId != null)
            {
                var user = new FriendlyUserInfo { UserId = userId, FirstName = firstName, LastName = lastName };
                await brainstormService.Join(sessionId, user);

                // notify all joined members that a new user has joined
                Clients.Group(sessionId).SendAsync("UserJoinedBrainstormingSession", sessionId, user);
            }
        }

        public async Task StartSession(string sessionId)
        {
            if (sessionId != null)
            {
                await brainstormService.StartSession(sessionId);

                // let all users know that brainstorm session has started
                Clients.Group(sessionId).SendAsync("BrainstormSessionStarted", sessionId);
            }
        }

        public async Task EndSession(string sessionId)
        {
            if (sessionId != null)
            {
                await brainstormService.EndSession(sessionId);
                // notify all users that sessionId has ended
                Clients.Group(sessionId).SendAsync("BrainstormSessionEnded", sessionId);
            }
        }

        public async Task SendAllIdeas(string sessionId)
        {
            if (sessionId != null)
            {
                var result = await brainstormService.GetAllIdeas(sessionId);
                Clients.Group(sessionId).SendAsync("ReceiveAllIdeas", sessionId, result);
            }
        }

        public async Task RemoveSession(string sessionId)
        {
            if (sessionId != null)
            {
                await brainstormService.RemoveSession(sessionId);
            }
        }
    }
}
