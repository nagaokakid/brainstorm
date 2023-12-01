using Database.Data;

/*
 * IChatRoomCollection.cs
 * -----------------------
 *  This interface defines the methods that will be used by the ChatRoomCollection class.
 * -----------------------------------------------------------------------------------------------------------
 * Author: Mr. Akira Cooper & Mr. Roland Fehr
 * Last Updated: 30/10/2023
 * Date Created: 30/10/2023
 * Version 1.0
*/

namespace Database.CollectionContracts
{
    /// <summary>
    ///   This interface defines the methods that will be used by the ChatRoomCollection class.
    /// </summary>
    public interface IChatRoomCollection
    {
        Task Add(ChatRoom chatRoom);
        Task AddNewUserToChatRoom(string userId, string chatRoomId);
        Task<ChatRoom?> GetByJoinCode(string joinCode);
        Task<ChatRoom?> GetById(string chatRoomId);
        Task AddMessage(string chatRoomId, ChatRoomMessage chatRoomMessage);
        Task RemoveMessage(string chatRoomId, string messageId);
        Task EditChatRoom(ChatRoom chatroom);
        Task Delete(string id);
        Task RemoveUser(string id, string chatId);
    }
}
