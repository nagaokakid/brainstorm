using Database.CollectionContracts;
using Database.Data;
using Database.MongoDB;

/*
 * BrainstormResultCollection.cs
 * -------------------------------
 * This class implements the IBrainstormResultCollection interface.
 * -----------------------------------------------------------------------------------------------------------  
 * Author: Mr. Akira Cooper
 * Last Updated: 28/10/2023
 * Date Created: 28/10/2023
 * Version 1.0
*/

namespace Database.Collections
{
    /// <summary>
    ///     This class implements the IBrainstormResultCollection interface.
    /// </summary>
    public class BrainstormResultCollection : IBrainstormResultCollection
    {

        private MongoRepository<BrainstormResult> brainstormResultRepository = new("brainstorm", "BrainstormResult");
        private MongoRepository<User> userRepository = new("brainstorm", "User");

        // Add a brainstorm result document to the collection
        public async Task Add(BrainstormResult brainstormResult)
        {
            await brainstormResultRepository.CreateDocument(brainstormResult);
        }

        // Get a single brainstorm result document by ID
        public async Task<BrainstormResult> Get(string id)
        {
            return await brainstormResultRepository.GetDocumentById(id);
        }

        // Get all brainstorm result documents belonging to a single user ID
        public async Task<List<BrainstormResult>> GetAllByUserId(string userId)
        {
            var user = await userRepository.GetDocumentById(userId);
            var resultIds = user.BrainstormResultIds;

            return await brainstormResultRepository.GetAllDocumentsByValueList("_id", resultIds);
        }

        // Get all brainstorm result documents that match the given chatroom ID
        public async Task<List<BrainstormResult>> GetAllByChatroomId(string chatroomId)
        {
            List<string> chatroomIdList = new(1)
            {
                chatroomId
            };
            return await brainstormResultRepository.GetAllDocumentsByValueList("ChatroomId", chatroomIdList);
        }


    }
}
