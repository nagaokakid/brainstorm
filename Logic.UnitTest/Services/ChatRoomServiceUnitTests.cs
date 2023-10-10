using Database.CollectionContracts;
using Logic.DTOs.ChatRoom;
using Logic.Exceptions;
using Logic.Services;
using Moq;

namespace Logic.UnitTest.Services
{
    [TestFixture]
    public class ChatRoomServiceUnitTests
    {
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
            var chatRoomCollectionService = new Mock<IChatRoomCollection>();
            var userCollection = new Mock<IUserCollection>();
            userCollection.Setup(x => x.Get(request.UserId)).Returns(async () => null);
            var chatRoomService = new ChatRoomService(chatRoomCollectionService.Object, userCollection.Object);

            Assert.That(() => chatRoomService.CreateChatRoom(request), Throws.TypeOf<UserNotFound>());
        }
    }
}
