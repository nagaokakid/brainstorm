using MongoDB.Bson.Serialization.Attributes;

namespace Database.Data
{
    public class DirectMessageHistory
    {
        [BsonId]
        [BsonElement("_id")]
        public string Id { get; set; }

        [BsonElement("UserId1")]
        public string UserId1 { get; set; }

        [BsonElement("UserId2")]
        public string UserId2 { get; set; }

        [BsonElement("DirectMessages")]
        public List<DirectMessage> DirectMessages { get; set; }
    }
}
