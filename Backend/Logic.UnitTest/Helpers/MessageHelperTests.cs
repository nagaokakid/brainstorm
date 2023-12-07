using Database.Data;
using Logic.DTOs.Messages;
using Logic.DTOs.User;
using Logic.Converters;

namespace Logic.UnitTest.Helpers
{
    [TestFixture]
    public class MessageHelperTests
    {
        Dictionary<string, User> users = new Dictionary<string, User>
        {
            {
                "1",
                new User { Id = "1", FirstName = "first", LastName = "last"}
            },
            {
                "2",
                new User { Id = "2", FirstName = "first", LastName = "last"}
            }
        };

        [Test]
        public void FromDTO_ValidMessage()
        {
            // Arrange 
            var dto = new MessageInfo
            {
                FromUserInfo = new FriendlyUserInfo { UserId = "1", FirstName = "first", LastName = "last" },
                ToUserInfo = new FriendlyUserInfo { UserId = "1", FirstName = "first", LastName = "last" },
                Message = "hello",
                Timestamp = DateTime.Now,
            };

            // Act
            var result = dto.FromDTO();

            // Assert
            Assert.That(result.Message, Is.EqualTo("hello"));
        }

        [Test]
        public void FromDTO_ValidFromUser()
        {
            // Arrange 
            var dto = new MessageInfo
            {
                FromUserInfo = new FriendlyUserInfo { UserId = "1", FirstName = "first", LastName = "last" },
                ToUserInfo = new FriendlyUserInfo { UserId = "1", FirstName = "first", LastName = "last" },
                Message = "hello",
                Timestamp = DateTime.Now,
            };

            // Act
            var result = dto.FromDTO();

            // Assert
            Assert.That(result.FromUserId, Is.EqualTo(dto.FromUserInfo.UserId));
        }

        [Test]
        public void ToDTO_Valid()
        {
            // Arrange 
            var dto = new DirectMessage
            {
                FromUserId = "1",
                Message = "hello",
                Timestamp = DateTime.Now,
            };

            // Act
            var result = dto.ToDTO();

            // Assert
            Assert.That(result.Message, Is.EqualTo("hello"));
        }

        [Test]
        public void ToDTO_ValidDirectMessageHistory()
        {
            // Arrange 
            var data = new DirectMessageHistory
            {
                UserId1 = "1",
                UserId2 = "2",
                DirectMessages = new List<DirectMessage>
                {
                    new DirectMessage{ Message = "hello1", FromUserId = "1", Timestamp = DateTime.Now },
                    new DirectMessage{ Message = "hello2", FromUserId = "2", Timestamp = DateTime.Now },
                }
            };

            // Act
            var result = data.ToDTO(users);

            // Assert
            Assert.That(result.User1.FirstName, Is.EqualTo("first"));
        }

        [Test]
        public void ToDTO_ValidDirectMessageHistory1()
        {
            // Arrange 
            var data = new DirectMessageHistory
            {
                UserId1 = "1",
                UserId2 = "2",
                DirectMessages = new List<DirectMessage>
                {
                    new DirectMessage{ Message = "hello1", FromUserId = "1", Timestamp = DateTime.Now },
                    new DirectMessage{ Message = "hello2", FromUserId = "2", Timestamp = DateTime.Now },
                }
            };

            // Act
            var result = data.ToDTO(users);

            // Assert
            Assert.That(result.DirectMessages[0].Message, Is.EqualTo("hello1"));
        }
    }
}
