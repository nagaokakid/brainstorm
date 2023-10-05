using Logic.DTOs.Messages;
using Logic.DTOs.User;
using Logic.Models;
using Logic.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace Logic.Hubs
{
    [Authorize]
    public class ChatRoomHub : Hub
    {
        private readonly DatabaseService databaseService;
        private readonly OnlineUserService onlineUserService;

        public ChatRoomHub(DatabaseService databaseService, OnlineUserService onlineUserService)
        {
            this.databaseService = databaseService;
            this.onlineUserService = onlineUserService;
        }
        [AllowAnonymous]
        public async Task JoinChatRoom(string userId, int chatRoomCode)
        {
            // add to online user list
            await onlineUserService.AddOnlineUser(userId, Context.ConnectionId);

            // get room for chatRoomCode
            var chatRoom = await databaseService.GetRoomByJoinCode(chatRoomCode);

            // add member to group
            if (chatRoom != null)
            {
                await Groups.AddToGroupAsync(Context.ConnectionId, chatRoom.Id);
            }
            // join code for room not found
            else
            {
                await Clients.Caller.SendAsync("roomNotFound", "Incorrect code");
            }
        }

        public async Task SendMessageDirectly(DirectMessage directMessage)
        {
            // make sure user is online
            OnlineUser? online = onlineUserService.GetOnlineUser(directMessage.ToUserId);
            if(online != null)
            {
                await Clients.Client(online.ConnectionId).SendAsync("ReceiveDirectMessage", directMessage);
            }

            // if user is offline, add message to DB
        }
        public override Task OnDisconnectedAsync(Exception? exception)
        {
            return base.OnDisconnectedAsync(exception);
        }
        public override Task OnConnectedAsync()
        {
            var result = Context.ConnectionId;
            return base.OnConnectedAsync();
        }
        public async Task SendChatRoomMessage(IncomingChatRoomMessage incomingMsg)
        {
            // get user
            User fromUser = await databaseService.GetUser(incomingMsg.FromUserId);

            // outgoing message
            OutgoingChatRoomMessage outMessage = new OutgoingChatRoomMessage
            {
                ChatRoomId = incomingMsg.ChatRoomId,
                FromFirstLastName = fromUser.FirstName + " " + fromUser.LastName,
                Message = incomingMsg.Message,
                Timestamp = DateTime.Now,
            };

            // send message to everyone in the chatRoom except the sender
            await Clients.GroupExcept(incomingMsg.ChatRoomId, new List<string>() { Context.ConnectionId }).SendAsync("ReceiveChatRoomMessage", outMessage);

            // add message to chatroom
            await databaseService.AddMessageToChatRoom(incomingMsg.ChatRoomId, new ChatRoomMessage
            {
                From = new FriendlyUserInfo { Id = fromUser.Id, FirstName = fromUser.FirstName, LastName = fromUser.LastName},
                Message = incomingMsg.Message,
                Timestamp = outMessage.Timestamp,
            });
        }
    }
}
