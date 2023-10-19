using Logic.DTOs.User;
using System.Collections.Concurrent;

namespace Logic.Services
{
    public class OnlineUserService
    {
        private ConcurrentDictionary<string, string> onlineUsers;
        public OnlineUserService()
        {
            onlineUsers = new();
        }

        public async Task Add(string userId, string connectionId)
        {
            if(!onlineUsers.TryAdd(userId, connectionId))
            {
                onlineUsers[userId] = connectionId;
            }
        }

        public void Remove(string connectionId)
        {
            var result = onlineUsers.Where(x => x.Value == connectionId).FirstOrDefault();

            onlineUsers.Remove(result.Key, out string? removedUser);
        }

        public string? Get(string userId)
        {
            onlineUsers.TryGetValue(userId, out var user);
            return user;
        }
    }
}
