using Database.Collections;
using Logic.Controllers;
using Logic.DTOs.ChatRoom;
using Logic.DTOs.User;
using Logic.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;

namespace Logic.IntegrationTest.Controllers
{
    [TestFixture]
    public class ChatRoomControllerTests
    {
        ChatRoomController chatRoomController;
        UsersController userController;
        [SetUp]
        public void SetUp()
        {
            IConfiguration config = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json")
                .Build();
            var directMessageCollection = new DirectMessageCollection();
            var chatRoomColleciton = new ChatRoomCollection();
            var userCollection = new UserCollection();
            var userService = new UserService(userCollection);
            var authService = new AuthService(userCollection, chatRoomColleciton, directMessageCollection, config, userService);
            var chatRoomService = new ChatRoomService(chatRoomColleciton, userCollection);
            chatRoomController = new ChatRoomController(chatRoomService);
            userController = new UsersController(authService);
        }
        [Test]
        public async Task CreateChatRoom_Valid_CreateChatRoomResponse()
        {
            // Arrange
            var newUser = new RegisterUserRequest
            {
                Username = Guid.NewGuid().ToString(),
                Password = "secret",
                FirstName = "first",
                LastName = "last",
            };

            // register new user to make sure we can create a chatroom account
            var action = await userController.RegisterUser(newUser);
            var result = ((ObjectResult)action.Result);
            var value = (RegisterLoginResponse)result.Value;
            var request = new CreateChatRoomRequest
            {
                UserId = value.UserInfo.UserId,
                Title = "NewTitle",
                Description = "ForGroupProjects",
            };

            // Act
            var action1 = await chatRoomController.CreateChatRoom(request);
            var result1 = (CreateChatRoomResponse)action1.Value;

            // Assert
            Assert.That(!result1.ChatRoom.Messages.Any());
            Assert.That(result1.ChatRoom.Members.Count == 1);
            Assert.That(result1.ChatRoom.Id != null);
            Assert.That(result1.ChatRoom.JoinCode != null);
            Assert.That(result1.ChatRoom.Title == "NewTitle");
        }

        [Test]
        public async Task CreateChatRoom_InvalidUser_500()
        {
            // Arrange
            var request = new CreateChatRoomRequest
            {
                UserId = Guid.NewGuid().ToString(),
                Title = "NewTitle",
                Description = "ForGroupProjects",
            };

            // Act
            var action = await chatRoomController.CreateChatRoom(request);
            var result = ((StatusCodeResult)action.Result);

            // Assert
            Assert.That(result.StatusCode == 500);
        }
    }
}
