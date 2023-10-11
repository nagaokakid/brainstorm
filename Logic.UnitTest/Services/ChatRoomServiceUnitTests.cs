using Database.CollectionContracts;
using Database.Data;
using Logic.DTOs.ChatRoom;
using Logic.Exceptions;
using Logic.Services;
using Moq;

namespace Logic.UnitTest.Services
{
    [TestFixture]
    public class ChatRoomServiceUnitTests
    {
        Mock<IChatRoomCollection> chatRoomCollectionService;
        Mock<IUserCollection> userCollection;

        [SetUp]
        public void Setup()
        {
            chatRoomCollectionService = new Mock<IChatRoomCollection>();
            userCollection = new Mock<IUserCollection>();
        }

        [Test]
        public void CreateChatRoom_InputInvalidUser_ThrowsUserNotFoundException()
        {
            // Arrange
            var request = new CreateChatRoomRequest
            {
                UserId = Guid.NewGuid().ToString(),
                Description = "description",
                Title = "title",
            };

            userCollection.Setup(x => x.Get(request.UserId)).Returns(async () => null);
            var chatRoomService = new ChatRoomService(chatRoomCollectionService.Object, userCollection.Object);

            Assert.That(() => chatRoomService.CreateChatRoom(request), Throws.TypeOf<UserNotFound>());
        }

        [Test]
        public void GetChatrooms_InputChatRoomNotFound_ThrowsChatRoomNotFoundException()
        {
            // Arrange
            chatRoomCollectionService.Setup(x => x.GetById("id")).Returns(async () => null);
            var chatRoomService = new ChatRoomService(chatRoomCollectionService.Object, userCollection.Object);

            Assert.That(() => chatRoomService.GetChatRooms(new List<string>() { "id"}), Throws.TypeOf<ChatRoomNotFound>());
        }
        
        [Test]
        public async Task GetChatrooms_InputValid_NewList()
        {
            // Arrange
            var chat = new ChatRoom
            {
                Id = "id",
                Description = "desc",
            };
            chatRoomCollectionService.Setup(x => x.GetById("id")).Returns(async () => chat);
            var chatRoomService = new ChatRoomService(chatRoomCollectionService.Object, userCollection.Object);

            // Act
            var result = await chatRoomService.GetChatRooms(new List<string>() { "id" });

            // Assert
            Assert.That(result.Count == 1);
            Assert.That(result[0].Description == "desc");
        }

        [Test]
        public async Task GetRoomByJoinCode_InputValid_ChatRoom()
        {
            // Arrange
            var chat = new ChatRoom
            {
                Id = "id",
                Description = "desc",
                JoinCode = "123",
            };
            chatRoomCollectionService.Setup(x => x.GetByJoinCode("123")).Returns(async () => chat);
            var chatRoomService = new ChatRoomService(chatRoomCollectionService.Object, userCollection.Object);

            // Act
            var result = await chatRoomService.GetRoomByJoinCode("123");

            // Assert
            Assert.That(result.JoinCode == "123");
        }
    }
}
