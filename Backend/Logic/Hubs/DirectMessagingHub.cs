/*
 * DirectMessagingHub.cs
 * ---------------------
 * This file contains the DirectMessagingHub class which is used to send direct messages to users.
 * ----------------------------------------------------------------------------------------------
 * Author: Mr. Roland Fehr
 * Last modified: 28.10.2023
 * Version: 1.0
 */


using Logic.DTOs.Messages;
using Logic.DTOs.User;
using Logic.Services;
using Microsoft.AspNetCore.SignalR;
using System;

namespace Logic.Hubs
{
    /// <summary>
    /// This class contains the DirectMessagingHub class which is used to send direct messages to users.
    /// </summary>
    public class DirectMessagingHub : Hub
    {
        private readonly IOnlineUserService onlineUserService;
        private readonly DirectMessageService directMessageService;

        /// <summary>
        /// Initializes a new instance of the DirectMessagingHub class.
        /// </summary>
        /// <param name="onlineUserService">The online user service.</param>
        /// <param name="directMessageService">The direct message service.</param>
        public DirectMessagingHub(IOnlineUserService onlineUserService, DirectMessageService directMessageService)
        {
            this.onlineUserService = onlineUserService;
            this.directMessageService = directMessageService;
        }

        /// <summary>
        ///     This method is called when a new connection is established with the hub.
        /// </summary>
        /// <returns> returns a task that represents the asynchronous connect. </returns>
        public override Task OnConnectedAsync()
        {
            return base.OnConnectedAsync();
        }

        /// <summary>
        ///   This method is called when a connection with the hub is terminated.
        /// </summary>
        /// <param name="exception">The exception that occurred.</param>
        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            onlineUserService.Remove(Context.ConnectionId);
            await base.OnDisconnectedAsync(exception);
        }

        /// <summary>
        /// This method is called when a user joins a direct chat.
        /// </summary>
        /// <param name="userId">The user id of the user who joined the chat.</param>
        /// <param name="firstName">The first name of the user who joined the chat.</param>
        /// <param name="lastName">The last name of the user who joined the chat.</param>
        public async Task JoinDirect(string userId, string firstName, string lastName)
        {
            await onlineUserService.Add(userId, Context.ConnectionId);
        }

        /// <summary>
        ///   This method is called when a user requests the chat history.
        /// </summary>
        /// <param name="fromId">The user id of the user who requested the chat history.</param>
        /// <param name="toId">The user id of the user who the chat history is requested from.</param>
        public async Task GetChatHistory(string fromId, string toId)
        {
            var result = await directMessageService.GetMessagesByUserId(fromId, toId);
            await Clients.Client(Context.ConnectionId).SendAsync("ReceiveChatHistory", result);
        }

        /// <summary>
        ///   This method is called when a user sends a direct message. The message is sent to the receiver and saved in the database.
        /// </summary>
        /// <param name="fromUserId">The user id of the user who sent the message.</param>
        /// <param name="fromFirstName">The first name of the user who sent the message.</param>
        /// <param name="fromLastName">The last name of the user who sent the message.</param>
        /// <param name="toUserId">The user id of the user who the message is sent to.</param>
        /// <param name="toFirstName">The first name of the user who the message is sent to.</param>
        /// <param name="toLastName">The last name of the user who the message is sent to.</param>
        /// <param name="msg">The message that is sent.</param>
        public async Task SendDirectMessage(string fromUserId, string fromFirstName, string fromLastName, string toUserId, string toFirstName, string toLastName, string msg)
        {
            if (!string.IsNullOrEmpty(msg) && !string.IsNullOrEmpty(fromUserId) && !string.IsNullOrEmpty(toUserId))
            {

                var msgInfo = new MessageInfo
                {
                    MessageId = Guid.NewGuid().ToString(),
                    FromUserInfo = new FriendlyUserInfo { UserId = fromUserId, FirstName = fromFirstName, LastName = fromLastName },
                    ToUserInfo = new FriendlyUserInfo { UserId = toUserId, FirstName = toFirstName, LastName = toLastName },
                    Message = msg,
                    Timestamp = DateTime.Now
                };
                await Clients.Client(Context.ConnectionId).SendAsync("ReceiveDirectMessage", msgInfo);


                // make sure user is online
                var connectionId = onlineUserService.GetConnectionId(toUserId);
                if (connectionId != null)
                {
                    await Clients.Client(connectionId).SendAsync("ReceiveDirectMessage", msgInfo);
                }

                // save direct message
                directMessageService.AddNewMessage(msgInfo);

            }
        }

        /// <summary>
        ///  This method is called when a user removes a direct message.
        /// </summary>
        /// <param name="fromUserId">The user id of the user who sent the message.</param>
        /// <param name="toUserId">The user id of the user who the message is sent to.</param>
        /// <param name="messageId">The id of the message that is removed.</param>
        public async Task RemoveDirectMessage(string fromUserId, string toUserId, string messageId)
        {
            if (!string.IsNullOrEmpty(fromUserId) && !string.IsNullOrEmpty(toUserId) && !string.IsNullOrEmpty(messageId))
            {
                await directMessageService.RemoveDirectMessage(fromUserId, toUserId, messageId);
                await Clients.Client(Context.ConnectionId).SendAsync("RemoveDirectMessage", toUserId, messageId);

                var connectionId = onlineUserService.GetConnectionId(toUserId);
                if (connectionId != null)
                {
                    Clients.Clients(connectionId).SendAsync("RemoveDirectMessage", toUserId, messageId);
                }

            }
        }
    }
}
