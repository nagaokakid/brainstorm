/* 
 * DirectMessageInfo.cs
 * -------------------------
 * Represents a DirectMessageInfo object from the database.
 * This file contains the data for the DirectMessageInfo.
 * ---------------------------------------------------------
 * Author: Mr. Roland Fehr
 * Last modified: 28.10.2023
 * Version: 1.0
*/

namespace Logic.DTOs.Messages
{
    /// <summary>
    ///   This class contains the data for the DirectMessageInfo
    /// </summary>
    public class DirectMessageInfo
    {
        public string MessageId { get; set; }
        public string Message { get; set; }
        public DateTime Timestamp { get; set; }
    }
}
