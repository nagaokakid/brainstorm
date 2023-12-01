using Database.CollectionContracts;
using Database.Data;
using Database.MongoDB;
using MongoDB.Bson;
using System.ComponentModel;

/*
 * UserCollection.cs
 * -------------------------------
 * This class implements the IUserCollection interface.
 * -----------------------------------------------------------------------------------------------------------
 * Authors: Mr. Roland Fehr and Mr. Akira Cooper
    * Last Updated: 1/12/2023
    * Date Created: 1/12/2023
    * Version 1.0
*/

namespace Database.Collections
{
    /// <summary>
    ///    This class implements the IUserCollection interface.
    ///    It is used to interact with the User collection in the database.
    /// </summary>
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

        // Add a direct message history ID to a user
        public async Task AddDirectMessageHistoryToUser(string userId, string directMessageHistoryId)
        {
            await userRepository.AddToArrayInDocument(userId, "DirectMessageHistoryIds", directMessageHistoryId);
        }

        public async Task AddBrainstormResultToUser(string userId, string brainstormResultId)
        {
            await userRepository.AddToArrayInDocument(userId, "BrainstormResultIds", brainstormResultId);
        }

        // Check if username already exists in User collection
        public async Task<bool> DoesUsernameExist(string username)
        {
            bool found;

            Dictionary<string, string> fieldDict = new(1)
            {
                { "Username", username }
            };

            found = await userRepository.GetDocumentByFieldDictionary(fieldDict) != null;

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
            Dictionary<string, string> fieldDict = new(2)
            {
                {"Username", username},
                {"Password", password}
            };

            return await userRepository.GetDocumentByFieldDictionary(fieldDict);

        }

        public async Task<Dictionary<string, User>> GetAll()
        {
            var found = await userRepository.GetAllDocuments();
            if (found != null)
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
