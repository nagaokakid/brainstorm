using Logic.DTOs.ChatRoom;

namespace Logic.DTOs.User
{
    public class RegisterLoginResponse
    {
        public FriendlyUserInfo UserInfo { get; set; }
        public string Token { get; set; }
        public List<FriendlyChatRoom> ChatRooms { get; set; }
    }
}
