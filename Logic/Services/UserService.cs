using Database.CollectionContracts;
using Database.Data;
using Logic.DTOs.User;
using Logic.Exceptions;
using Logic.Helpers;

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
            if (exists) throw new UsernameExists();

            // create user
            var newUser = registerUser.CreateUser();
            await userCollection.Add(newUser);

            return newUser.ToFriendlyUser();
        }

        public async Task<FriendlyUserInfo> GetFriendly(string userId)
        {
            var found = await userCollection.Get(userId);
            if (found != null)
            {
                return found.ToFriendlyUser();
            }

            throw new UserNotFound();
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
