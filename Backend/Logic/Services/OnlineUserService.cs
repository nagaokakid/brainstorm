using System.Collections.Concurrent;

namespace Logic.Services
{
    public interface IOnlineUserService
    {
        Task Add(string userId, string connectionId);
        string? GetConnectionId(string userId);
        void Remove(string connectionId);
    }

    public class OnlineUserService : IOnlineUserService
    {
        private ConcurrentDictionary<string, string> onlineUsers;
        public OnlineUserService()
        {
            onlineUsers = new();
        }

        public async Task Add(string userId, string connectionId)
        {
            if (!onlineUsers.TryAdd(userId, connectionId))
            {
                onlineUsers[userId] = connectionId;
            }
        }

        public void Remove(string connectionId)
        {
            if(connectionId != null)
            {
                var result = onlineUsers.Where(x => x.Value == connectionId)?.FirstOrDefault();
                if(result != null && result.HasValue)
                {
                    onlineUsers.Remove(result.Value.Key, out string? removedUser);
                }
            }
        }

        public string? GetConnectionId(string userId)
        {
            onlineUsers.TryGetValue(userId, out var connectionId);
            return connectionId;
        }
    }
}
