using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;

namespace Database.Data
{
    public class ChatRoom
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        [BsonElement("_id")]
        public string Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string JoinCode { get; set; }
        public List<ChatRoomMessage> Messages { get; set; }
        public List<string> MemberIds { get; set; }
    }
}
