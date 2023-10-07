using Logic.DTOs.User;
using Logic.Exceptions;
using Logic.Models;

namespace Logic.Services
{
    // This class has all functionality relating to database access
    public class UserService
    {
        private List<User> users = new();

        // stub
        public bool DoesUserExist(string username)
        {
            return users.Find(x => x.Username == username) != null;
        }

        // stub
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

            users.Add(user);

            return user;
        }

        // stub to get user from DB
        public async Task<User> GetUser(LoginUserRequest loginRequest)
        {
            // look for username and password in DB
            var foundUser = users.Find(x => x.Username == loginRequest.Username && x.Password == loginRequest.Password);
            if (foundUser == null) throw new UnauthorizedUser();

            return foundUser;
        }

        // stub to get user from DB
        public async Task<User?> GetUser(string userId)
        {
            return users.Find(x => x.Id == userId);
        }

        public List<FriendlyUserInfo> GetList(List<string> memberIds)
        {
            List<FriendlyUserInfo> result = new();

            foreach (var memberId in memberIds)
            {
                var found = users.Find(x => x.Id == memberId);
                result.Add(new FriendlyUserInfo
                {
                    UserId = found.Id,
                    FirstName = found.FirstName,
                    LastName = found.LastName,
                });
            }

            return result;
        }

    }
}
