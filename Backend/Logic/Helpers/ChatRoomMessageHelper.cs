using Database.Data;
using Logic.DTOs.ChatRoom;
using Logic.DTOs.Messages;
using Logic.DTOs.User;

namespace Logic.Helpers
{
    public static class ChatRoomMessageHelper
    {
        public static FriendlyChatRoomMessage ToDTO(this ChatRoomMessage chatRoomMessage, Dictionary<string, User> users)
        {
            return new FriendlyChatRoomMessage
            {
                MessageId = chatRoomMessage.ChatRoomMessageId,
                FromUser = chatRoomMessage.FromUserId.ToFriendlyUserInfo(users),
                Message = chatRoomMessage.Message,
                Timestamp = chatRoomMessage.Timestamp,
            };
        }

        public static List<MessageInfo> ToDTO(this IEnumerable<ChatRoomMessage> messages, Dictionary<string, User> users)
        {
            if(messages != null && messages.Any())
            {
                return messages.Select(x => new MessageInfo
                {
                    Message = x.Message,
                    Timestamp = x.Timestamp,
                    FromUserInfo = x.FromUserId.ToFriendlyUserInfo(users),
                }).ToList();
            }
            return new List<MessageInfo>();
        }
    }
}
