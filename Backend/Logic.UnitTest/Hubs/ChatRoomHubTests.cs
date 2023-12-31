﻿using Database.CollectionContracts;
using Logic.DTOs.Messages;
using Logic.DTOs.User;
using Logic.Hubs;
using Logic.Services;
using Microsoft.AspNetCore.SignalR;
using Moq;

namespace Logic.UnitTest.Hubs
{
    [TestFixture]
    public class ChatRoomHubTests
    {
        [Test]
        public async Task JoinChatRoom_InputValid()
        {
            var userCollection = new Mock<IUserCollection>();
            var chatRoomService = new Mock<IChatRoomService>();
            chatRoomService.Setup(x => x.GetRoomByJoinCode("123")).Returns(async () => null);
            var brainstormService = new Mock<IBrainstormService>();
            brainstormService.Setup(x => x.StartSession("1")).Returns(async () => await Task.CompletedTask);

            var clients = new Mock<IHubCallerClients>();
            var clientProxy = new Mock<IClientProxy>();
            clients.Setup(x => x.All).Returns(clientProxy.Object);

            var hub = new ChatRoomHub(chatRoomService.Object, userCollection.Object, brainstormService.Object);

            await hub.JoinChatRoom("123", "123", "1", "1", "1");
            chatRoomService.Verify(x => x.GetRoomByJoinCode("123"));
        }
    }
}
