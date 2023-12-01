using Database.CollectionContracts;
using Database.Data;
using Database.MongoDB;


/* ChatRoomCollection.cs
 * ---------------------
 * This class is used to interact with the ChatRoom collection in the database.
 * -----------------------------------------------------------------------------------------------------------
 * Author: Mr. Akira Cooper & Mr. Roland Fehr
    * Last Updated: 30/10/2023
    * Date Created: 30/10/2023
    * Version 1.0
*/
namespace Database.Collections
{
    /// <summary>
    ///     This class implements IChatRoomCollection interface. It is used to interact with the ChatRoom collection in the database.
    /// </summary>
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

        public async Task AddNewUserToChatRoom(string userId)
        {

        }

        // Get the chat room document with the given ID
        public async Task<ChatRoom?> GetById(string chatRoomId)
        {
            return await chatRoomRepository.GetDocumentById(chatRoomId);
        }

        public async Task<ChatRoom?> GetByJoinCode(string joinCode)
        {
            Dictionary<string, string> fieldDict = new(1)
            {
                {"JoinCode", joinCode }
            };

            return await chatRoomRepository.GetDocumentByFieldDictionary(fieldDict);
        }

        public async Task RemoveMessage(string chatRoomId, string messageId)
        {
            // needs to be implemented
            await Task.Run(() => { });
        }

        public async Task EditChatRoom(ChatRoom chatroom)
        {
            // edit chatroom
        }

        public async Task Delete(string id)
        {
            // delete chatroom
        }

        public async Task RemoveUser(string id, string chatId)
        {
            // remove user from chatroom member list
        }
    }
}
