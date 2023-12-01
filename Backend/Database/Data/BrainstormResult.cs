using MongoDB.Bson.Serialization.Attributes;

/* 
 * BrainstormResult.cs
 * -------------------------
 * Represents a BrainstormResult object from the database.
 * This file contains the data for the BrainstormResult.
 * ---------------------------------------------------------
 * Author: Mr. Roland Fehr
 *   Last Updated: 1/12/2023
 *   Date Created: 1/12/2023
 *   Version: 1.0
*/

namespace Database.Data
{
    /// <summary>
    ///  This class contains data for the BrainstormResult
    ///  </summary>
    public class BrainstormResult
    {
        [BsonId]
        [BsonElement("_id")]
        public string Id { get; set; }

        public string ChatroomId { get; set; }

        public DateTime EndTime { get; set; }

        public Dictionary<string, string> IdeasWithVotes { get; set; }
    }
}
