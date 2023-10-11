using Database.CollectionContracts;
using Database.Data;
using Logic.DTOs.User;
using Logic.Exceptions;

namespace Logic.Services
{
    public class UserService
    {
        private readonly IUserCollection userCollection;

        public UserService(IUserCollection userCollection)
        {
            this.userCollection = userCollection;
        }

        public async Task<FriendlyUserInfo> CreateUser(RegisterUserRequest registerUser)
        {
            // make sure username does not exist
            var exists = await userCollection.DoesUsernameExist(registerUser.Username);
            if (exists) throw new UserExists();

            // create user
            var newUser = new User
            {
                Id = Guid.NewGuid().ToString(),
                Username = registerUser.Username,
                Password = registerUser.Password,
                FirstName = registerUser.FirstName,
                LastName = registerUser.LastName,
                ChatroomIds = new List<string>()
            };
            await userCollection.Add(newUser);

            return new FriendlyUserInfo()
            {
                UserId = newUser.Id,
                FirstName = newUser.FirstName,
                LastName = newUser.LastName,
            };
        }

        public async Task<FriendlyUserInfo> GetFriendly(string userId)
        {
            var found = await userCollection.Get(userId);
            if (found != null)
            {
                return new FriendlyUserInfo
                {
                    UserId = found.Id,
                    FirstName = found.FirstName,
                    LastName = found.LastName,
                };
            }

            throw new UserExists(); // if found == null, should we throw UserNotFound exception?
        }
        public async Task<List<FriendlyUserInfo>> GetList(List<string> memberIds)
        {
            List<FriendlyUserInfo> result = new();

            foreach (var memberId in memberIds)
            {
                result.Add(await GetFriendly(memberId));
            }

            return result;
        }

    }
}
