namespace Logic.DTOs.User
{
    public class RegisterLoginResponse
    {
        public FriendlyUserInfo UserInfo { get; set; }
        public string Token { get; set; }
        public List<Models.ChatRoom> ChatRooms { get; set; }
    }
}
