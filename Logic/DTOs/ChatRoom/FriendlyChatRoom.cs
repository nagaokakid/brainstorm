using Database.Data;
using Logic.DTOs.Messages;
using Logic.DTOs.User;

namespace Logic.DTOs.ChatRoom
{
    public class FriendlyChatRoom
    {
        public string Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public int JoinCode { get; set; }
        public List<MessageInfo> Messages { get; set; }
        public List<FriendlyUserInfo> Members { get; set; }
    }
}
