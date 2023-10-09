using Database.Data;
using Logic.DTOs.User;

namespace Logic.Helpers
{
    public static class UserHelper
    {
        public static User CreateUser(this RegisterUserRequest request)
        {
            return new User
            {
                Id = Guid.NewGuid().ToString(),
                Username = request.Username,
                Password = request.Password,
                FirstName = request.FirstName,
                LastName = request.LastName,
                ChatroomIds = new List<string>()
            };
        }

        public static FriendlyUserInfo ToFriendlyUser(this User user)
        {
            return new FriendlyUserInfo
            {
                UserId = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
            };
        }
    }
}
