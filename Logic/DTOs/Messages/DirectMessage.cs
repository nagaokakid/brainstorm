using Logic.DTOs.User;

namespace Logic.DTOs.Messages
{
    public class DirectMessage
    {
        public FriendlyUserInfo FromUserId { get; set; }
        public string ToUserId { get; set; }
        public string Message { get; set; }
        public DateTime Timestamp { get; set; }
    }
}
