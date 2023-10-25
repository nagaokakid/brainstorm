using Database.Data;
using Logic.DTOs.User;
using Logic.Helpers;

namespace Logic.UnitTest.Helpers
{
    [TestFixture]
    public class UserHelper
    {
        [Test]
        public void ToFriendlyUser_Valid()
        {
            // Arrange 
            User user = new User { Id = "1", FirstName = "first", LastName = "last" };

            // Act
            var result = user.ToFriendlyUser();

            // Assert
            Assert.That(result.UserId, Is.EqualTo("1"));
            Assert.That(result.FirstName, Is.EqualTo("first"));
            Assert.That(result.LastName, Is.EqualTo("last"));
        }

        [Test]
        public void CreateUser_Valid()
        {
            // Arrange 
            RegisterUserRequest user = new RegisterUserRequest { Username = "11", Password = "secret", FirstName = "first", LastName = "last" };

            // Act
            var result = user.CreateUser();

            // Assert
            Assert.That(result.Id != null);
            Assert.That(result.Password == "secret");
            Assert.That(result.FirstName, Is.EqualTo("first"));
            Assert.That(result.LastName, Is.EqualTo("last"));
        }
    }
}
