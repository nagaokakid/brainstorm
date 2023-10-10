using Database.CollectionContracts;
using Database.Data;

namespace Database.Collections
{
    public class UserCollection : IUserCollection
    {
        private List<User> users = new();
        private MongoRepository<User> userRepository = new("User");
        public async Task Add(User newUser)
        {
            users.Add(newUser);
        }

        public async Task AddChatRoomToUser(string userId, string chatRoomId)
        {
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
