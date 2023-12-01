/*
 * FriendlyChatRoom.cs
 * --------------------
 * Represents a FriendlyChatRoom object from the database.
 * This file contains the data for the FriendlyChatRoom.
 * ---------------------------------------------------------
 * Author: Mr. Roland Fehr
 * Last modified: 28.10.2020
 * Version: 1
*/

using Database.Data;
using Logic.DTOs.Messages;
using Logic.DTOs.User;

namespace Logic.DTOs.ChatRoom
{
    /// <summary>
    /// This class contains data for the FriendlyChatRoom
    /// </summary>
    public class FriendlyChatRoom
    {
        public string Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string JoinCode { get; set; }
        public List<MessageInfo> Messages { get; set; }
        public List<FriendlyUserInfo> Members { get; set; }
    }
}
