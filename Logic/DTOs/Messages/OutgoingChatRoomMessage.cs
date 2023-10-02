namespace Logic.DTOs.Messages
{
    public class OutgoingChatRoomMessage
    {
        public string FromFirstLastname { get; set; }
        public string ChatRoomId { get; set; }
        public string Message { get; set; }
        public DateTime Timestamp { get; set; }
    }
}
