using Database.CollectionContracts;
using Database.Data;
using Database.MongoDB;

namespace Database.Collections
{
    public class ChatRoomCollection : IChatRoomCollection
    {
        // The chat room collection from MongoDB
        private MongoRepository<ChatRoom> chatRoomRepository = new("brainstorm", "ChatRoom");

        // Add a new chat room document to the collection
        public async Task Add(ChatRoom chatRoom)
        {
            await chatRoomRepository.CreateDocument(chatRoom);
        }

        public async Task AddNewUserToChatRoom(string userId, string chatRoomId)
        {
            await chatRoomRepository.AddToArrayInDocument(chatRoomId, "MemberIds", userId);
        }

        // Add a new message object to the document's array
        public async Task AddMessage(string chatRoomId, ChatRoomMessage chatRoomMessage)
        {
            await chatRoomRepository.AddToArrayInDocument(chatRoomId, "Messages", chatRoomMessage);
        }

        // Get the chat room document with the given ID
        public async Task<ChatRoom?> GetById(string chatRoomId)
        {
            return await chatRoomRepository.GetDocumentById(chatRoomId);
        }

        public async Task<ChatRoom?> GetByJoinCode(string joinCode)
        {
            List<string> fieldNames = new List<string>
            {
                "JoinCode"
            };

            List<string> fieldValues = new List<string>
            {
                joinCode
            };

            return await chatRoomRepository.GetDocumentByFieldValues(fieldNames, fieldValues);
        }
    }
}
