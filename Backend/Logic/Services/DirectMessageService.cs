/*
 * DirectMessageService.cs
 * -------------------------
 * This file contains the DirectMessageService class, which is responsible for handling direct messages.
 * -----------------------------------------------------------------------------------------------
 * Author: Mr. Roland Fehr & Mr. Akira Cooper
 * Last modified: 28.10.2023
 * Version: 1.0
*/

using Database.CollectionContracts;
using Logic.DTOs.Messages;
using Logic.Helpers;

namespace Logic.Services
{
    /// <summary>
    /// This class is responsible for handling direct messages.
    /// </summary>
    public class DirectMessageService
    {
        private readonly IDirectMessageCollection directMessageCollection;
        private readonly IUserCollection userCollection;

        /// <summary>
        ///     Constructor for the DirectMessageService class.
        /// </summary>
        /// <param name="directMessageCollection"></param>
        /// <param name="userCollection"></param>
        public DirectMessageService(IDirectMessageCollection directMessageCollection, IUserCollection userCollection)
        {
            this.directMessageCollection = directMessageCollection;
            this.userCollection = userCollection;
        }

        /// <summary>
        ///    Adds a new direct message to the database.
        /// </summary>
        /// <param name="msg"></param>
        public async Task AddNewMessage(MessageInfo msg)
        {
            var returnId = await directMessageCollection.Add(msg.FromUserInfo.UserId, msg.ToUserInfo.UserId, msg.FromDTO());
            if (returnId != null) // new direct message history was created in db; add ID to both users
            {
                await userCollection.AddDirectMessageHistoryToUser(msg.FromUserInfo.UserId, returnId);
                await userCollection.AddDirectMessageHistoryToUser(msg.ToUserInfo.UserId, returnId);
            }
        }

        /// <summary>
        ///   Returns null if no direct messages were found.
        ///   Gets all direct messages for a user with userid.
        /// </summary>
        /// <param name="userId"></param>
        /// <returns> A list of direct messages. </returns>
        public async Task<FriendlyDirectMessageHistory?> GetMessagesByUserId(string userId1, string userId2)
        {
            if (userId1 == null) throw new ArgumentNullException($"{nameof(userId1)} parameter is null");
            if (userId2 == null) throw new ArgumentNullException($"{nameof(userId2)} parameter is null");

            var result = await directMessageCollection.Get(userId1, userId2);
            if (result == null) return null;
            return result.ToDTO(await userCollection.GetAll());
        }

        /// <summary>
        ///    This method removes a direct message.
        /// </summary>
        /// <param name="fromUserId"></param>
        /// <param name="toUserId"></param>
        /// <param name="messageId"></param>
        public async Task RemoveDirectMessage(string fromUserId, string toUserId, string messageId)
        {
            await directMessageCollection.RemoveDirectMessage(fromUserId, toUserId, messageId);
        }
    }
}
