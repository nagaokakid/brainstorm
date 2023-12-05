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

        // Add a new user id to the member list for a chat room
        public async Task AddNewUserToChatRoom(string userId, string chatRoomId)
        {
            await chatRoomRepository.AddToArrayInDocument(chatRoomId, "MemberIds", userId);
        }

        // Add a new message object to the chat room's array
        public async Task AddMessage(string chatRoomId, ChatRoomMessage chatRoomMessage)
        {
            await chatRoomRepository.AddToArrayInDocument(chatRoomId, "Messages", chatRoomMessage);
        }

        // Get the chat room document with the given ID
        public async Task<ChatRoom?> GetById(string chatRoomId)
        {
            return await chatRoomRepository.GetDocumentById(chatRoomId);
        }

        // Get the chat room that matches the given join code (6 digit number)
        public async Task<ChatRoom?> GetByJoinCode(string joinCode)
        {
            Dictionary<string, string> fieldDict = new(1)
            {
                {"JoinCode", joinCode }
            };

            return await chatRoomRepository.GetDocumentByFieldDictionary(fieldDict);
        }

        // Remove a message from a chat room
        public async Task RemoveMessage(string chatRoomId, string messageId)
        {
            await chatRoomRepository.RemoveDocumentFromNestedCollection(chatRoomId, "ChatRoomMessage", "Messages", messageId);
        }

        // Edit an existing chat room (replace the document with a new one)
        public async Task EditChatRoom(ChatRoom chatroom)
        {
            var chatId = chatroom.Id;
            await chatRoomRepository.ReplaceDocument(chatId, chatroom);
        }

        // Delete a chat room
        public async Task Delete(string id)
        {
            await chatRoomRepository.DeleteDocument(id);
        }

        // Remove a user ID from a chat room's member ID list
        public async Task RemoveUser(string userId, string chatId)
        {
            await chatRoomRepository.RemoveFromArrayInDocument(chatId, "MemberIds", userId);
        }
    }
}
