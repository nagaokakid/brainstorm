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

        public async Task<bool> DoesUsernameExist(string username)
        {
            return await userCollection.DoesUsernameExist(username);
        }

        public async Task<User?> CreateUser(RegisterUserRequest registerUser)
        {
            var user = new User
            {
                Id = Guid.NewGuid().ToString(),
                Username = registerUser.Username,
                Password = registerUser.Password,
                FirstName = registerUser.FirstName,
                LastName = registerUser.LastName,
                ChatroomIds = new List<string>()
            };

            await userCollection.Add(user);

            return user;
        }


        public async Task<User> GetUser(LoginUserRequest loginRequest)
        {
            // look for username and password in DB
            var foundUser = await userCollection.Get(loginRequest.Username, loginRequest.Password);
            if (foundUser == null) throw new UnauthorizedUser();

            return foundUser;
        }

        public async Task<User?> GetUser(string userId)
        {
            return await userCollection.Get(userId);
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

            throw new UserExists();
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
