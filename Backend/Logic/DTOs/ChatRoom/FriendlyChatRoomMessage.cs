/*
 * FriendlyChatRoomMessage.cs
 * -------------------------
 * Represents a FriendlyChatRoomMessage object from the database.
 * This file contains the data for the FriendlyChatRoomMessage.
 * ---------------------------------------------------------
 * Author: Mr. Roland Fehr
 * Last modified: 28.10.2023
 * Version: 1.7.1
*/

using Logic.DTOs.User;

namespace Logic.DTOs.ChatRoom
{
    /// <summary>
    /// This class contains data for the FriendlyChatRoomMessage
    /// </summary>
    public class FriendlyChatRoomMessage
    {
        public string MessageId { get; set; }
        public FriendlyUserInfo FromUser { get; set; }
        public string Message { get; set; }
        public DateTime Timestamp { get; set; }
    }
}
