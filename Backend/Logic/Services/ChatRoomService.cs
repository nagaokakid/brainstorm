using Database.CollectionContracts;
using Database.Data;
using Logic.DTOs.ChatRoom;
using Logic.DTOs.Messages;
using Logic.DTOs.User;
using Logic.Exceptions;
using Microsoft.AspNetCore.Mvc;

namespace Logic.Services
{
    public class ChatRoomService
    {
        private readonly IChatRoomCollection chatRoomCollection;
        private readonly IUserCollection userCollection;

        public ChatRoomService(IChatRoomCollection chatRoomCollection, IUserCollection userCollection)
        {
            this.chatRoomCollection = chatRoomCollection;
            this.userCollection = userCollection;
        }

        public async Task AddNewUserToChatRoom(string userId, string chatRoomId)
        {
            await chatRoomCollection.AddNewUserToChatRoom(userId, chatRoomId);
        }

        public async Task<ChatRoom?> GetRoomByJoinCode(string chatRoomJoinCode)
        {
            return await chatRoomCollection.GetByJoinCode(chatRoomJoinCode);
        }

        public async Task AddMessageToChatRoom(string chatRoomId, MessageInfo msg)
        {
            await chatRoomCollection.AddMessage(chatRoomId, new ChatRoomMessage
            {
                FromUserId = msg.FromUserInfo.UserId,
                Message = msg.Message, 
                Timestamp = msg.Timestamp,
            });
        }

        private static ChatRoom CreateChatRoom(CreateChatRoomRequest request, string userId)
        {
            return new()
            {
                Id = Guid.NewGuid().ToString(),
                Description = request.Description,
                Title = request.Title,

                // random 6-digit join code
                JoinCode = Random.Shared.Next(100001, 999999).ToString(),

                // add user as a member to this room immediately
                MemberIds = new List<string>() { userId },

                // no messages yet
                Messages = new List<ChatRoomMessage>()
            };
        }

        public async Task<CreateChatRoomResponse> CreateChatRoom(CreateChatRoomRequest request)
        {
            // get user
            var foundUser = await userCollection.Get(request.UserId) ?? throw new UserNotFound();

            // create new room
            ChatRoom newRoom = CreateChatRoom(request, foundUser.Id);

            // add roomId to user
            await userCollection.AddChatRoomToUser(foundUser.Id, newRoom.Id);

            // add new chatRoom to room collection
            await chatRoomCollection.Add(newRoom);

            // return response
            return CreateChatRoomResponse(foundUser, newRoom);
        }

        private static CreateChatRoomResponse CreateChatRoomResponse(User foundUser, ChatRoom newRoom)
        {
            return new CreateChatRoomResponse
            {
                ChatRoom = new FriendlyChatRoom
                {
                    Id = newRoom.Id,
                    Title = newRoom.Title,
                    Description = newRoom.Description,
                    Messages = new List<MessageInfo>(),
                    JoinCode = newRoom.JoinCode,
                    Members = new List<FriendlyUserInfo>
                    {
                        new FriendlyUserInfo
                        {
                            UserId = foundUser.Id,
                            FirstName = foundUser.FirstName,
                            LastName = foundUser.LastName
                        }
                    }
                },
            };
        }

        public async Task<List<ChatRoom>> GetChatRooms(List<string> chatRoomIds)
        {
            List<ChatRoom> result = new();
            foreach (var id in chatRoomIds)
            {
                var found = await chatRoomCollection.GetById(id);
                if (found == null) throw new ChatRoomNotFound();
                
                result.Add(found);
            }
            return result;
        }
    }
}
