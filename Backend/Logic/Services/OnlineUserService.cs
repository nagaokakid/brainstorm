/*
 * OnlineUserService.cs 
 * -------------------------
 * Represents the OnlineUserService object from the database.
 * This file contains the data for the OnlineUserService.
 * ---------------------------------------------------------
 * Author: Mr. Roland Fehr
 * Last modified: 28.10.2023
 * Version: 1.0
*/

using System.Collections.Concurrent;
using System.Diagnostics;

namespace Logic.Services
{
    /// <summary>
    ///  This is the interface for the OnlineUserService
    /// </summary>
    public interface IOnlineUserService
    {
        Task Add(string userId, string connectionId);
        string? GetConnectionId(string userId);
        void Remove(string connectionId);
    }

    /// <summary>
    /// This class implements the IOnlineUserService interface. It is used to manage the online users.
    /// </summary>
    public class OnlineUserService : IOnlineUserService
    {
        private ConcurrentDictionary<string, string> onlineUsers;

        /// <summary>
        ///    This is the constructor for the OnlineUserService
        /// </summary>
        public OnlineUserService()
        {
            onlineUsers = new();
        }

        /// <summary>
        ///   This method adds a user to the online users list.
        /// </summary>
        /// <param name="userId"></param>
        /// <param name="connectionId"></param>
        public async Task Add(string userId, string connectionId)
        {
            if (!onlineUsers.TryAdd(userId, connectionId))
            {
                onlineUsers[userId] = connectionId;
            }
        }

        /// <summary>
        ///   This method removes a user from the online users list.
        /// </summary>
        /// <param name="connectionId"></param>
        public void Remove(string connectionId)
        {
            if (connectionId != null)
            {
                Debug.WriteLine($"Leaving Direct Messaging Hub {connectionId}");
                var result = onlineUsers.Where(x => x.Value == connectionId)?.FirstOrDefault();
                if (result != null && result.HasValue)
                {
                    Debug.WriteLine($"Leaving Direct Messaging Hub {result.Value.Value}");
                    onlineUsers.Remove(result.Value.Key, out string? removedUser);
                }
            }
        }

        /// <summary>
        ///   This method returns the connection id of a user.
        /// </summary>
        /// <param name="userId"></param>
        /// <returns> The connection id of the user </returns>
        public string? GetConnectionId(string userId)
        {
            onlineUsers.TryGetValue(userId, out var connectionId);
            return connectionId;
        }
    }
}
