/*
 * ChatRoomService.cs
 * -------------------------
 * Represents the ChatRoomService object from the database.
 * This file contains the logic for the ChatRoomService.
 * ---------------------------------------------------------
 * Author: Mr. Roland Fehr
 * Last modified: 28.10.2023
 * Version: 1.0
*/

using Database.CollectionContracts;
using Database.Data;
using Logic.DTOs.ChatRoom;
using Logic.DTOs.Messages;
using Logic.DTOs.User;
using Logic.Exceptions;
using Logic.Hubs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using System.Diagnostics;

namespace Logic.Services
{
    /// <summary>
    ///   This is an interface for the ChatRoomService
    /// </summary>
    public interface IChatRoomService
    {
        Task AddMessageToChatRoom(string chatRoomId, MessageInfo msg);
        Task AddMessageToChatRoom(string chatRoomId, ChatRoomMessage msg);
        Task AddNewUserToChatRoom(string userId, string chatRoomId);
        Task<CreateChatRoomResponse> CreateChatRoom(CreateChatRoomRequest request);
        Task Delete(string id);
        Task EditChatRoom(EditChatRoomRequest request);
        Task<List<ChatRoom>> GetChatRooms(List<string> chatRoomIds);
        Task<ChatRoom?> GetRoomByJoinCode(string chatRoomJoinCode);
        Task<bool> IsJoinCodeValid(string joinCode);
        Task LeaveChatRoom(LeaveChatRoomRequest request);
        Task RemoveMessage(string chatRoomId, string messageId);
    }

    /// <summary>
    ///   This class implements the IChatRoomService interface. It contains the logic for the ChatRoomService
    /// </summary>
    public class ChatRoomService : IChatRoomService
    {
        private readonly IChatRoomCollection chatRoomCollection;
        private readonly IUserCollection userCollection;
        private readonly IHubContext<ChatRoomHub> chatRoomHub;

        /// <summary>
        /// Constructor for ChatRoomService
        /// </summary>
        /// <param name="chatRoomCollection"></param>
        /// <param name="userCollection"></param>
        public ChatRoomService(IChatRoomCollection chatRoomCollection, IUserCollection userCollection, IHubContext<ChatRoomHub> chatRoomContext)
        {
            this.chatRoomCollection = chatRoomCollection;
            this.userCollection = userCollection;
            this.chatRoomHub = chatRoomContext;
        }

        /// <summary>
        ///   This method adds a new user to a chat room
        /// </summary>
        /// <param name="userId"></param>
        /// <param name="chatRoomId"></param>
        public async Task AddNewUserToChatRoom(string userId, string chatRoomId)
        {
            await chatRoomCollection.AddNewUserToChatRoom(userId, chatRoomId);
        }

        /// <summary>
        ///   This method returns a chat room by its join code
        /// </summary>
        /// <param name="chatRoomJoinCode"></param>
        public async Task<ChatRoom?> GetRoomByJoinCode(string chatRoomJoinCode)
        {
            return await chatRoomCollection.GetByJoinCode(chatRoomJoinCode);
        }

        /// <summary>
        ///   This method adds a message to a chat room
        /// </summary>
        /// <param name="chatRoomId"></param>
        /// <param name="msg"></param>
        public async Task AddMessageToChatRoom(string chatRoomId, MessageInfo msg)
        {
            Debug.WriteLine($"Save ChatRoom Message {chatRoomId} {msg.Message}");
            await chatRoomCollection.AddMessage(chatRoomId, new ChatRoomMessage
            {
                ChatRoomMessageId = msg.MessageId,
                IsDeleted = false,
                FromUserId = msg.FromUserInfo.UserId,
                Message = msg.Message,
                Timestamp = msg.Timestamp,
            });
        }

        /// <summary>
        ///   This method also adds a message to a chat room
        /// </summary>
        /// <param name="chatRoomId"></param>
        /// <param name="msg"></param>
        public async Task AddMessageToChatRoom(string chatRoomId, ChatRoomMessage msg)
        {
            await chatRoomCollection.AddMessage(chatRoomId, msg);
        }

