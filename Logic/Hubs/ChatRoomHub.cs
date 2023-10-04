using Logic.DTOs.Messages;
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

        public ChatRoomHub(DatabaseService databaseService)
        {
            this.databaseService = databaseService;
        }

        public async Task JoinChatRoom(int chatRoomCode)
        {
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
                From = fromUser,
                Message = incomingMsg.Message,
                Timestamp = outMessage.Timestamp,
            });
        }
    }
}
