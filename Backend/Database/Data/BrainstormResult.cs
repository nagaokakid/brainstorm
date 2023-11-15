using MongoDB.Bson.Serialization.Attributes;

namespace Database.Data
{
    public class BrainstormResult
    {
        [BsonId]
        [BsonElement("_id")]
        public string Id { get; set; }

        [BsonElement("ChatroomId")]
        public string ChatroomId { get; set; }

        [BsonElement("EndTime")]
        public DateTime EndTime { get; set; }

        [BsonElement("IdeasWithVotes")]
        public Dictionary<string, string> IdeasWithVotes { get; set; }
    }
}
