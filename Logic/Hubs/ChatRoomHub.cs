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

        public async Task JoinChatRoom(string joinCode, string first, string userId, string firstName, string lastName)
        {
            // get room for chatRoomCode
            var result = await chatRoomService.GetRoomByJoinCode(joinCode);

            // add member to group
            if (result != null)
            {
                var newUser = new FriendlyUserInfo
                {
                    UserId = userId,
                    FirstName = firstName,
                    LastName = lastName,
                };

                await Groups.AddToGroupAsync(Context.ConnectionId, result.Id);

                if (first == "First")
                {
                    await Clients.Client(Context.ConnectionId).SendAsync("ReceiveChatRoomInfo", result);
                }

                // check if user is already a member of the chatroom when they join
                var found = result.MemberIds.FirstOrDefault(x => x == userId);
                if (found == null)
                {
                    // add new member to chatroom
                    await chatRoomService.AddNewUserToChatRoom(userId, result.Id);
                    await Clients.Group(result.Id).SendAsync("NewMemberJoined", newUser, result.Id);
                }
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
