using Database.CollectionContracts;
using Database.Data;
using Database.MongoDB;

namespace Database.Collections
{
    public class DirectMessageCollection : IDirectMessageCollection
    {

        // The direct message collection from MongoDB
        private MongoRepository<DirectMessageHistory> directMessageHistoryRepository = new("brainstorm", "DirectMessageHistory");

        // Add a new direct message document to the collection
        public async Task Add(string userId1, string userId2, DirectMessage message)
        {
            var find = await Get(userId1, userId2);
            if (find == null)
            {
                // users have not exchanged direct messages before
                var hist = new DirectMessageHistory
                {
                    Id = Guid.NewGuid().ToString(),
                    UserId1 = userId1,
                    UserId2 = userId2,
                    DirectMessages = new List<DirectMessage> { message },
                };
                await directMessageHistoryRepository.CreateDocument(hist);
            }
            else
            {
                await directMessageHistoryRepository.AddToArrayInDocument(find.Id, "DirectMessage", message); // *add message ID here instead of whole obj
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
            Dictionary<string, string> fieldDict1 = new(1)
            {
                {"UserId1", userId }
            };
            Dictionary<string, string> fieldDict2 = new(1)
            {
                {"UserId2", userId }
            };

            var result1 = await directMessageHistoryRepository.GetAllDocumentsByFieldValues(fieldDict1);
            var result2 = await directMessageHistoryRepository.GetAllDocumentsByFieldValues(fieldDict2);

            List<DirectMessageHistory> allDirectMessages = new();
            allDirectMessages.AddRange(result1);
            allDirectMessages.AddRange(result2);

            return allDirectMessages;
        }


        public async Task<DirectMessageHistory?> Get(string userId1, string userId2)
        {
            Dictionary<string, string> fieldDict1 = new(2)
            {
                {"UserId1", userId1 },
                {"UserId2", userId2 }
            };

            Dictionary<string, string> fieldDict2 = new(2)
            {
                {"UserId1", userId2 },
                {"UserId2", userId1 }
            };

            var result1 = await directMessageHistoryRepository.GetDocumentByFieldValues(fieldDict1);
            var result2 = await directMessageHistoryRepository.GetDocumentByFieldValues(fieldDict2);

            return result1 ?? result2;
        }
    }
}
