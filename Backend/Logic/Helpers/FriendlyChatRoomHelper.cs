using Database.Data;
using Logic.DTOs.ChatRoom;
using System.Runtime.CompilerServices;

namespace Logic.Helpers
{
    public static class FriendlyChatRoomHelper
    {
        public static FriendlyChatRoom ToDTO(this ChatRoom chatRoom, Dictionary<string, User> users)
        {
            return new FriendlyChatRoom
            {
                Id = chatRoom.Id, 
                Description = chatRoom.Description,
                Title = chatRoom.Title,
                JoinCode = chatRoom.JoinCode,
                Messages = chatRoom.Messages.ToDTO(users),
                Members = chatRoom.MemberIds.ToFriendlyUserInfo(users)
            };
        }
    }
}
