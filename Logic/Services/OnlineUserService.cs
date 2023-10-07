using Logic.DTOs.User;
using System.Collections.Concurrent;

namespace Logic.Services
{
    public class OnlineUserService
    {
        private ConcurrentDictionary<string, OnlineUser> onlineUsers;
        public OnlineUserService()
        {
            onlineUsers = new();
        }

        public async Task Add(FriendlyUserInfo userInfo, string connectionId)
        {
            onlineUsers.AddOrUpdate(userInfo.UserId, new OnlineUser
            {
                UserInfo = userInfo,
                ConnectionId = connectionId,
            },

            // called if key exists
            (key, value) => value

            );
        }

        public void Remove(string connectionId)
        {
            var result = onlineUsers.Where(x => x.Value.ConnectionId == connectionId).FirstOrDefault();

            onlineUsers.Remove(result.Key, out OnlineUser? removedUser);
        }

        public OnlineUser? Get(string userId)
        {
            onlineUsers.TryGetValue(userId, out var user);
            return user;
        }
    }
}
