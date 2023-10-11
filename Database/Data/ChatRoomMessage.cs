using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;

namespace Database.Data
{
    public class ChatRoomMessage
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        [BsonElement("_id")]
        public string FromUserId { get; set; }
        public string Message { get; set; }
        public DateTime Timestamp { get; set; }
    }
}
