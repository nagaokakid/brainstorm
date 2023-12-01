﻿/*
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
        Task<List<ChatRoom>> GetChatRooms(List<string> chatRoomIds);
        Task<ChatRoom?> GetRoomByJoinCode(string chatRoomJoinCode);
        Task<bool> IsJoinCodeValid(string joinCode);
        Task RemoveMessage(string chatRoomId, string messageId);
    }

    /// <summary>
    ///   This class implements the IChatRoomService interface. It contains the logic for the ChatRoomService
    /// </summary>
    public class ChatRoomService : IChatRoomService
    {
        private readonly IChatRoomCollection chatRoomCollection;
        private readonly IUserCollection userCollection;

        /// <summary>
        /// Constructor for ChatRoomService
        /// </summary>
        /// <param name="chatRoomCollection"></param>
        /// <param name="userCollection"></param>
        public ChatRoomService(IChatRoomCollection chatRoomCollection, IUserCollection userCollection)
        {
            this.chatRoomCollection = chatRoomCollection;
            this.userCollection = userCollection;
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
            await chatRoomCollection.AddMessage(chatRoomId, new ChatRoomMessage
            {
                ChatRoomMessageId = Guid.NewGuid().ToString(),
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
    }
}
