using Logic.DTOs.User;
using Logic.Exceptions;
using Logic.Models;

namespace Logic.Services
{
    // This class has all functionality relating to database access
    public class DatabaseService
    {
        // stub for database users list
        // holds list of users
        private List<User> users = new List<User>();

        // stub
        public bool DoesUserExist(string username)
        {
            return users.Find(x=>x.Username == username) != null;
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
    }
}
