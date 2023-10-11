﻿using Database.Data;
using Logic.DTOs.User;
using Logic.Services;
using MongoDB.Driver.Core.Connections;

namespace Logic.UnitTest.Services
{
    [TestFixture]
    public class OnlineUserServiceUnitTests
    {
        [Test]
        public async Task AddGet_InputFirst_Valid()
        {
            // Arrange
            var onlineUserService = new OnlineUserService();
            var userId = Guid.NewGuid().ToString();
            var connectionId = Guid.NewGuid().ToString();
            var user = new FriendlyUserInfo
            {
                UserId = userId,
                FirstName = "firstname",
                LastName = "lastname",
            };

            // Act
            await onlineUserService.Add(user, connectionId);
            var result = onlineUserService.Get(userId);

            // Assert
            Assert.That(result.UserInfo.UserId == userId);
            Assert.That(result.ConnectionId == connectionId);
        }

        [Test]
        public async Task AddGet_InputDuplicateId_Valid()
        {
            // Arrange
            var onlineUserService = new OnlineUserService();
            var id = Guid.NewGuid().ToString();
            var connectionId = Guid.NewGuid().ToString();
            var connectionId2 = Guid.NewGuid().ToString();
            var user = new FriendlyUserInfo
            {
                UserId = id,
                FirstName = "firstname",
                LastName = "lastname",
            };

            // Act
            await onlineUserService.Add(user, connectionId);
            await onlineUserService.Add(user, connectionId2);
            var result = onlineUserService.Get(user.UserId);

            // Assert
            Assert.That(result.ConnectionId == connectionId2);
        }

        [Test]
        public async Task Remove_InputValid_Valid()
        {
            // Arrange
            var onlineUserService = new OnlineUserService();
            var id = Guid.NewGuid().ToString();
            var connectionId = Guid.NewGuid().ToString();
            var user = new FriendlyUserInfo
            {
                UserId = id,
                FirstName = "firstname",
                LastName = "lastname",
            };

            // Act
            await onlineUserService.Add(user, connectionId);
            onlineUserService.Remove(connectionId);
            var result = onlineUserService.Get(user.UserId);

            // Assert
            Assert.That(result == null);
        }
    }
}