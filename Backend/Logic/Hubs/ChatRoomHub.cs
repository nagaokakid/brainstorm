﻿using Database.CollectionContracts;
using Logic.DTOs.Messages;
using Logic.DTOs.User;
using Logic.Services;
using Microsoft.AspNetCore.SignalR;

namespace Logic.Hubs
{
    public class ChatRoomHub : Hub
    {
        private readonly ChatRoomService chatRoomService;
        private readonly IUserCollection userCollection;

        public ChatRoomHub(ChatRoomService chatRoomService, IUserCollection userCollection)
        {
            this.chatRoomService = chatRoomService;
            this.userCollection = userCollection;
        }

        public async Task JoinChatRoom(string joinCode, string first, string userId, string firstName, string lastName)
        {
            if (joinCode != null && userId != null && firstName != null)
            {
                // get room for chatRoomCode
                var foundChatRoom = await chatRoomService.GetRoomByJoinCode(joinCode);

                // add member to group
                if (foundChatRoom != null)
                {
                    var member = new FriendlyUserInfo
                    {
                        UserId = userId,
                        FirstName = firstName,
                        LastName = lastName,
                    };

                    // add new member to signalR connection group
                    await Groups.AddToGroupAsync(Context.ConnectionId, foundChatRoom.Id);

                    if (first == "First")
                    {
                        await Clients.Client(Context.ConnectionId).SendAsync("ReceiveChatRoomInfo", foundChatRoom);
                    }

                    // check if user is already a member of the chatroom when they join
                    var found = foundChatRoom.MemberIds.FirstOrDefault(x => x == userId);
                    if (found == null)
                    {
                        // add new member to chatroom
                        await chatRoomService.AddNewUserToChatRoom(userId, foundChatRoom.Id);
                        await Clients.Group(foundChatRoom.Id).SendAsync("NewMemberJoined", member, foundChatRoom.Id);

                        // add chatRoomId to user object
                        await userCollection.AddChatRoomToUser(userId, foundChatRoom.Id);
                    }
                }
            }
        }
        public async Task SendChatRoomMessage(string userId, string chatRoomId, string firstName, string lastName, string msg)
        {
            if (chatRoomId != null && userId != null && firstName != null && msg != null)
            {
                var msgInfo = new MessageInfo
                {
                    FromUserInfo = new FriendlyUserInfo { UserId = userId, FirstName = firstName, LastName = lastName },
                    ChatRoomId = chatRoomId,
                    Message = msg,
                    Timestamp = DateTime.Now
                };

                // send message to everyone in the chatRoom
                await Clients.Group(chatRoomId).SendAsync("ReceiveChatRoomMessage", msgInfo);

                // add message to chatroom
                await chatRoomService.AddMessageToChatRoom(msgInfo.ChatRoomId, msgInfo);
            }
        }
        public override Task OnDisconnectedAsync(Exception? exception)
        {
            return base.OnDisconnectedAsync(exception);
        }
        public override Task OnConnectedAsync()
        {
            return base.OnConnectedAsync();
        }
    }
}