using Database.CollectionContracts;
using Database.Data;
using Logic.Services;
using Moq;

namespace Logic.UnitTest.Services
{
    [TestFixture]
    public class DirectMessageServiceUnitTests
    {
        Mock<IDirectMessageCollection> directMessageCollection;
        Mock<IUserCollection> userCollectoin;

        [SetUp]
        public void SetUp()
        {
            directMessageCollection = new Mock<IDirectMessageCollection>();
            userCollectoin = new Mock<IUserCollection>();
        }

        [Test]
        public void GetMessageByUserId_InputfromId_ThrowArgumentNullException()
        {
            var service = new DirectMessageService(directMessageCollection.Object, userCollectoin.Object);

            Assert.That(() => service.GetMessagesByUserId(null, "id"), Throws.TypeOf<ArgumentNullException>());
        }

        [Test]
        public void GetMessageByUserId_InputToId_ThrowArgumentNullException()
        {
            var service = new DirectMessageService(directMessageCollection.Object, userCollectoin.Object);

            Assert.That(() => service.GetMessagesByUserId("fromId", null), Throws.TypeOf<ArgumentNullException>());
        }

        [Test]
        public async Task GetMessageByUserId_InputNoDirectMessages_ReturnNull()
        {
            directMessageCollection.Setup(x => x.Get("fromId", "toId")).Returns(async () => null);

            var service = new DirectMessageService(directMessageCollection.Object, userCollectoin.Object);
            var result = await service.GetMessagesByUserId("fromId", "toId");

            Assert.That(result == null);
        }

        [Test]
        public async Task GetMessageByUserId_InputValid_ReturnList()
        {
            // Arrange
            directMessageCollection.Setup(x => x.Get("fromId", "toId")).Returns(async () => new DirectMessageHistory { UserId1="fromId", UserId2="toId", DirectMessages = new List<DirectMessage> { new DirectMessage { Message="hi", Timestamp=DateTime.Now} } });
            userCollectoin.Setup(x => x.GetAll()).Returns(async () => 
            new Dictionary<string, User>
            {
                { "fromId", new User { Id = "fromId" } }, 
                { "toId", new User { Id="toId"} }
            });
            var service = new DirectMessageService(directMessageCollection.Object, userCollectoin.Object);

            // Act
            var result = await service.GetMessagesByUserId("fromId", "toId");

            // Assert
            Assert.That(result.DirectMessages.Count == 1);
            Assert.That(result.User1.UserId == "fromId");
            Assert.That(result.User2.UserId == "toId");
            Assert.That(result.DirectMessages[0].Message == "hi");

        }
    }
}
