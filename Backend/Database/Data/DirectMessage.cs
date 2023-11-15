using MongoDB.Bson.Serialization.Attributes;

namespace Database.Data
{
    [BsonIgnoreExtraElements]
    public class DirectMessage
    {
        [BsonElement("FromUserId")]
        public string FromUserId { get; set; }

        [BsonElement("Message")]
        public string Message { get; set; }

        [BsonElement("Timestamp")]
        public DateTime Timestamp { get; set; }
    }
}
