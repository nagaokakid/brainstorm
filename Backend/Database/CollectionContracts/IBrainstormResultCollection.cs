using Database.Data;

namespace Database.CollectionContracts
{
    public interface IBrainstormResultCollection
    {
        Task Add(BrainstormResult brainstormResult);
        Task<BrainstormResult> Get(string id);
        Task<List<BrainstormResult>> GetAllByUserId(string userId);
        Task<List<BrainstormResult>> GetAllByChatroomId(string chatroomId);
    }
}
