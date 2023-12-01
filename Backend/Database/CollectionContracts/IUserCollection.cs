using Database.Data;

/*
 * IUserCollection.cs
 * ---------------------------
 * This interface defines the methods that will be used by the UserCollection class.
 * -----------------------------------------------------------------------------------------------------------
 * Author: Mr. Roland Fehr
 * Last Updated: 30/10/2023
 * Date Created: 30/10/2023
 * Version 1.0
*/

namespace Database.CollectionContracts
{
    /// <summary>
    ///     This interface defines the methods that will be used by the UserCollection class.
    /// </summary>
    public interface IUserCollection
    {
        Task<User?> Get(string userId);
        Task<User?> Get(string username, string password);
        Task Add(User newUser);
        Task<bool> DoesUsernameExist(string username);
        Task AddChatRoomToUser(string userId, string chatRoomId);
        Task AddDirectMessageHistoryToUser(string userId, string directMessageHistoryId);
        Task AddBrainstormResultToUser(string userId, string brainstormResultId);
        Task<Dictionary<string, User>> GetAll();
    }
}
