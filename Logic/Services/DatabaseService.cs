using Logic.DTOs.User;
using Logic.Models;

namespace Logic.Services
{
    // This class has all functionality relating to database access
    public class DatabaseService
    {
        // stub
        public bool DoesUserExist(string username)
        {
            return false;
        }

        // stub
        public async Task<User?> CreateUser(RegisterUserRequest registerUser)
        {
            return new User
            {
                Id = Guid.NewGuid().ToString(),
                FirstName = registerUser.FirstName,
                ChatroomIds = new List<string>()
            };
        }
    }
}
