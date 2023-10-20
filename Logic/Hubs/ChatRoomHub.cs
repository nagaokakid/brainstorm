using Logic.DTOs.Messages;
using Logic.DTOs.User;
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

        public async Task JoinChatRoom(string joinCode)
        {
            // get room for chatRoomCode
            var chatRoom = await chatRoomService.GetRoomByJoinCode(joinCode);

            // add member to group
            if (chatRoom != null)
            {
                var msg = new MessageInfo
                {
                    ChatRoomId = chatRoom.Id,
                    Message = $"New Member joined",
                    FromUserInfo = new FriendlyUserInfo
                    {
                        FirstName = "first",
                        LastName = "last",
                        UserId = "id"
                    }
                };
                await Groups.AddToGroupAsync(Context.ConnectionId, chatRoom.Id);
                Clients.Client(Context.ConnectionId).SendAsync("ReceiveChatRoomMessage", msg);
                Clients.Client(Context.ConnectionId).SendAsync("ReceiveChatRoomInfo",chatRoom);
            }
        }
        public async Task SendChatRoomMessage(string userId, string chatRoomId, string firstName, string lastName, string msg)
        {
            if (chatRoomId != null)
            {
                var msgInfo = new MessageInfo
                {
                    FromUserInfo = new FriendlyUserInfo { UserId = userId, FirstName = firstName, LastName = lastName },
                    ChatRoomId = chatRoomId,
                    Message = msg,
                    Timestamp = DateTime.Now
                };

                // send message to everyone in the chatRoom
                await Clients.Group(chatRoomId).SendAsync("ReceiveChatRoomMessage", msgInfo);

                // add message to chatroom
                await chatRoomService.AddMessageToChatRoom(msgInfo.ChatRoomId, msgInfo);
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
