namespace Database.Data
{
    public class DirectMessage
    {
        public string FromUserId { get; set; }
        public string ToUserId { get; set; }
        public string Message { get; set; }
        public DateTime Timestamp { get; set; }
    }
}
