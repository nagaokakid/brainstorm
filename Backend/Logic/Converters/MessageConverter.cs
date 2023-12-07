/*
 * MessageHelper.cs
 * -------------------------
 * Represents a MessageHelper object from the database.
 * This file contains the data for the MessageHelper.
 * ---------------------------------------------------------
 * Author: Mr. Roland Fehr
 * Last modified: 28.10.2023
 * Version: 1.0
*/

using Database.Data;
using Logic.DTOs.Messages;

namespace Logic.Converters
{
    /// <summary>
    ///   This static class contains the data for the MessageHelper
    /// </summary>
    public static class MessageConverter
    {
        /// <summary>
        ///  This static method converts a MessageInfo object to a DirectMessage object
        /// </summary>
        /// <param name="msg"> The MessageInfo object to convert </param>
        /// <returns> The converted DirectMessage object </returns>
        public static DirectMessage FromDTO(this MessageInfo msg)
        {
            return new DirectMessage
            {
                DirectMessageId = msg.MessageId,
                FromUserId = msg.FromUserInfo.UserId,
                Message = msg.Message,
                Timestamp = msg.Timestamp,
            };
        }

        /// <summary>
        ///  This static method converts a DirectMessage object to a DirectMessageInfo object
        ///  </summary>
        ///  <param name="msg"> The DirectMessage object to convert </param>
        ///  <returns> The converted DirectMessageInfo object </returns>
        public static DirectMessageInfo ToDTO(this DirectMessage msg)
        {
            return new DirectMessageInfo
            {
                FromUserId = msg.FromUserId,
                MessageId = msg.DirectMessageId,
                Message = msg.Message,
                Timestamp = msg.Timestamp,
            };
        }

        /// <summary>
        /// This static method converts a DirectMessageHistory object to a FriendlyDirectMessageHistory object
        /// </summary>
        /// <param name="msgs"> The DirectMessageHistory object to convert </param>
        /// <param name="users"> The users to convert </param>
        /// <returns> The converted FriendlyDirectMessageHistory object </returns>
        public static FriendlyDirectMessageHistory ToDTO(this DirectMessageHistory msgs, Dictionary<string, User> users)
        {
            users.TryGetValue(msgs.UserId1, out var u1);
            users.TryGetValue(msgs.UserId2, out var u2);

            return new FriendlyDirectMessageHistory
            {
                User1 = u1 != null ? u1.ToFriendlyUser() : null,
                User2 = u2 != null ? u2.ToFriendlyUser() : null,
                DirectMessages = msgs.DirectMessages.Select(x => x.ToDTO()).ToList(),
            };
        }

        /// <summary>
        /// This static method converts a List of DirectMessageHistory objects to a List of FriendlyDirectMessageHistory objects
        /// </summary>
        /// <param name="msgs"> The List of DirectMessageHistory objects to convert </param>
        /// <param name="users"> The users to convert </param>
        /// <returns> The converted List of FriendlyDirectMessageHistory objects </returns>
        public static List<FriendlyDirectMessageHistory> ToDTO(this List<DirectMessageHistory> msgs, Dictionary<string, User> users)
        {
            return msgs.Select(x => x.ToDTO(users)).ToList();
        }
    }
}
