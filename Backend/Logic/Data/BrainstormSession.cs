using Logic.DTOs.User;

namespace Logic.Data
{
    public class BrainstormSession
    {
        public string SessionId { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string ChatRoomId { get; set; }
        public FriendlyUserInfo Creator { get; set; }
        public bool CanJoin { get; set; } = true;
        public List<FriendlyUserInfo> JoinedMembers { get; set; }
        public Dictionary<string, Idea> Ideas { get; set; }
        public DateTime IdeasAvailable { get; set; }
        public Timer? SendVoteTimer { get; set; }
    }
}
