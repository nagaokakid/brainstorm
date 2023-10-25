using Logic.DTOs.ChatRoom;
using Logic.DTOs.Messages;

namespace Logic.DTOs.User
{
    public class RegisterLoginResponse
    {
        public FriendlyUserInfo UserInfo { get; set; }
        public string Token { get; set; }
        public List<FriendlyChatRoom> ChatRooms { get; set; }
        public List<FriendlyDirectMessageHistory>? DirectMessages { get; set; }
    }
}
