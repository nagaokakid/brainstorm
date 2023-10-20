using Database.CollectionContracts;
using Database.Data;
using Database.MongoDB;
using System.Collections.Generic;

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
            if(find == null)
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
                await directMessageHistoryRepository.AddToArrayInDocument(find.Id, "DirectMessages", find.UserId1);
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
            List<string> fieldNameOne = new List<string>
            {
                "UserId1"
            };
            List<string> fieldNameTwo = new List<string>
            {
                "UserId2"
            };
            List<string> fieldValue = new List<string>
            {
                userId
            };

            var result1 = await directMessageHistoryRepository.GetAllDocumentsByFieldValues(fieldNameOne, fieldValue);
            var result2 = await directMessageHistoryRepository.GetAllDocumentsByFieldValues(fieldNameTwo, fieldValue);

            List<DirectMessageHistory> allDirectMessages = new();
            allDirectMessages.AddRange(result1);
            allDirectMessages.AddRange(result2);

            return allDirectMessages ?? new List<DirectMessageHistory>();
        }


        public async Task<DirectMessageHistory?> Get(string userId1, string userId2)
        {
            List<string> fieldNames = new List<string>
            {
                "UserId1",
                "UserId2"
            };

            List<string> orderOneValues = new List<string>
            {
                userId1,
                userId2
            };

            List<string> orderTwoValues = new List<string>
            {
                userId2,
                userId1
            };

            var result1 = await directMessageHistoryRepository.GetDocumentByFieldValues(fieldNames, orderOneValues);
            var result2 = await directMessageHistoryRepository.GetDocumentByFieldValues(fieldNames, orderTwoValues);

            return result1 ?? result2;
        }
    }
}
