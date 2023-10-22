using Database.Collections;
using Database.Data;
using Logic.Controllers;
using Logic.DTOs.ChatRoom;
using Logic.DTOs.Messages;
using Logic.DTOs.User;
using Logic.Services;
using Microsoft.Extensions.Configuration;

namespace Logic.IntegrationTest.Services
{
    [TestFixture]
    public class ChatRoomServiceTests
    {
        RegisterLoginResponse loginResponse;
        RegisterUserRequest newUser = new RegisterUserRequest
        {
            Username = "secretUsername",
            Password = "secretPassword",
            FirstName = "firstName",
            LastName = "lastName",
        };

        ChatRoomService chatRoomService;

        [OneTimeSetUp]
        public async Task CreateUser()
        {
            // Create User Controller
            IConfiguration config = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json")
                .Build();
            var directMessageCollection = new DirectMessageCollection();
            var chatRoomColleciton = new ChatRoomCollection();
            var userCollection = new UserCollection();
            var userService = new UserService(userCollection);
            var authService = new AuthService(userCollection, chatRoomColleciton, directMessageCollection, config, userService);
            UsersController userController = new UsersController(authService);

            // Create new user... so that the same user can be reused for multiple tests
            await userController.RegisterUser(newUser);
            var action = await userController.LoginUser(new LoginUserRequest { Username = newUser.Username, Password = newUser.Password });
            this.loginResponse = (RegisterLoginResponse)action.Value;
        }

        [SetUp]
        public void SetUp()
        {
            var chatRoomColleciton = new ChatRoomCollection();
            var userCollection = new UserCollection();
            chatRoomService = new ChatRoomService(chatRoomColleciton, userCollection);
        }

        [Test]
        public async Task CreateChatRoom_Valid_CreateChatRoomResponse()
        {
            // Arrange
            var createChatRoomRequest = new CreateChatRoomRequest
            {
                UserId = loginResponse.UserInfo.UserId,
                Title = Guid.NewGuid().ToString(),
                Description = "NewDescription",
            };

            // Act
            var result = await chatRoomService.CreateChatRoom(createChatRoomRequest);

            // Assert
            Assert.Multiple(() =>
            {
                Assert.That(!string.IsNullOrEmpty(result.ChatRoom.Id));
                Assert.That(!string.IsNullOrEmpty(result.ChatRoom.JoinCode));
                Assert.That(result.ChatRoom.Title, Is.EqualTo(createChatRoomRequest.Title));
                Assert.That(result.ChatRoom.Description, Is.EqualTo("NewDescription"));
                Assert.That(!result.ChatRoom.Messages.Any());
                Assert.That(result.ChatRoom.Members.Count, Is.EqualTo(1));
                Assert.That(result.ChatRoom.Members[0].UserId, Is.EqualTo(loginResponse.UserInfo.UserId));
            });
        }

        [Test]
        public async Task AddNewUserToChatRoom_Valid()
        {
            // Arrange
            var createChatRoomRequest = new CreateChatRoomRequest
            {
                UserId = loginResponse.UserInfo.UserId,
                Title = Guid.NewGuid().ToString(),
                Description = "NewDescription",
            };

            FriendlyChatRoom createdChatRoom = (await chatRoomService.CreateChatRoom(createChatRoomRequest)).ChatRoom;
            
            
            // Act
            await chatRoomService.AddNewUserToChatRoom("secondUser", createdChatRoom.Id);
            ChatRoom result = await chatRoomService.GetRoomByJoinCode(createdChatRoom.JoinCode);

            // Assert
            Assert.Multiple(() =>
            {
                Assert.That(result.Id, Is.EqualTo(createdChatRoom.Id));
                Assert.That(result.MemberIds.Count, Is.EqualTo(2));
                Assert.That(result.MemberIds[0], Is.EqualTo(loginResponse.UserInfo.UserId));
                Assert.That(result.MemberIds[1], Is.EqualTo("secondUser"));
            });
        }

        [Test]
        public async Task AddMessageToChatRoom()
        {
            // Arrange
            var createChatRoomRequest = new CreateChatRoomRequest
            {
                UserId = loginResponse.UserInfo.UserId,
                Title = Guid.NewGuid().ToString(),
                Description = "NewDescription",
            };

            FriendlyChatRoom createdChatRoom = (await chatRoomService.CreateChatRoom(createChatRoomRequest)).ChatRoom;
            MessageInfo messageInfo = new MessageInfo
            {
                ChatRoomId = createdChatRoom.Id,
                Message = "HelloWorld",
                FromUserInfo = loginResponse.UserInfo,
                Timestamp = DateTime.Now,
            };

            // Act
            await chatRoomService.AddMessageToChatRoom(createdChatRoom.Id, messageInfo);
            ChatRoom result = await chatRoomService.GetRoomByJoinCode(createdChatRoom.JoinCode);

            // Arrange
            Assert.Multiple(() =>
            {
                Assert.That(result.Id, Is.EqualTo(createdChatRoom.Id));
                Assert.That(result.Messages.Count, Is.EqualTo(1));
                Assert.That(result.Messages[0].Message, Is.EqualTo(messageInfo.Message));
                Assert.That(result.Messages[0].FromUserId, Is.EqualTo(messageInfo.FromUserInfo.UserId));
            });
        }
    }
}
