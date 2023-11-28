using MongoDB.Bson.Serialization.Attributes;

namespace Database.Data
{
    public class ChatRoomMessage
    {
        public string FromUserId { get; set; }

        public string Message { get; set; }

        public DateTime Timestamp { get; set; }
    }
}
