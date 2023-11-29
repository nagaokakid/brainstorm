/*
 * BrainstormDTO.cs
 * ----------------
 * Represents a BrainstormDTO object from the database.
 * This file contains the data for the BrainstormDTO.
 * ---------------------------------------------------------
 * Author: Mr. Roland Fehr
 * Last modified: 28.10.2023
 * Version: 1.0
*/

using Logic.DTOs.User;

namespace Logic.DTOs.ChatRoom
{
    /// <summary>
    ///  This class contains data for the BrainstormDTO
    ///  </summary>
    public class BrainstormDTO
    {
        public string SessionId { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public FriendlyUserInfo Creator { get; set; }
        public List<FriendlyUserInfo> Members { get; set; }
    }
}
