namespace Logic.Models
{
    public class ChatRoomMessage
    {
        public User From { get; set; }
        public string Message { get; set; }
        public DateTime Timestamp { get; set; }
    }
}
