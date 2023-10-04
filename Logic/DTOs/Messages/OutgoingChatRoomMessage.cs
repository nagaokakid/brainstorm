namespace Logic.DTOs.Messages
{
    public class OutgoingChatRoomMessage
    {
        public string FromFirstLastName { get; set; }
        public string ChatRoomId { get; set; }
        public string Message { get; set; }
        public DateTime Timestamp { get; set; }
    }
}
