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

        List<DirectMessage> directMessageList;
        Dictionary<string, User> userList;

        [SetUp]
        public void SetUp()
        {
            directMessageCollection = new Mock<IDirectMessageCollection>();
            userCollectoin = new Mock<IUserCollection>();

            directMessageList = new List<DirectMessage>()
            {
                new DirectMessage
                {
                    FromUserId = "1",
                    ToUserId = "2",
                    Message = "hi",
                    Timestamp = DateTime.Now
                }
            };

            userList = new Dictionary<string, User>()
            {
                {
                    "1",
                    new User
                    {
                        Id = "1",
                    }
                },
                {
                    "2",
                    new User
                    {
                        Id = "2",
                    }
                }
            };
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
        public async Task GetMessageByUserId_InputNoDirectMessages_ReturnNewList()
        {
            directMessageCollection.Setup(x => x.Get("fromId", "toId")).Returns(async () => null);

            var service = new DirectMessageService(directMessageCollection.Object, userCollectoin.Object);
            var result = await service.GetMessagesByUserId("fromId", "toId");

            Assert.That(result.Count == 0);
        }

        [Test]
        public async Task GetMessageByUserId_InputValid_ReturnList()
        {
            // Arrange
            directMessageCollection.Setup(x => x.Get("fromId", "toId")).Returns(async () => directMessageList);
            userCollectoin.Setup(x => x.GetAll()).Returns(async () => userList);
            var service = new DirectMessageService(directMessageCollection.Object, userCollectoin.Object);

            // Act
            var result = await service.GetMessagesByUserId("fromId", "toId");

            // Assert
            Assert.That(result.Count == 1);
            Assert.That(result[0].FromUserInfo.UserId == "1");
            Assert.That(result[0].ToUserInfo.UserId == "2");
        }
    }
}
