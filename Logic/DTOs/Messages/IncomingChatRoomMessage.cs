namespace Logic.DTOs.Messages
{
    public class IncomingChatRoomMessage
    {
        public string FromUserId { get; set; }
        public string ChatRoomId { get; set; }
        public string Message { get; set; }
    }
}
