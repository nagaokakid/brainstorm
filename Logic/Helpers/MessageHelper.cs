using Database.Data;
using Logic.DTOs.Messages;
using Logic.DTOs.User;

namespace Logic.Helpers
{
    public static class MessageHelper
    {
        public static DirectMessage FromDTO(this MessageInfo msg)
        {
            return new DirectMessage
            {
                FromUserId = msg.FromUserInfo.UserId,
                ToUserId = msg.ToUserInfo.UserId,
                Message = msg.Message,
                Timestamp = msg.Timestamp,
            };
        }

        public static MessageInfo ToDTO(this DirectMessage msg, Dictionary<string, User> users)
        {
            return new MessageInfo
            {
                FromUserInfo = users[msg.FromUserId].ToFriendlyUser(),
                ToUserInfo = users[msg.ToUserId].ToFriendlyUser(),
                Message = msg.Message,
                Timestamp = msg.Timestamp,
            };
        }

        public static List<MessageInfo> ToDTO(this IEnumerable<DirectMessage> directMessages, Dictionary<string, User> users)
        {
            List<MessageInfo> result = new();
            foreach (var msg in directMessages)
            {
                result.Add(msg.ToDTO(users));
            }
            return result;
        }
    }
}
