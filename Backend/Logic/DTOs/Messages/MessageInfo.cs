/* 
 *  MessageInfo.cs
 *  --------------------
 *  Represents a MessageInfo object from the database.
 *  This file contains the data for the MessageInfo.
 *  ---------------------------------------------------------
 *  Author: Mr. Roland Fehr
 *  Last modified: 28.10.2023
 *  Version: 1.9
*/

using Logic.DTOs.User;

namespace Logic.DTOs.Messages
{
    /// <summary>
    ///   This class contains data for the MessageInfo
    /// </summary>
    public class MessageInfo
    {
        public string MessageId { get; set; }
        public FriendlyUserInfo FromUserInfo { get; set; }
        public FriendlyUserInfo? ToUserInfo { get; set; }
        public string? ChatRoomId { get; set; }
        public string Message { get; set; }
        public DateTime Timestamp { get; set; }
    }
}
