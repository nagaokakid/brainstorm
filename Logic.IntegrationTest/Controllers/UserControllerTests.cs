using Database.Collections;
using Logic.Controllers;
using Logic.DTOs.User;
using Logic.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;

namespace Logic.IntegrationTest.Controllers
{
    [TestFixture]
    public class UserControllerTests
    {
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
            userController = new UsersController(authService);
        }
        [Test]
        public async Task Register_Valid_RegisterLoginResponseDTO()
        {
            // Arrange
            var newUser = new RegisterUserRequest
            {
                Username = Guid.NewGuid().ToString(),
                Password = "secret",
                FirstName = "first",
                LastName = "last",
            };

            // Act
            var action = await userController.RegisterUser(newUser);
            var result = ((ObjectResult)action.Result);
            var value = (RegisterLoginResponse)result.Value;

            // Assert
            Assert.That(result.StatusCode == 201);
            Assert.That(!string.IsNullOrEmpty(value.Token));
            Assert.That(value.UserInfo.UserId != null);
            Assert.That(value.ChatRooms == null);
            Assert.That(value.DirectMessages == null);
        }

        [Test]
        public async Task Login_InputValid_RegisterLoginResponseDTO()
        {
            // Arrange
            var newUser = new RegisterUserRequest
            {
                Username = "hi",
                Password = "secret",
                FirstName = "first",
                LastName = "last",
            };

            var loginRequest = new LoginUserRequest
            {
                Username = "hi",
                Password = "secret",
            };

            // Act
            await userController.RegisterUser(newUser);
            var action = await userController.LoginUser(loginRequest);
            var value = (RegisterLoginResponse)action.Value;

            // Assert
            Assert.Multiple(() =>
            {

                Assert.That(!string.IsNullOrEmpty(value.Token));
                Assert.That(value.UserInfo.FirstName == "first");
            }
                );
        }

        [Test]
        public async Task Login_Invalid_401()
        {
            // Arrange
            var loginRequest = new LoginUserRequest
            {
                Username = Guid.NewGuid().ToString(),
                Password = Guid.NewGuid().ToString(),
            };

            // Act
            var action = await userController.LoginUser(loginRequest);
            var result = (StatusCodeResult)action.Result;

            // Assert
            Assert.That(result.StatusCode == 401);
        }
    }
}
