using Logic.DTOs.ChatRoom;
using Logic.DTOs.User;
using Logic.Exceptions;
using Logic.Models;
using Microsoft.AspNetCore.Mvc;

namespace Logic.Services
{
    // This class has all functionality relating to database access
    public class DatabaseService
    {
        private List<ChatRoom> rooms = new();
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
        public async Task<User> GetUser(string userId)
        {
            return users.Find(x => x.Id == userId);
        }

        private async Task AddChatRoomToUser(User user, string chatRoomId)
        {
            user.ChatroomIds.Add(chatRoomId);
        }

        public async Task<ChatRoom?> GetRoomByJoinCode(int chatRoomJoinCode)
        {
            return rooms.Find(x => x.JoinCode == chatRoomJoinCode);
        }

        public async Task AddMessageToChatRoom(string chatRoomId, ChatRoomMessage chatRoomMessage)
        {
            var foundRoom = rooms.Find(x => x.Id == chatRoomId);
            if (foundRoom != null)
            {
                foundRoom.Messages.Add(chatRoomMessage);
            }
        }

        private List<FriendlyUserResponse> GetList(List<string> memberIds)
        {
            List<FriendlyUserResponse> result = new();

            foreach (var memberId in memberIds)
            {
                var found = users.Find(x => x.Id == memberId);
                result.Add(new FriendlyUserResponse
                {
                    FirstName = found.FirstName,
                    LastName = found.LastName,
                });
            }

            return result;
        }

        public async Task<ActionResult<CreateChatRoomResponse>> CreateChatRoom(CreateChatRoomRequest request)
        {
            // get user
            var foundUser = await GetUser(request.UserId);

            // create new room
            ChatRoom newRoom = new()
            {
                Id = Guid.NewGuid().ToString(),
                Description = request.Description,
                Title = request.Title,

                // random 6-digit join code
                JoinCode = Random.Shared.Next(100001, 999999),

                // add user as a member to this room immediately
                MemberIds = new List<string>()
                {
                    request.UserId
                },

                // no messages yet
                Messages = new List<ChatRoomMessage>()
            };

            // add room to user collection
            await AddChatRoomToUser(foundUser, newRoom.Id);

            // add new room to room collection
            rooms.Add(newRoom);

            return new CreateChatRoomResponse
            {
                Id = newRoom.Id,
                Description = newRoom.Description,
                Title = newRoom.Title,
                JoinCode = newRoom.JoinCode,
                Messages = newRoom.Messages,
                GroupMembers = GetList(newRoom.MemberIds)
            };
        }
    }
}
