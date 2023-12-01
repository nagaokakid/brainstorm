using MongoDB.Bson.Serialization.Attributes;

/*
 * DirectMessageHistory.cs
 * ------------------------
 * Represents a DirectMessageHistory object from the database.
 * This file contains the data for the DirectMessageHistory.
 * ---------------------------------------------------------
 * Authors: Mr. Roland Fehr and Mr. Akira Cooper
 * Last Updated: 1/12/2023
 * Date Created: 1/12/2023
 * Version: 1.0
 */

namespace Database.Data
{
    /// <summary>
    ///   This class contains data for the DirectMessageHistory
    /// </summary>
    public class DirectMessageHistory
    {
        [BsonId]
        [BsonElement("_id")]
        public string Id { get; set; }

        public string UserId1 { get; set; }

        public string UserId2 { get; set; }

        public List<DirectMessage> DirectMessages { get; set; }
    }
}