        /// <summary>
        ///   This method creates a chat room
        /// </summary>
        /// <param name="request"></param>
        /// <param name="userId"></param>
        /// <returns>The created chat room</returns>
        private static ChatRoom CreateChatRoom(CreateChatRoomRequest request, string userId)
        {
            return new()
            {
                Id = Guid.NewGuid().ToString(),
                Description = request.Description,
                Title = request.Title,
                IsDeleted = false,

                // random 6-digit join code
                JoinCode = Random.Shared.Next(100001, 999999).ToString(),

                // add user as a member to this room immediately
                MemberIds = new List<string>() { userId },

                // no messages yet
                Messages = new List<ChatRoomMessage>()
            };
        }

        /// <summary>
        ///  This method creates a chat room response
        /// </summary>
        /// <param name="request"></param>
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

        /// <summary>   
        /// This method creates a chat room response
        /// </summary>
        /// <param name="foundUser"></param>
        /// <param name="newRoom"></param>
        /// <returns>The created chat room response</returns>
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

        /// <summary>
        ///   This method gets a list of chat rooms
        /// </summary>
        /// <param name="chatRoomIds">The chatroom ids to get</param>
        /// <returns>The list of chat rooms</returns>
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

        /// <summary>
        ///   This method checks if a join code is valid
        /// </summary>
        /// <param name="joinCode">The join code to check</param>
        /// <returns>True if the join code is valid, false otherwise</returns>
        public async Task<bool> IsJoinCodeValid(string joinCode)
        {
            var result = await chatRoomCollection.GetByJoinCode(joinCode);
            return result != null;
        }

        /// <summary>
        ///  This method removes a message from a chat room
        /// </summary>
        /// <param name="chatRoomId"></param>
        /// <param name="messageId"></param>
        public async Task RemoveMessage(string chatRoomId, string messageId)
        {
            await chatRoomCollection.RemoveMessage(chatRoomId, messageId);
        }

        public async Task EditChatRoom(EditChatRoomRequest request)
        {
            if (request.Id == null || request.Title == null || request.Description == null) throw new BadRequest();

            // send to all clients
            chatRoomHub.Clients.Groups(request.Id).SendAsync("EditChatRoom", request.Id, request.Title, request.Description);

            // get existing chatroom
            var chatroom = await chatRoomCollection.GetById(request.Id);
            
            // edit chatroom
            if(chatroom != null)
            {
                chatroom.Title = request.Title;
                chatroom.Description = request.Description;
                await chatRoomCollection.EditChatRoom(chatroom);
            }
            else
            {
                throw new BadRequest();
            }
        }

        public async Task Delete(string chatId)
        {
            if(chatId == null) throw new BadRequest();

            // get existing chatroom
            var result = await chatRoomCollection.GetById(chatId);
            if(result != null)
            {
                foreach (var userId in result.MemberIds)
                {
                    // remove chatrooms from users
                    await userCollection.RemoveChatRoomId(userId, chatId);
                }
            }

            // delete chatroom 
            await chatRoomCollection.Delete(chatId);
        }

        public async Task LeaveChatRoom(LeaveChatRoomRequest request)
        {
            if (string.IsNullOrEmpty(request.ChatRoomId) || string.IsNullOrEmpty(request.UserId)) throw new BadRequest();

            // get chatroom
            var chatroom = await chatRoomCollection.GetById(request.ChatRoomId);
            if(chatroom != null)
            {
                // if last member leaving, then delete chatroom
                var result = chatroom.MemberIds.FindIndex(x => x.Equals(request.UserId));
                
                // there is a match and it's the last user leaving
                if(chatroom.MemberIds.Count == 0 && result == 0)
                {
                    // delete chatroom
                    await chatRoomCollection.Delete(request.ChatRoomId);
                }
                else if(result >= 0)
                {
                    // leave chatroom
                    await chatRoomCollection.RemoveUser(request.UserId, request.ChatRoomId);

                    // remove from user object
                    await userCollection.RemoveChatRoomId(request.UserId, request.ChatRoomId);
                }
            }
        }
    }
}
