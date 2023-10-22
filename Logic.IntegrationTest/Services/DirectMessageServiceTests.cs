using Database.Collections;
using Logic.Controllers;
using Logic.DTOs.Messages;
using Logic.DTOs.User;
using Logic.Services;
using Microsoft.Extensions.Configuration;

namespace Logic.IntegrationTest.Services
{
    [TestFixture]
    public class DirectMessageServiceTests
    {
        DirectMessageService directMessageService;
        AuthService authService;

        RegisterLoginResponse resp1;
        RegisterLoginResponse resp2;

        FriendlyUserInfo login1;
        FriendlyUserInfo login2;

        RegisterUserRequest user1;
        RegisterUserRequest user2;

        [SetUp]
        public async Task SetUp()
        {
            user1 = new RegisterUserRequest
            {
                Username = Guid.NewGuid().ToString(),
                Password = "secretPassword1",
                FirstName = "firstName1",
                LastName = "lastName1",
            };
            user2 = new RegisterUserRequest
            {
                Username = Guid.NewGuid().ToString(),
                Password = "secretPassword2",
                FirstName = "firstName2",
                LastName = "lastName2",
            };

            // Create User Controller
            IConfiguration config = new ConfigurationBuilder()
                    .SetBasePath(Directory.GetCurrentDirectory())
                    .AddJsonFile("appsettings.json")
                    .Build();
            var directMessageCollection = new DirectMessageCollection();
            var chatRoomColleciton = new ChatRoomCollection();
            var userCollection = new UserCollection();
            var userService = new UserService(userCollection);
            authService = new AuthService(userCollection, chatRoomColleciton, directMessageCollection, config, userService);
            UsersController userController = new UsersController(authService);

            // Create new user... so that the same user can be reused for multiple tests
            await userController.RegisterUser(user1);
            await userController.RegisterUser(user2);
            var action = await userController.LoginUser(new LoginUserRequest { Username = user1.Username, Password = user1.Password });
            this.resp1 = ((RegisterLoginResponse)action.Value);
            this.login1 = resp1.UserInfo;

            var action2 = await userController.LoginUser(new LoginUserRequest { Username = user2.Username, Password = user2.Password });
            this.resp2 = ((RegisterLoginResponse)action2.Value);
            this.login2 = resp2.UserInfo;

            directMessageService = new DirectMessageService(directMessageCollection, userCollection);
        }

        [Test]
        public async Task AddNewMessage_ValidInput()
        {
            // Arrange
            var msg = new MessageInfo
            {
                FromUserInfo = login1,
                ToUserInfo = login2,
                Message = "HelloWow",
                Timestamp = DateTime.Now,
            };

            // Act
            await directMessageService.AddNewMessage(msg);
            var result1 = await directMessageService.GetMessagesByUserId(login1.UserId, login2.UserId);
            var result2 = await directMessageService.GetMessagesByUserId(login2.UserId, login1.UserId);

            // Assert
            Assert.That(result1.DirectMessages.Count, Is.EqualTo(1));
            Assert.That(result1.DirectMessages[0].Message, Is.EqualTo("HelloWow"));

            Assert.That(result2.DirectMessages.Count, Is.EqualTo(1));
            Assert.That(result2.DirectMessages[0].Message, Is.EqualTo("HelloWow"));

        }

        [Test]
        public async Task ValidateLoginDirectMessages_ValidInput()
        {
            // Arrange
            var msg = new MessageInfo
            {
                FromUserInfo = login1,
                ToUserInfo = login2,
                Message = "HelloWow",
                Timestamp = DateTime.Now,
            };

            // Act
            await directMessageService.AddNewMessage(msg);
            var result1 = await authService.LoginUser(new LoginUserRequest { Username = user1.Username, Password = user1.Password });
            var result2 = await authService.LoginUser(new LoginUserRequest { Username = user2.Username, Password = user2.Password });


            // Assert

            // make sure that the messsage was added only once to user 1
            Assert.That(result1.DirectMessages.Count, Is.EqualTo(1));
            Assert.That(result1.DirectMessages[0].DirectMessages.Count, Is.EqualTo(1));

            // make sure that the messsage was added only once to user 2
            Assert.That(result2.DirectMessages.Count, Is.EqualTo(1));
            Assert.That(result2.DirectMessages[0].DirectMessages.Count, Is.EqualTo(1));

            // make sure that both users have the same message
            Assert.That(result1.DirectMessages[0].DirectMessages[0].Message, Is.EqualTo("HelloWow"));
            Assert.That(result2.DirectMessages[0].DirectMessages[0].Message, Is.EqualTo("HelloWow"));
        }
    }
}
