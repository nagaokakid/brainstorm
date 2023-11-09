using Logic.DTOs.User;

namespace Logic.DTOs.ChatRoom
{
    public class FriendlyChatRoomMessage
    {
        public FriendlyUserInfo FromUser { get; set; }
        public string Message { get; set; }
        public DateTime Timestamp { get; set; }
    }
}
