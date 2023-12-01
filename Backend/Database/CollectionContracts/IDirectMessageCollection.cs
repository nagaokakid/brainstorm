using Database.Data;

/*
 * IDirectMessageCollection.cs
 * ---------------------------
 * This interface defines the methods that will be used by the DirectMessageCollection class.
 * -----------------------------------------------------------------------------------------------------------
 * Author: Mr. Roland Fehr and Mr. Akira Cooper
 * Last Updated: 30/10/2023
 * Date Created: 30/10/2023
 * Version 1.0
*/



namespace Database.CollectionContracts
{
    /// <summary>
    ///    This interface defines the methods that will be used by the DirectMessageCollection class.
    /// </summary>
    public interface IDirectMessageCollection
    {
        Task<string?> Add(string userId1, string userId2, DirectMessage message);
        Task<DirectMessageHistory?> Get(string userId1, string userId2);
        Task<List<DirectMessageHistory>> GetAll(string userId);
        Task RemoveDirectMessage(string fromUserId, string toUserId, string messageId);
    }
}
