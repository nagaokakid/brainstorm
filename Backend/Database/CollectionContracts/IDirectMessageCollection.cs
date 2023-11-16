using Database.Data;

namespace Database.CollectionContracts
{
    public interface IDirectMessageCollection
    {
        Task<string?> Add(string userId1, string userId2, DirectMessage message);
        Task<DirectMessageHistory?> Get(string userId1, string userId2);
        Task<List<DirectMessageHistory>> GetAll(string userId);
    }
}
