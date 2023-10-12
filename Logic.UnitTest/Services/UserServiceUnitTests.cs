using Database.CollectionContracts;
using Database.Data;
using Logic.DTOs.User;
using Logic.Exceptions;
using Logic.Services;
using Moq;

namespace Logic.UnitTest.Services
{
    [TestFixture]
    public class UserServiceUnitTests
    {
        Mock<IUserCollection> userCollectionService;

        [SetUp]
        public void Setup()
        {
            userCollectionService = new Mock<IUserCollection>();
        }

        [Test]
        public void CreateUser_InputDuplidateUsername_ThrowsUsernameExistsException()
        {
            // Arrange
            var request = new RegisterUserRequest
            {
                Username = "username",
            };

            
            userCollectionService.Setup(x => x.DoesUsernameExist(request.Username)).Returns(async () => true);
            var userService = new UserService(userCollectionService.Object);

            // Assert
            Assert.That(() => userService.CreateUser(request), Throws.TypeOf<UsernameExists>());
        }

        [Test]
        public void GetFriendlyUserInfo_InputInvalid_ThrowsUsernameExistsException()
        {
            // Arrange
            userCollectionService.Setup(x => x.Get("username")).Returns(async () => null);
            var userService = new UserService(userCollectionService.Object);

            // Assert
            Assert.That(() => userService.GetFriendly("username"), Throws.TypeOf<UserNotFound>());
        }

        [Test]
        public async Task GetFriendly_InputValid_Valid()
        {
            // Arrange
            var user = new User
            {
                Id = Guid.NewGuid().ToString(),
                Username = "username",
                FirstName = "firstname",
                LastName = "lastname"
            };

            userCollectionService.Setup(x => x.Get("username")).Returns(async () => user);
            var userService = new UserService(userCollectionService.Object);

            // Act
            var result = await userService.GetFriendly(user.Username);

            // Assert
            Assert.That(result.FirstName == user.FirstName && result.UserId == user.Id && result.LastName == user.LastName);
        }
    }
}
