/*
 * FriendlyUserInfo.cs
 * --------------------
 * Represents a FriendlyUserInfo object from the database.
 * This file contains the data for the FriendlyUserInfo.
 * ---------------------------------------------------------
 * Author: Mr. Roland Fehr
 * Last modified: 28.10.2023
 * Version: 1.0
*/

namespace Logic.DTOs.User
{
    /// <summary>
    ///   This class contains data for the FriendlyUserInfo
    /// </summary>
    public class FriendlyUserInfo
    {
        public string UserId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
    }
}
