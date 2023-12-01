/*
 * ChatRoomNotFound.cs
 * -------------------------
 * This file contains the exception for when a chatroom is not found
 * ---------------------------------------------------------
 * Author: Mr. Roland Fehr
 * Last modified: 28.10.2023
 * Version: 1.0
*/


namespace Logic.Exceptions
{
    /// <summary>
    ///    This class represents the exception for when a chatroom is not found
    /// </summary>   
    public class ChatRoomNotFound : Exception
    {
        public ChatRoomNotFound() : base("ChatRoom not found")
        {

        }
    }
}
