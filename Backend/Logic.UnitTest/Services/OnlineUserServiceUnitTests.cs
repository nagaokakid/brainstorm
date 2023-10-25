using Logic.DTOs.User;
using Logic.Services;

namespace Logic.UnitTest.Services
{
    [TestFixture]
    public class OnlineUserServiceUnitTests
    {
        OnlineUserService onlineUserService;

        [SetUp]
        public void Setup()
        {
            onlineUserService = new OnlineUserService();
        }

        [Test]
        public async Task AddGet_InputFirst_Valid()
        {
            // Arrange
            var userId = Guid.NewGuid().ToString();
            var connectionId = Guid.NewGuid().ToString();

            // Act
            await onlineUserService.Add(userId, connectionId);
            var result = onlineUserService.Get(userId);

            // Assert
            Assert.That(result == connectionId);
        }

        [Test]
        public async Task AddGet_InputDuplicateId_Valid()
        {
            // Arrange
            var userId = Guid.NewGuid().ToString();
            var connectionId = Guid.NewGuid().ToString();
            var connectionId2 = Guid.NewGuid().ToString();
           

            // Act
            await onlineUserService.Add(userId, connectionId);
            await onlineUserService.Add(userId, connectionId2);
            var result = onlineUserService.Get(userId);

            // Assert
            Assert.That(result == connectionId2);
        }

        [Test]
        public async Task Remove_InputValid_Valid()
        {
            // Arrange
            var userId = Guid.NewGuid().ToString();
            var connectionId = Guid.NewGuid().ToString();

            // Act
            await onlineUserService.Add(userId, connectionId);
            onlineUserService.Remove(connectionId);
            var result = onlineUserService.Get(userId);

            // Assert
            Assert.That(result == null);
        }
    }
}
