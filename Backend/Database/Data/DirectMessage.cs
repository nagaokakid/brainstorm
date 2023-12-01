using MongoDB.Bson.Serialization.Attributes;

namespace Database.Data
{
    public class DirectMessage
    {
        public string DirectMessageId { get; set; }
        public bool IsDeleted { get; set; }
        public string FromUserId { get; set; }

        public string Message { get; set; }

        public DateTime Timestamp { get; set; }
    }
}
