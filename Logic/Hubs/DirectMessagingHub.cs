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

        public async Task ChatHistory(string fromId, string toId)
        {
            var result = await directMessageService.GetMessagesByUserId(fromId, toId);
            await Clients.Client(Context.ConnectionId).SendAsync("ReceiveChatHistory", result);
        }
        public async Task SendMessage(MessageInfo directMessage)
        {
            if (directMessage.ToUserInfo != null)
            {
                directMessage.Timestamp = DateTime.Now;

                // make sure user is online
                OnlineUser? online = onlineUserService.Get(directMessage.ToUserInfo.UserId);
                if (online != null)
                {
                    await Clients.Client(online.ConnectionId).SendAsync("ReceiveDirectMessage", directMessage);
                    await directMessageService.AddNewMessage(directMessage);
                }
            }
        }
    }
}
