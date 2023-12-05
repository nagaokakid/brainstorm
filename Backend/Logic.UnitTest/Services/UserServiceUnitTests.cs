using Database.CollectionContracts;
using Database.Data;
using Logic.DTOs.User;
using Logic.Exceptions;
using Logic.Converters;
using Logic.Services;
using Moq;

namespace Logic.UnitTest.Services
{
    
    [TestFixture]
    public class UserServiceUnitTests
    {
        Dictionary<string, User> users = new Dictionary<string, User>
        {
            {
                "1",
                new User
                {
                    Id="1"
                }
            },
            {
                "2",
                new User
                {
                    Id="2",
                    FirstName = "first",
                    LastName = "last",
                }
            }
        };
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
        public async Task GetFriendlyUserInfo_InputInvalid_ThrowsUsernameExistsException()
        {
            // Arrange
            var userService = new UserService(userCollectionService.Object);
            var result = "username".ToFriendlyUserInfo(users);
            // Assert
            Assert.That(result.FirstName == null);
        }

        [Test]
        public async Task GetFriendly_InputValid_Valid()
        {
            // Arrange

            var userService = new UserService(userCollectionService.Object);

            // Act
            var result = "2".ToFriendlyUserInfo(users);

            // Assert
            Assert.That(result.FirstName == "first" && result.UserId == "2" && result.LastName == "last");
        }
    }
}
