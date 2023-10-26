using Database.CollectionContracts;
using Database.Data;
using Database.MongoDB;
using MongoDB.Bson;
using System.ComponentModel;

namespace Database.Collections
{
    public class UserCollection : IUserCollection
    {
        // The user collection from MongoDB
        private MongoRepository<User> userRepository = new("brainstorm", "User");
        
        // Add a new user document to the User collection
        public async Task Add(User newUser)
        {
            await userRepository.CreateDocument(newUser);
        }

        // Add a new chat room ID to the array in an existing user document
        public async Task AddChatRoomToUser(string userId, string chatRoomId)
        {
            await userRepository.AddToArrayInDocument(userId, "ChatroomIds", chatRoomId);
        }

        public async Task AddDirectMessageHistoryToUser(string userId, string directMessageHistoryId)
        {
            await userRepository.AddToArrayInDocument(userId, "DirectMessageHistoryIds", directMessageHistoryId);
        }

        // Check if username already exists in User collection
        public async Task<bool> DoesUsernameExist(string username)
        {
            bool found;

            List<string> fieldNames = new List<string>
            {
                "Username"
            };

            List<string> fieldValues = new List<string>
            {
                username
            };

            found = await userRepository.GetDocumentByFieldValues(fieldNames, fieldValues) != null;

            return found;
        }

        // Get the user that matches the given ID
        public async Task<User?> Get(string userId)
        {
            return await userRepository.GetDocumentById(userId);
        }

        // Get the user that matches the given username and password
        public async Task<User?> Get(string username, string password)
        {
            List<string> fieldNames = new List<string>
            {
                "Username",
                "Password"
            };

            List<string> fieldValues = new List<string>
            {
                username,
                password
            };

            return await userRepository.GetDocumentByFieldValues(fieldNames, fieldValues);

        }

        public async Task<Dictionary<string, User>> GetAll()
        {
            var found = await userRepository.GetAllDocuments();
            if(found != null)
            {
                var result = new Dictionary<string, User>();
                foreach (var user in found)
                {
                    result.Add(user.Id, user);
                }
                return result;
            }
            return new Dictionary<string, User>();
        }
    } // class
} // namespace
