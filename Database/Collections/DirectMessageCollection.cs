using Database.CollectionContracts;
using Database.Data;
using Database.MongoDB;

namespace Database.Collections
{
    public class DirectMessageCollection : IDirectMessageCollection
    {
        // Stub Database Collection
        List<DirectMessageHistory> directMessages = new();


        // The direct message collection from MongoDB
        private MongoRepository<DirectMessage> directMessageRepository = new("DirectMessage");

        // Add a new direct message document to the collection
        public async Task Add(string userId1, string userId2, DirectMessage message)
        {
            var find = await Get(userId1, userId2);
            if(find == null)
            {
                // users have not exchanged direct messages before
                var hist = new DirectMessageHistory
                {
                    UserId1 = userId1,
                    UserId2 = userId2,
                    DirectMessages = new List<DirectMessage> { message },
                };
                directMessages.Add(hist);
            }
            else
            {
                find.DirectMessages.Add(message);
            }
            //var result = await Get(userId1, userId2);
            //result.DirectMessages.Add(message);
            //await directMessageRepository.CreateDocument(message);
        }

        // Get all messages between two users from the collection
        //public async Task<IEnumerable<DirectMessage>> Get(string fromUserId, string toUserId)
        //{
        //    List<string> fieldNames = new List<string>
        //    {
        //        "FromUserId",
        //        "ToUserId"
        //    };

        //    List<string> fieldValues = new List<string>
        //    {
        //        fromUserId,
        //        toUserId
        //    };

        //    return await directMessageRepository.GetAllDocumentsByFieldValues(fieldNames, fieldValues);

        //}

        public async Task<List<DirectMessageHistory>> GetAll(string userId)
        {
            var result = directMessages.Where(x => x.UserId1 == userId || x.UserId2 == userId)?.ToList();
            return result ?? new List<DirectMessageHistory>();
        }


        public async Task<DirectMessageHistory?> Get(string userId1, string userId2)
        {
            return directMessages.FirstOrDefault(x => (x.UserId1 == userId1 && x.UserId2 == x.UserId2) || (x.UserId1 == userId2 && x.UserId2 == x.UserId1));
        }
    }
}
