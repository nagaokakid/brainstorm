using Database.Data;

namespace Database.CollectionContracts
{
    public interface IDirectMessageCollection
    {
        Task Add(DirectMessage message);
        Task<IEnumerable<DirectMessage>> Get(string fromUserId, string toUserId);
    }
}
