using Logic.DTOs.User;
using Logic.Exceptions;
using Logic.Models;

namespace Logic.Services
{
    // This class has all functionality relating to database access
    public class DatabaseService
    {
        private List<ChatRoom> rooms = new();
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

        public async Task<ChatRoom> NewChatroom(string userId, string chatRoomName, string description)
        {
            // get user

            // create new room
            ChatRoom newRoom = new()
            {
                Id = Guid.NewGuid().ToString(),
                Description = description,
                Name = chatRoomName,
                // random 6-digit join code
                JoinCode = Random.Shared.Next(100001, 999999),
                // add user as a member to this room immediately
            };

            // add room to user collection

            // add new room to room collection
            rooms.Add(newRoom);

            return newRoom;
        }

        public async Task<ChatRoom?> GetRoomByJoinCode(int chatRoomJoinCode)
        {
            return rooms.Find(x => x.JoinCode == chatRoomJoinCode);
        }

        public async Task<User> GetUser(string fromUserId)
        {
            throw new NotImplementedException();
        }

        public async Task AddMessageToChatRoom(string chatRoomId, ChatRoomMessage chatRoomMessage)
        {
            var foundRoom = rooms.Find(x => x.Id == chatRoomId);
            if(foundRoom != null)
            {
                foundRoom.Messages.Add(chatRoomMessage);
            }
        }
    }
}
