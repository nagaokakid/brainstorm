using Logic.DTOs.User;

namespace Logic.DTOs.ChatRoom
{
    public class BrainstormDTO
    {
        public string SessionId { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public FriendlyUserInfo Creator { get; set; }
        public List<FriendlyUserInfo> Members { get; set; }
    }
}
