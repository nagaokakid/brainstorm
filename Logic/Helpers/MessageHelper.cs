using Database.Data;
using Logic.DTOs.Messages;

namespace Logic.Helpers
{
    public static class MessageHelper
    {
        public static DirectMessage FromDTO(this MessageInfo msg)
        {
            return new DirectMessage
            {
               FromUserId = msg.FromUserInfo.UserId,
                Message = msg.Message,
                Timestamp = msg.Timestamp,
            };
        }

        public static DirectMessageInfo ToDTO(this DirectMessage msg)
        {
            return new DirectMessageInfo
            {
                Message = msg.Message,
                Timestamp = msg.Timestamp,
            };
        }

        public static FriendlyDirectMessageHistory ToDTO(this DirectMessageHistory msgs, Dictionary<string, User> users)
        {
            return new FriendlyDirectMessageHistory
            {
                User1 = users[msgs.UserId1].ToFriendlyUser(),
                User2 = users[msgs.UserId2].ToFriendlyUser(),
                DirectMessages = msgs.DirectMessages.Select(x => x.ToDTO()).ToList(),
            };
        }

        public static List<FriendlyDirectMessageHistory> ToDTO(this List<DirectMessageHistory> msgs, Dictionary<string, User> users)
        {
            return msgs.Select(x=>x.ToDTO(users)).ToList();
        }
    }
}
