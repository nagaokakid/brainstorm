/*
 * CreateChatRoomResponse.cs
 * -------------------------
 * Represents a CreateChatRoomResponse object from the database.
 * This file contains the data for the CreateChatRoomResponse.
 * ---------------------------------------------------------
 * Author: Mr. Roland Fehr
 * Last modified: 28.10.2023
 * Version: 1.0
*/

namespace Logic.DTOs.ChatRoom
{
    /// <summary>
    /// This class contains data for the CreateChatRoomResponse
    /// </summary>
    public class CreateChatRoomResponse
    {
        public FriendlyChatRoom ChatRoom { get; set; }
    }
}
