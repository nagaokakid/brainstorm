namespace Logic.Models
{
    public class ChatRoom
    {
        public string Id { get; set; } // GUID 
        public string Name { get; set; }
        public string Description { get; set; }
        public int JoinCode { get; set; }
        public List<ChatRoomMessage> Messages { get; set; }
        public List<User> Members { get; set; }
    }
}
