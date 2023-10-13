using Database.CollectionContracts;
using Database.Data;

namespace Database.Collections
{
    public class DirectMessageCollection : IDirectMessageCollection
    {
        // The direct message collection from MongoDB
        private MongoRepository<DirectMessage> directMessageRepository = new("DirectMessage");

        // Add a new direct message document to the collection
        public async Task Add(DirectMessage message)
        {
            await directMessageRepository.CreateDocument(message);
        }

        // Get all messages between two users from the collection
        public async Task<IEnumerable<DirectMessage>> Get(string fromUserId, string toUserId)
        {
            List<string> fieldNames = new List<string>
            {
                "FromUserId",
                "ToUserId"
            };

            List<string> fieldValues = new List<string>
            {
                fromUserId,
                toUserId
            };

            return await directMessageRepository.GetAllDocumentsByFieldValues(fieldNames, fieldValues);

        }
    }
}
