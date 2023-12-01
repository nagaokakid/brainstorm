/*
 * RegisterLoginResponse.cs
 * -------------------------
 * Represents a RegisterLoginResponse object from the database.
 * This file contains the data for the RegisterLoginResponse.
 * ---------------------------------------------------------
 * Author: Mr. Roland Fehr
 * Last modified: 28.10.2023
 * Version: 1.0  
*/

using Logic.DTOs.ChatRoom;
using Logic.DTOs.Messages;

namespace Logic.DTOs.User
{
    /// <summary>
    ///   This class contains data for the RegisterLoginResponse
    /// </summary>
    public class RegisterLoginResponse
    {
        public FriendlyUserInfo UserInfo { get; set; }
        public string Token { get; set; }
        public List<FriendlyChatRoom> ChatRooms { get; set; }
        public List<FriendlyDirectMessageHistory>? DirectMessages { get; set; }
    }
}
