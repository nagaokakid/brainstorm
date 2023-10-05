using Logic.DTOs.User;
using System.Collections.Concurrent;

namespace Logic.Services
{
    public class OnlineUserService
    {
        private readonly DatabaseService databaseService;
        private ConcurrentDictionary<string, OnlineUser> onlineUsers;
        public OnlineUserService(DatabaseService databaseService)
        {
            onlineUsers = new();
            this.databaseService = databaseService;
        }

        public async Task AddOnlineUser(string userId, string connectionId)
        {
            if (!onlineUsers.ContainsKey(userId))
            {
                var user = await databaseService.GetUser(userId);

                onlineUsers.AddOrUpdate(userId, new OnlineUser
                {
                    UserId = userId,
                    ConnectionId = connectionId,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                },

                (key, value) => value
                );
            }
        }

        public void RemoveOnlineUser(string userId)
        {
            onlineUsers.Remove(userId, out OnlineUser? removedUser);
        }

        public OnlineUser? GetOnlineUser(string toUserId)
        {
            var result = onlineUsers.TryGetValue(toUserId, out var user);
            return user;
        }
    }
}
