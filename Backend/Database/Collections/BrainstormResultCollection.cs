using Database.CollectionContracts;
using Database.Data;
using Database.MongoDB;

namespace Database.Collections
{
    public class BrainstormResultCollection : IBrainstormResultCollection
    {
        private MongoRepository<BrainstormResult> brainstormResultRepository = new("brainstorm", "BrainstormResult");
        private MongoRepository<User> userRepository = new("brainstorm", "User");

        public async Task Add(BrainstormResult brainstormResult)
        {

        }

    }
}
