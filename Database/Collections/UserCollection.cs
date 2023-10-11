using Database.CollectionContracts;
using Database.Data;

namespace Database.Collections
{
    public class UserCollection : IUserCollection
    {
        // Get the User collection on MongoDB
        private MongoRepository<User> userRepository = new("User");
        
        public async Task Add(User newUser)
        {
            await userRepository.CreateDocument(newUser);
        }

        public async Task AddChatRoomToUser(string userId, string chatRoomId)
        {
            var foundUser = await userRepository.GetDocumentById(userId);



            var found = users.Find(x => x.Id == userId);
            if(found != null)
            {
                found.ChatroomIds.Add(chatRoomId);
            }
        }

        public async Task<bool> DoesUsernameExist(string username)
        {
            return users.Find(x => x.Username == username) != null;
        }

        public async Task<User?> Get(string userId)
        {
            return users.Find(x=>x.Id == userId);
        }

        public async Task<User?> Get(string username, string password)
        {
            return users.Find(x=>x.Username.Equals(username) && x.Password.Equals(password));
        }
    }
}
