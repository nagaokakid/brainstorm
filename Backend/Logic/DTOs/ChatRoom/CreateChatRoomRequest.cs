/*
 * CreateChatRoomRequest.cs
 * -------------------------
 * Represents a CreateChatRoomRequest object from the database.
 * This file contains the data for the CreateChatRoomRequest.
 * ---------------------------------------------------------
 * Author: Mr. Roland Fehr
 * Last modified: 28.10.2023
 * Version: 2.1
*/

namespace Logic.DTOs.ChatRoom
{
    /// <summary>
    ///    This class contains data for the CreateChatRoomRequest
    /// </summary>
    public class CreateChatRoomRequest
    {
        public string UserId { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
    }
}
