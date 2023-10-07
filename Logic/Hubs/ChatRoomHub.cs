using Logic.DTOs.Messages;
using Logic.Models;
using Logic.Services;
using Microsoft.AspNetCore.SignalR;

namespace Logic.Hubs
{
    public class ChatRoomHub : Hub
    {
        private readonly ChatRoomService chatRoomService;

        public ChatRoomHub(ChatRoomService chatRoomService)
        {
            this.chatRoomService = chatRoomService;
        }

        public async Task JoinChatRoom(int joinCode)
        {
            // get room for chatRoomCode
            var result = await chatRoomService.GetRoomByJoinCode(joinCode);

            // add member to group
            if (result != null)
            {
                await Groups.AddToGroupAsync(Context.ConnectionId, result.Id);
            }
        }
        public async Task SendChatRoomMessage(MessageInfo msg)
        {
            if (msg.ChatRoomId != null)
            {
                msg.Timestamp = DateTime.Now;

                // send message to everyone in the chatRoom
                await Clients.Group(msg.ChatRoomId).SendAsync("ReceiveChatRoomMessage", msg);

                // add message to chatroom
                await chatRoomService.AddMessageToChatRoom(msg.ChatRoomId, new ChatRoomMessage
                {
                    From = msg.FromUserInfo,
                    Message = msg.Message,
                    Timestamp = msg.Timestamp,
                });
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
    }
}
