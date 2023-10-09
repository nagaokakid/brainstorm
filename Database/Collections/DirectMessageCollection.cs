using Database.CollectionContracts;
using Database.Data;

namespace Database.Collections
{
    public class DirectMessageCollection : IDirectMessageCollection
    {
        private List<DirectMessage> directMessages = new();
        public async Task Add(DirectMessage message)
        {
            directMessages.Add(message);
        }

        public async Task<IEnumerable<DirectMessage>> Get(string fromUserId, string toUserId)
        {
            // get all messages between 2 users
            var found = directMessages.Where(x => x.FromUserId.Equals(fromUserId) && x.ToUserId.Equals(toUserId));
            if (found != null) return found;
            
            // return empty list
            return new List<DirectMessage>();
        }
    }
}
