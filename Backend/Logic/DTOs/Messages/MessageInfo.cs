using Logic.DTOs.User;

namespace Logic.DTOs.Messages
{
    public class MessageInfo
    {
        public FriendlyUserInfo FromUserInfo { get; set; }
        public FriendlyUserInfo? ToUserInfo { get; set; }
        public string? ChatRoomId { get; set; }
        public string Message { get; set; }
        public DateTime Timestamp { get; set; }
    }
}
