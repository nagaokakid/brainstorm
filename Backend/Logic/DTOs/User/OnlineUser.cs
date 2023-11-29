/*
 * OnlineUser.cs
 * -------------------------
 * Represents a OnlineUser object from the database.
 * This file contains the data for the OnlineUser.
 * ---------------------------------------------------------
 * Author: Mr. Roland Fehr
 * Last modified: 28.10.2023
 * Version: 1.0
*/

namespace Logic.DTOs.User
{
    /// <summary>
    ///   This class contains data for the OnlineUser
    /// </summary>
    public class OnlineUser
    {
        public string ConnectionId { get; set; }
        public FriendlyUserInfo UserInfo { get; set; }
    }
}
