using Database.CollectionContracts;
using Logic.DTOs.User;
using Logic.Exceptions;
using Logic.Services;
using Moq;

namespace Logic.UnitTest.LoginUser
{
    [TestFixture]
    public class AuthServiceUnitTests
    {
        Mock<IUserCollection> userCollection;
        Mock<IChatRoomCollection> chatRoomCollection;
        Mock<Microsoft.Extensions.Configuration.IConfiguration> config;

        Mock<UserService> userService;

        [SetUp]
        public void Setup()
        {
            userCollection = new Mock<IUserCollection>();
            chatRoomCollection = new Mock<IChatRoomCollection>();
            config = new Mock<Microsoft.Extensions.Configuration.IConfiguration>();
            userService = new Mock<UserService>(userCollection.Object);
        }
        [Test]
        public async Task LoginUser_InputNull_ThrowsUnauthorized()
        {
            var authService = new AuthService(userCollection.Object, chatRoomCollection.Object, config.Object, userService.Object);

            Assert.That(() => authService.LoginUser(null), Throws.TypeOf<UnauthorizedUser>());
        }

        [Test]
        public async Task LoginUser_InputNullUsername_ThrowsUnauthorized()
        {
            // Arrange
            var authService = new AuthService(userCollection.Object, chatRoomCollection.Object, config.Object, userService.Object);

            var request = new LoginUserRequest
            {
                Username = null,
                Password = "password",
            };

            // Assert
            Assert.That(() => authService.LoginUser(request), Throws.TypeOf<UnauthorizedUser>());
        }

        [Test]
        public async Task LoginUser_InputNullPassword_ThrowsUnauthorized()
        {
            // Arrange
            var authService = new AuthService(userCollection.Object, chatRoomCollection.Object, config.Object, userService.Object);

            var request = new LoginUserRequest
            {
                Username = "Username",
                Password = null,
            };

            // Assert
            Assert.That(() => authService.LoginUser(request), Throws.TypeOf<UnauthorizedUser>());
        }

        [Test]
        public async Task LoginUser_InputEmptyPassword_ThrowsUnauthorized()
        {
            // Arrange
            var authService = new AuthService(userCollection.Object, chatRoomCollection.Object, config.Object, userService.Object);

            var request = new LoginUserRequest
            {
                Username = "Username",
                Password = "",
            };

            // Assert
            Assert.That(() => authService.LoginUser(request), Throws.TypeOf<UnauthorizedUser>());
        }

        [Test]
        public async Task RegisterUser_InputNull_ThrowBadRequest()
        {
            // Arrange
            var authService = new AuthService(userCollection.Object, chatRoomCollection.Object, config.Object, userService.Object);

            // Assert
            Assert.That(() => authService.RegisterUser(null), Throws.TypeOf<BadRequest>());
        }
        [Test]
        public void RegisterUser_InputUsernameIsNull_ThrowBadRequest()
        {
            // Arrange
            var authService = new AuthService(userCollection.Object, chatRoomCollection.Object, config.Object, userService.Object);
            var request = new RegisterUserRequest
            {
                Username = null,
                Password = "password",
                FirstName = "firstName",
                LastName = "lastName"
            };

            // Assert
            Assert.That(() => authService.RegisterUser(request), Throws.TypeOf<BadRequest>());
        }
        [Test]
        public void RegisterUser_InputPasswordIsNull_ThrowBadRequest()
        {
            // Arrange
            var authService = new AuthService(userCollection.Object, chatRoomCollection.Object, config.Object, userService.Object);
            var request = new RegisterUserRequest
            {
                Username = "username",
                Password = null,
                FirstName = "firstName",
                LastName = "lastName"
            };

            // Assert
            Assert.That(() => authService.RegisterUser(request), Throws.TypeOf<BadRequest>());
        }

        [Test]
        public void RegisterUser_InputFirstnameIsNull_ThrowBadRequest()
        {
            // Arrange
            var authService = new AuthService(userCollection.Object, chatRoomCollection.Object, config.Object, userService.Object);
            var request = new RegisterUserRequest
            {
                Username = "username",
                Password = "password",
                FirstName = null,
                LastName = "lastName"
            };

            // Assert
            Assert.That(() => authService.RegisterUser(request), Throws.TypeOf<BadRequest>());
        }

        [Test]
        public void RegisterUser_InputLastnameIsNull_ThrowBadRequest()
        {
            // Arrange
            var authService = new AuthService(userCollection.Object, chatRoomCollection.Object, config.Object, userService.Object);
            var request = new RegisterUserRequest
            {
                Username = "username",
                Password = "password",
                FirstName = "firstname",
                LastName = null
            };

            // Assert
            Assert.That(() => authService.RegisterUser(request), Throws.TypeOf<BadRequest>());
        }

        [Test]
        public async Task GetFriendlyChatRooms_InputChatRoomNotFound_ThrowChatRoomNotFoundException()
        {
            // Arrange
            chatRoomCollection.Setup(x => x.GetById("id")).Returns(async () => null);
            var authService = new AuthService(userCollection.Object, chatRoomCollection.Object, config.Object, userService.Object);
            var ids = new List<string>()
            {
                "1",
                "2"
            };

            // Assert
            Assert.That(() => authService.GetFriendlyChatRooms(ids), Throws.TypeOf<ChatRoomNotFound>());
        }
    }
}
