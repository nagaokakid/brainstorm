using Logic.DTOs.User;

namespace Logic.Models
{
    public class ChatRoomMessage
    {
        public FriendlyUserInfo From { get; set; }
        public string Message { get; set; }
        public DateTime Timestamp { get; set; }
    }
}
