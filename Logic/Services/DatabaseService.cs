using Logic.DTOs.User;
using Logic.Models;

namespace Logic.Services
{
    // This class has all functionality relating to database access
    public class DatabaseService
    {
        private List<ChatRoom> rooms = new();
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
