using MongoDB.Bson.Serialization.Attributes;

/*
 * DirectMessage.cs
 * ------------------------
 * Represents a DirectMessage object from the database.
 * This file contains the data for the DirectMessage.
 * ---------------------------------------------------------
 * Authors: Mr. Roland Fehr and Mr. Akira Cooper
 * Last Updated: 1/12/2023
 * Date Created: 1/12/2023
 * Version: 1.0
*/
namespace Database.Data
{
    /// <summary>
    ///    This class contains data for the DirectMessage
    /// </summary>
    public class DirectMessage
    {
        public string DirectMessageId { get; set; }
        public bool IsDeleted { get; set; }
        public string FromUserId { get; set; }

        public string Message { get; set; }

        public DateTime Timestamp { get; set; }
    }
}
