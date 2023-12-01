/*
 * FriendlyChatRoomHelper.cs
 * -------------------------
 * This file contains the FriendlyChatRoomHelper.
 * ---------------------------------------------------------
 * Author: Mr. Roland Fehr
 * Last modified: 28.10.2023
 * Version: 1.0
*/

using Database.Data;
using Logic.DTOs.ChatRoom;
using System.Runtime.CompilerServices;

namespace Logic.Helpers
{
    /// <summary>
    ///  This static  class contains the FriendlyChatRoomHelper
    ///  </summary>
    public static class FriendlyChatRoomHelper
    {
        /// <summary>
        /// This static method converts a ChatRoom object to a FriendlyChatRoom object
        /// </summary>
        /// <param name="chatRoom">The ChatRoom object to convert</param>
        /// <param name="users">The users to convert</param>
        /// <returns>The converted FriendlyChatRoom object</returns>
        public static FriendlyChatRoom ToDTO(this ChatRoom chatRoom, Dictionary<string, User> users)
        {
            return new FriendlyChatRoom
            {
                Id = chatRoom.Id,
                Description = chatRoom.Description,
                Title = chatRoom.Title,
                JoinCode = chatRoom.JoinCode,
                Messages = chatRoom.Messages.ToDTO(users),
                Members = chatRoom.MemberIds.ToFriendlyUserInfo(users)
            };
        }
    }
}
