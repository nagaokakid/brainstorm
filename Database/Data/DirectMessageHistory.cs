namespace Database.Data
{
    public class DirectMessageHistory
    {
        public string UserId1 { get; set; }
        public string UserId2 { get; set; }
        public List<DirectMessage> DirectMessages { get; set; }
    }
}
