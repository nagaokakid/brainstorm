using Database.Data;
/* IBrainstormResultCollection.cs
 * -------------------------------
 * This interface defines the methods that will be used by the BrainstormResultCollection class.
 * -----------------------------------------------------------------------------------------------------------
 * Author: Mr. Akira Cooper
 * Last Updated: 28/10/2023
 * Date Created: 28/10/2023
 * Version 1.0
*/



namespace Database.CollectionContracts
{
    /// <summary>
    /// This interface defines the methods that will be used by the BrainstormResultCollection class.
    /// </summary>
    public interface IBrainstormResultCollection
    {
        Task Add(BrainstormResult brainstormResult);
        Task<BrainstormResult> Get(string id);
        Task<List<BrainstormResult>> GetAllByUserId(string userId);
        Task<List<BrainstormResult>> GetAllByChatroomId(string chatroomId);
    }
}
