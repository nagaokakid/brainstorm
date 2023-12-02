/*
 * ChatRoomHub.cs
 * --------------
 * This file contains the ChatRoomHub class to handle the SignalR connections.
 * ---------------------------------------------------------
 * Author: Mr.Roland Fehr
 * Last modified: 28.10.2023
 * Version: 1.0
*/

using Database.CollectionContracts;
using Logic.Data;
using Logic.DTOs.Messages;
using Logic.DTOs.User;
using Logic.Helpers;
using Logic.Services;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.SignalR;
using System.Text;

namespace Logic.Hubs
{
    /// <summary>
    /// This class contains the ChatRoomHub class to handle the SignalR connections.
    /// </summary>
    public class ChatRoomHub : Hub
    {
        private readonly IChatRoomService chatRoomService;
        private readonly IUserCollection userCollection;
        private readonly IBrainstormService brainstormService;

        /// <summary>
        /// This constructor creates a new instance of the ChatRoomHub class.
        /// </summary>
        /// <param name="chatRoomService"></param>
        /// <param name="userCollection"></param>
        /// <param name="brainstormService"></param>
        public ChatRoomHub(IChatRoomService chatRoomService, IUserCollection userCollection, IBrainstormService brainstormService)
        {
            this.chatRoomService = chatRoomService;
            this.userCollection = userCollection;
            this.brainstormService = brainstormService;
        }

        /// <summary>
        ///  This method is called when a user joins a chatroom. It adds the user to the chatroom group and adds the chatroom to the user object in the database.
        /// </summary>
        /// <param name="joinCode"></param>
        /// <param name="first"></param>
        /// <param name="userId"></param>
        /// <param name="firstName"></param>
        /// <param name="lastName"></param>
        /// <returns> The task to join the chatroom </returns>
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

        /// <summary>
        /// This private method is used when a user leaves a chatroom. It removes the user from the chatroom group and removes the chatroom from the user object in the database. 
        /// </summary>
        /// <param name="chatRoomId"></param>
        /// <param name="userId"></param>
        private async Task SendChatRoomMessage(string chatRoomId, MessageInfo msg)
        {
            await Clients.Group(chatRoomId).SendAsync("ReceiveChatRoomMessage", msg);
        }

        /// <summary>
        /// This method is called when a user sends a message in a chatroom. It adds the message to the chatroom and sends the message to all users in the chatroom. 
        /// </summary>
        /// <param name="userId"></param>
        /// <param name="chatRoomId"></param>
        /// <param name="firstName"></param>
        /// <param name="lastName"></param>
        /// <param name="msg"></param>
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

        /// <summary> 
        ///   This method is called when a user disconnects from the chatroom. It removes the user from the chatroom group and removes the chatroom from the user object in the database.
        /// </summary>
        /// <param name="exception"></param>
        /// <returns> The task to disconnect from the chatroom </returns>
        public override Task OnDisconnectedAsync(Exception? exception)
        {
            return base.OnDisconnectedAsync(exception);
        }

        /// <summary>
        /// This method is called when a user connects to the chatroom. It adds the user to the chatroom group and adds the chatroom to the user object in the database.
        /// </summary>
        /// <returns> The task to connect to the chatroom </returns>
        public override Task OnConnectedAsync()
        {
            return base.OnConnectedAsync();
        }

        /// <summary>
        ///   This method is called when a user creates a brainstorming session. It creates a new brainstorming session and adds it to the database. It also adds the creator of the session to the brainstorming session group.
        /// </summary>
        /// <param name="title"></param>
        /// <param name="description"></param>
        /// <param name="chatRoomId"></param>
        /// <param name="creatorId"></param>
        /// <param name="creatorFirstName"></param>
        /// <param name="creatorLastName"></param>
        /// <param name="timer"></param>
        public async Task CreateBrainstormSession(string title, string description, string chatRoomId, string creatorId, string creatorFirstName, string creatorLastName, string timer)
        {
            if (title != null && description != null && chatRoomId != null && creatorId != null)
            {
                var creator = new FriendlyUserInfo { UserId = creatorId, FirstName = creatorFirstName, LastName = creatorLastName };
                var session = new BrainstormSession { Title = title, Description = description, ChatRoomId = chatRoomId, CanJoin = true, Creator = creator, SessionId = Guid.NewGuid().ToString(), Ideas = new Dictionary<string, Idea>(), JoinedMembers = new List<FriendlyUserInfo> { creator }, IdeasAvailable = DateTime.Now.AddDays(1), TimerSeconds = int.TryParse(timer, out var resultt) ? resultt : 0 };

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
                // send message to chatroom
                Clients.Group(session.ChatRoomId).SendAsync("ReceiveChatRoomMessage", msg, session.TimerSeconds);
                NotifyAllMemberHasJoined(session.SessionId, creatorId, 1, session.TimerSeconds);
            }
        }

        /// <summary>
        /// This method notifies all members of a brainstorming session that a new user has joined the session. 
        /// </summary>
        /// <param name="sessionId"></param>
        /// <param name="userId"></param>
        /// <param name="count"></param>
        /// <param name="timer"></param>
        private async Task NotifyAllMemberHasJoined(string sessionId, string userId, int count, int timer)
        {
            Clients.Group(sessionId).SendAsync("UserJoinedBrainstormingSession", sessionId, userId, count, timer);
        }

