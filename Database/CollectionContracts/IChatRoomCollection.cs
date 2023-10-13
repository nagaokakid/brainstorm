using Database.Data;

namespace Database.CollectionContracts
{
    public interface IChatRoomCollection
    {
        Task Add(ChatRoom chatRoom);
        Task<ChatRoom?> GetByJoinCode(string joinCode);
        Task<ChatRoom?> GetById(string chatRoomId);
        Task AddMessage( string chatRoomId, ChatRoomMessage chatRoomMessage);
    }
}
