using MongoDB.Bson.Serialization.Attributes;

/*
 * ChatRoom.cs
 * -------------------------
 * Represents a ChatRoom object from the database.
 * This file contains the data for the ChatRoom.
 * ---------------------------------------------------------
* Authors: Mr. Roland Fehr and Mr. Akira Cooper  
 * Date Created: 01.12.2023
 * Last modified: 01.12.2023
 * Version: 1.0
*/

namespace Database.Data
{
    /// <summary>
    ///   This class contains data for the ChatRoom
    /// </summary>
    public class ChatRoom
    {
        [BsonId]
        [BsonElement("_id")]
        public string Id { get; set; }

        public string Title { get; set; }
        public bool IsDeleted { get; set; }

        public string Description { get; set; }

        public string JoinCode { get; set; }

        public List<ChatRoomMessage> Messages { get; set; }

        public List<string> MemberIds { get; set; }
    }
}
