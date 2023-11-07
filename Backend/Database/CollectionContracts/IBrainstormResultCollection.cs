using Database.Data;

namespace Database.CollectionContracts
{
    public interface IBrainstormResultCollection
    {
        Task Add(BrainstormResult brainstormResult);
        Task Get(string id);
        Task GetAllByUserId(string userId);
        Task GetAllByChatroomId(string chatroomId);
    }
}
