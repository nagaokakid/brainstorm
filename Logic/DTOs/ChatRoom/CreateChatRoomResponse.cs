using Logic.DTOs.User;
using Logic.Models;

namespace Logic.DTOs.ChatRoom
{
    public class CreateChatRoomResponse
    {
        public string Id { get; set; } // GUID 
        public string Title { get; set; }
        public string Description { get; set; }
        public int JoinCode { get; set; }
        public List<ChatRoomMessage> Messages { get; set; }
        public List<FriendlyUserInfo> GroupMembers { get; set; }
    }
}
