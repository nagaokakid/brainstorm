using MongoDB.Bson.Serialization.Attributes;

namespace Database.Data
{
    public class ChatRoom
    {
        [BsonId]
        [BsonElement("_id")]
        public string Id { get; set; }

        [BsonElement("Title")]
        public string Title { get; set; }

        [BsonElement("Description")]
        public string Description { get; set; }

        [BsonElement("JoinCode")]
        public string JoinCode { get; set; }

        [BsonElement("Messages")]
        public List<ChatRoomMessage> Messages { get; set; }

        [BsonElement("MemberIds")]
        public List<string> MemberIds { get; set; }
    }
}
