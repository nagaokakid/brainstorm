using Logic.DTOs.Messages;
using Logic.DTOs.User;
using Logic.Services;
using Microsoft.AspNetCore.SignalR;

namespace Logic.Hubs
{
    public class DirectMessagingHub : Hub
    {
        private readonly OnlineUserService onlineUserService;
        private readonly DirectMessageService directMessageService;

        public DirectMessagingHub(OnlineUserService onlineUserService, DirectMessageService directMessageService)
        {
            this.onlineUserService = onlineUserService;
            this.directMessageService = directMessageService;
        }
        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            onlineUserService.Remove(Context.ConnectionId);
            await base.OnDisconnectedAsync(exception);
        }
        public async Task JoinDirect(FriendlyUserInfo user)
        {
            await onlineUserService.Add(user, Context.ConnectionId);
        }

        public async Task GetChatHistory(string fromId, string toId)
        {
            var result = await directMessageService.GetMessagesByUserId(fromId, toId);
            await Clients.Client(Context.ConnectionId).SendAsync("ReceiveChatHistory", result);
        }
        public async Task SendDirectMessage(MessageInfo msg)
        {
            if (msg.ToUserInfo != null)
            {
                msg.Timestamp = DateTime.Now;

                // make sure user is online
                OnlineUser? online = onlineUserService.Get(msg.ToUserInfo.UserId);
                if (online != null)
                {
                    await Clients.Client(online.ConnectionId).SendAsync("ReceiveDirectMessage", msg);
                    await directMessageService.AddNewMessage(msg);
                }
            }
        }
    }
}
