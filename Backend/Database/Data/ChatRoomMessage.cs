using MongoDB.Bson.Serialization.Attributes;

namespace Database.Data
{
    public class ChatRoomMessage
    {
        public string ChatRoomMessageId{ get; set; }
        public bool IsDeleted { get; set; }
        public string FromUserId { get; set; }

        public string Message { get; set; }

        public DateTime Timestamp { get; set; }
    }
}