        /// <summary>
        /// JoinBrainstormSession method is called when a user joins a brainstorming session. It adds the user to the brainstorming session group and adds the user to the brainstorming session in the database.
        /// </summary>
        /// <param name="sessionId"></param>
        /// <param name="userId"></param>
        /// <param name="firstName"></param>
        /// <param name="lastName"></param>
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

        /// <summary>
        /// This method is called when a user starts a brainstorming session. It starts the brainstorming session and notifies all users in the brainstorming session group that the session has started.
        /// </summary>
        /// <param name="sessionId"></param>
        /// <param name="seconds"></param>
        public async Task StartSession(string sessionId, int seconds)
        {
            if (sessionId != null)
            {
                await brainstormService.StartSession(sessionId);

                // let all users know that brainstorm session has started
                Clients.Group(sessionId).SendAsync("BrainstormSessionStarted", sessionId, seconds);
            }
        }

        /// <summary>
        /// This method is called when a user leaves a brainstorming session. It removes the user from the brainstorming session group and removes the user from the brainstorming session in the database.
        /// </summary>
        /// <param name="sessionId"></param>
        /// <param name="userId"></param>
        public async Task RemoveUserFromSession(string sessionId, string userId)
        {
            await brainstormService.RemoveUserFromSession(sessionId, userId);
            var session = await brainstormService.GetSession(sessionId);
            if (session != null)
            {
                NotifyAllMemberHasJoined(sessionId, " ", session.JoinedMembers.Count, session.TimerSeconds);
            }
        }

        /// <summary>
        /// This method is called when a user ends a brainstorming session. It ends the brainstorming session and notifies all users in the brainstorming session group that the session has ended.
        /// </summary>
        /// <param name="sessionId"></param>
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

        /// <summary>
        /// This method is called when a user sends all ideas to the server. It adds the ideas to the brainstorming session in the database.
        /// </summary>
        /// <param name="sessionId"></param>
        /// <param name="ideas"></param>
        public async Task ReceiveAllIdeas(string sessionId, List<string> ideas)
        {
            if (sessionId != null && ideas != null)
            {
                await brainstormService.AddIdeas(sessionId, ideas);
            }
        }

        /// <summary>
        /// This method is called when a user ends a brainstorming session. It creates a message with the voting results and sends it to the chatroom.
        /// </summary>
        /// <param name="sessionId"></param>
        /// <param name="title"></param>
        private static string VoteResultsToMessage(List<Idea> ideas, string title)
        {
            StringBuilder message = new StringBuilder($"Voting Results from {title}\n");

            foreach (var idea in ideas)
            {
                message.Append($"\nLikes {idea.Likes}:\n{idea.Thought}\n");
            }

            return message.ToString();
        }

        /// <summary>
        /// This method is called when a user removes a brainstorming session. It removes the brainstorming session from the database and sends a message with the voting results to the chatroom.
        /// </summary>
        /// <param name="sessionId"></param>
        /// <param name="userInfo"></param>
        public async Task RemoveSession(string sessionId, FriendlyUserInfo userInfo)
        {
            if (sessionId != null)
            {
                var session = await brainstormService.GetSession(sessionId);
                if (session != null)
                {

                    var msgIdea = VoteResultsToMessage(session.Ideas.Select(x => x.Value)?.OrderBy(x => x.Likes).ToList(), session.Title);
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

        /// <summary>   
        /// This method is called when a user sends all votes to the server. It adds the votes to the brainstorming session in the database.
        /// </summary>
        /// <param name="sessionId"></param>
        public async Task SendAllVotes(string sessionId)
        {
            await Clients.Group(sessionId).SendAsync("SendVotes");

            // set timer to send all votes after x time
            await brainstormService.SendVotesTimer(sessionId, null);
        }


        /// <summary>
        /// ReceiveVotes method is called to receive all votes from the server.
        /// </summary>
        /// <param name="sessionId"></param>
        /// <param name="ideas"></param>
        public async Task ReceiveVotes(string sessionId, List<Idea> ideas)
        {
            await brainstormService.AddVotes(sessionId, ideas);
        }

        /// <summary>
        /// This method is called when a user votes for another round. It adds the votes to the brainstorming session in the database.
        /// </summary>
        /// <param name="sessionId"></param>
        public async Task VoteAnotherRound(string sessionId)
        {
            var result = await brainstormService.VoteAnotherRound(sessionId);
            Clients.Groups(sessionId).SendAsync("ReceiveAllIdeas", sessionId, result);
        }

        /// <summary>
        /// This method is called when a user removes a message from the chatroom. It removes the message from the chatroom in the database and sends a message to the chatroom.
        /// </summary>
        /// <param name="chatRoomId"></param>
        /// <param name="messageId"></param>
        public async Task RemoveChatRoomMessage(string chatRoomId, string messageId)
        {
            if (!string.IsNullOrEmpty(chatRoomId) && !string.IsNullOrEmpty(messageId))
            {
                chatRoomService.RemoveMessage(chatRoomId, messageId);
                Clients.Groups(chatRoomId).SendAsync("RemoveChatRoomMessage", chatRoomId, messageId);
            }
        }

        public async Task SendEditChatRoom(string chatRoomId, string title, string description)
        {
            Clients.Groups(chatRoomId).SendAsync("EditChatRoom", chatRoomId, title, description);
        }
    }
}
