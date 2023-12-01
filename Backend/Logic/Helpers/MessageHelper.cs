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
                DirectMessageId = msg.MessageId,
                FromUserId = msg.FromUserInfo.UserId,
                Message = msg.Message,
                Timestamp = msg.Timestamp,
            };
        }

        public static DirectMessageInfo ToDTO(this DirectMessage msg)
        {
            return new DirectMessageInfo
            {
                MessageId = msg.DirectMessageId,
                Message = msg.Message,
                Timestamp = msg.Timestamp,
            };
        }

        public static FriendlyDirectMessageHistory ToDTO(this DirectMessageHistory msgs, Dictionary<string, User> users)
        {
            users.TryGetValue(msgs.UserId1, out var u1);
            users.TryGetValue(msgs.UserId2, out var u2);

            return new FriendlyDirectMessageHistory
            {
                User1 =  u1 != null ? u1.ToFriendlyUser() :null,
                User2 = u2 != null ? u2.ToFriendlyUser(): null,
                DirectMessages = msgs.DirectMessages.Select(x => x.ToDTO()).ToList(),
            };
        }

        public static List<FriendlyDirectMessageHistory> ToDTO(this List<DirectMessageHistory> msgs, Dictionary<string, User> users)
        {
            return msgs.Select(x=>x.ToDTO(users)).ToList();
        }
    }
}
