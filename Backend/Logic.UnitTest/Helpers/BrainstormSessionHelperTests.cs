using Logic.Data;
using Logic.Converters;

namespace Logic.UnitTest.Helpers
{
    [TestFixture]
    public class BrainstormSessionHelperTests
    {
        [Test]
        public void ToDTO_InputValid_ValidObject()
        {
            // Arrange
            var session = new BrainstormSession
            {
                CanJoin = true,
                Description = "desc",
                Title = "title",
                SessionId = Guid.NewGuid().ToString(),
                Ideas = new(),
                JoinedMembers = new(),
                ChatRoomId = Guid.NewGuid().ToString(),
                Creator = new DTOs.User.FriendlyUserInfo { UserId = Guid.NewGuid().ToString(), FirstName = "first", LastName = "last" },
                IdeasAvailable = new(),
            };

            // Act
            var result = session.ToDTO();

            // Assert
            Assert.That(result, Is.Not.Null);
        }

        [Test]
        public void ToDTO_InputNull_DebugError()
        {
            // Assert
            Assert.That(() => BrainstormSessionConverter.ToDTO(null), Throws.ArgumentNullException);
        }
    }
}
