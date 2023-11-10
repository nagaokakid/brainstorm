using MongoDB.Bson.Serialization.Attributes;

namespace Database.Data
{
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
