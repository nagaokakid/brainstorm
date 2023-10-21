using Logic.DTOs.User;
using System.Diagnostics;

namespace Logic.DTOs.Messages
{
    public class FriendlyDirectMessageHistory
    {
        public FriendlyUserInfo User1{ get; set; }
        public FriendlyUserInfo User2 { get; set; }
        public List<DirectMessageInfo> DirectMessages { get; set; }
    }
}
