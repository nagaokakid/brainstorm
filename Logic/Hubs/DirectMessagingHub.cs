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
        public override Task OnConnectedAsync()
        {
            return base.OnConnectedAsync();
        }
        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            onlineUserService.Remove(Context.ConnectionId);
            await base.OnDisconnectedAsync(exception);
        }
        public async Task JoinDirect(string userId, string firstName, string lastName)
        {
            var user = new FriendlyUserInfo
            {
                UserId = userId,
                FirstName = firstName,
                LastName = lastName
            };
            await onlineUserService.Add(userId, Context.ConnectionId);
        }

        public async Task GetChatHistory(string fromId, string toId)
        {
            var result = await directMessageService.GetMessagesByUserId(fromId, toId);
            await Clients.Client(Context.ConnectionId).SendAsync("ReceiveChatHistory", result);
        }
        public async Task SendDirectMessage(string fromUserId, string fromFirstName, string fromLastName, string toUserId, string toFirstName, string toLastName, string msg)
        {
            var msgInfo = new MessageInfo
            {
                FromUserInfo = new FriendlyUserInfo { UserId = fromUserId, FirstName = fromFirstName, LastName = fromLastName },
                ToUserInfo = new FriendlyUserInfo { UserId = toUserId, FirstName = toFirstName, LastName = toLastName },
                Message = msg,
                Timestamp = DateTime.Now
            };
            // save direct message
            await directMessageService.AddNewMessage(msgInfo);
            await Clients.Client(Context.ConnectionId).SendAsync("ReceiveDirectMessage", msgInfo);


            // make sure user is online
            var connectionId = onlineUserService.Get(toUserId);
            if (connectionId != null)
            {
                await Clients.Client(connectionId).SendAsync("ReceiveDirectMessage", msgInfo);
            }

        }
    }
}
