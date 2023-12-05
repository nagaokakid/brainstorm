using Database.Data;
using Logic.Converters;

namespace Logic.UnitTest.Helpers
{
    [TestFixture]
    public class FriendlyUserInfoHelpterTests
    {
        Dictionary<string, User> users;
        [OneTimeSetUp]
        public void SetupFixture()
        {
            users = new Dictionary<string, User>
            {
                {
                    "123",
                    new User{ Id = "123", FirstName = "first1", LastName = "last1"}
                },
                {
                    "1234",
                    new User{ Id = "1234", FirstName = "first2", LastName = "last2"}
                },
            };
        }
        [Test]
        public void ToFriendlyUserInfo_InputNull_ReturnValid()
        {
            // Act
            var result = FriendlyUserInfoConverter.ToFriendlyUserInfo("123", null);

            // Assert
            Assert.That(result.UserId, Is.EqualTo("123"));
            Assert.That(result.FirstName, Is.EqualTo(null));
        }

        [Test]
        public void ToFriendlyUserInfo_InputValid_ReturnValid()
        {
            // Act
            var result = FriendlyUserInfoConverter.ToFriendlyUserInfo("123", users);

            // Assert
            Assert.That(result.UserId, Is.EqualTo("123"));
            Assert.That(result.FirstName, Is.EqualTo("first1"));
            Assert.That(result.LastName, Is.EqualTo("last1"));
        }

        [Test]
        public void ToFriendlyUserInfo_InputMemberIdNull_ReturnValid()
        {
            // Arrange
            string par = null;

            // Assert
            Assert.That(() => FriendlyUserInfoConverter.ToFriendlyUserInfo(par, users), Throws.TypeOf<ArgumentNullException>());
        }

        [Test]
        public void ToFriendlyUserInfo_InputNullUsers_ReturnValid()
        {
            // Act
            var result = FriendlyUserInfoConverter.ToFriendlyUserInfo(new List<string> { "1", "2" }, null);

            // Assert
            Assert.That(result.Count, Is.EqualTo(2));
            Assert.That(result[1].FirstName, Is.EqualTo(null));
        }

        [Test]
        public void ToFriendlyUserInfo_InputValidUsers_ReturnValid()
        {
            // Act
            var result = FriendlyUserInfoConverter.ToFriendlyUserInfo(new List<string> { "123", "1234" }, users);

            // Assert
            Assert.That(result.Count, Is.EqualTo(2));
            Assert.That(result[1].FirstName, Is.EqualTo("first2"));
        }
    }
}
