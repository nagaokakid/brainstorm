/*
 * MessageInfoJoinSession.cs
 * -------------------------
 * Represents a MessageInfoJoinSession object from the database.
 * This file contains the data for the MessageInfoJoinSession.
 * ---------------------------------------------------------
 * Author: Mr. Roland Fehr
 * Last modified: 28.10.2023
 * Version: 3.1
*/

using Logic.DTOs.ChatRoom;

namespace Logic.DTOs.Messages
{
    /// <summary>
    ///   This class contains data for the MessageInfoJoinSession
    /// </summary>
    public class MessageInfoJoinSession : MessageInfo
    {
        public BrainstormDTO Brainstorm { get; set; }
    }
}
