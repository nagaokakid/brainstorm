using Database.CollectionContracts;
using Database.Data;

namespace Database.Collections
{
    public class ChatRoomCollection : IChatRoomCollection
    {
        private List<ChatRoom> chatRooms = new();
        public async Task Add(ChatRoom chatRoom)
        {
            chatRooms.Add(chatRoom);
        }

        public async Task AddMessage(string chatRoomId, ChatRoomMessage chatRoomMessage)
        {
            var found = chatRooms.Find(x => x.Id == chatRoomId);
            if(found != null)
            {
                found.Messages.Add(chatRoomMessage);
            }
        }

        public async Task<ChatRoom?> GetById(string chatRoomId)
        {
            return chatRooms.Find(x => x.Id == chatRoomId);
        }

        public async Task<ChatRoom?> GetByJoinCode(string joinCode)
        {
            return chatRooms.Find(x => x.JoinCode == joinCode);
        }
    }
}
