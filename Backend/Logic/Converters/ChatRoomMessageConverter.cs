/*
 * ChatroomMessageHelper.cs
 * -------------------------
 * This file contains the ChatroomMessageHelper.
 * ---------------------------------------------------------
 * Author: Mr. Roland Fehr
 * Last modified: 28.10.2023
 * Version: 1.0
*/

using Database.Data;
using Logic.DTOs.ChatRoom;
using Logic.DTOs.Messages;
using Logic.DTOs.User;

namespace Logic.Converters
{
    /// <summary>
    ///  This static class contains the ChatroomMessageHelper
    ///  </summary>
    public static class ChatRoomMessageConverter
    {
        /// <summary>
        ///  This static method converts a ChatRoomMessage to a FriendlyChatRoomMessage
        /// </summary>
        /// <param name="chatRoomMessage"> The ChatRoomMessage to convert </param>
        /// <param name="users"> The users to convert </param>
        /// <returns> The converted FriendlyChatRoomMessage </returns>
        public static FriendlyChatRoomMessage ToDTO(this ChatRoomMessage chatRoomMessage, Dictionary<string, User> users)
        {
            return new FriendlyChatRoomMessage
            {
                MessageId = chatRoomMessage.ChatRoomMessageId,
                FromUser = chatRoomMessage.FromUserId.ToFriendlyUserInfo(users),
                Message = chatRoomMessage.Message,
                Timestamp = chatRoomMessage.Timestamp,
            };
        }

        /// <summary>
        ///  This static method converts a ChatRoomMessage to a DirectMessageInfo
        ///  </summary>
        ///  <param name="chatRoomMessage"> The ChatRoomMessage to convert </param>
        ///  <returns> The converted DirectMessageInfo </returns>
        public static List<MessageInfo> ToDTO(this IEnumerable<ChatRoomMessage> messages, Dictionary<string, User> users)
        {
            if (messages != null && messages.Any())
            {
                return messages.Select(x => new MessageInfo
                {
                    Message = x.Message,
                    Timestamp = x.Timestamp,
                    FromUserInfo = x.FromUserId.ToFriendlyUserInfo(users),
                }).ToList();
            }
            return new List<MessageInfo>();
        }
    }
}
