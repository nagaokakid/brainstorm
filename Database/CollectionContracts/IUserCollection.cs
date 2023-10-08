using Database.Data;

namespace Database.CollectionContracts
{
    public interface IUserCollection
    {
        Task<User?> Get(string userId);
        Task<User?> Get(string username, string password);
        Task Add(User newUser);
        Task<bool> DoesUsernameExist(string username);
        Task AddChatRoomToUser(string userId, string chatRoomId);
    }
}
