using Logic.DTOs.ChatRoom;
using Logic.Models;
using Microsoft.AspNetCore.Mvc;

namespace Logic.Services
{
    public class ChatRoomService
    {

        private List<ChatRoom> rooms = new();
        private readonly DatabaseService databaseService;

        public ChatRoomService(DatabaseService databaseService)
        {
            this.databaseService = databaseService;
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

        private async Task AddChatRoomToUser(User user, string chatRoomId)
        {
            user.ChatroomIds.Add(chatRoomId);
        }

        public async Task<ActionResult<CreateChatRoomResponse>> CreateChatRoom(CreateChatRoomRequest request)
        {
            // get user
            var foundUser = await databaseService.GetUser(request.UserId);

            // create new room
            ChatRoom newRoom = new()
            {
                Id = Guid.NewGuid().ToString(),
                Description = request.Description,
                Title = request.Title,

                // random 6-digit join code
                JoinCode = Random.Shared.Next(100001, 999999),

                // add user as a member to this room immediately
                Members = databaseService.GetList(new List<string>() { request.UserId }),

                // no messages yet
                Messages = new List<ChatRoomMessage>()
            };

            // add room to user collection
            await AddChatRoomToUser(foundUser, newRoom.Id);

            // add new room to room collection
            rooms.Add(newRoom);

            return new CreateChatRoomResponse
            {
                ChatRoom = newRoom,
            };
        }

        public List<ChatRoom> GetChatRooms(List<string> chatRoomIds)
        {
            List<ChatRoom> result = new();
            foreach (var c in chatRoomIds)
            {
                result.Add(rooms.Find(x => x.Id == c));
            }
            return result;
        }
    }
}
