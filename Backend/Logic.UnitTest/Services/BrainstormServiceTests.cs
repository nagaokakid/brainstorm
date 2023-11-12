using Database.Collections;
using Logic.Data;
using Logic.DTOs.User;
using Logic.Services;

namespace Logic.UnitTest.Services
{
    [TestFixture]
    public class BrainstormServiceTests
    {
        BrainstormSession session;
        BrainstormService service;

        [SetUp]
        public void SetUp()
        {
            service = new BrainstormService(new BrainstormResultCollection());
            var creator = new FriendlyUserInfo { UserId = Guid.NewGuid().ToString(), FirstName = "first", LastName = "last" };
            session = new BrainstormSession { Title = "title", Description = "desc", ChatRoomId = Guid.NewGuid().ToString(), CanJoin = true, Creator = creator, SessionId = Guid.NewGuid().ToString(), Ideas = new Dictionary<string, Idea>(), JoinedMembers = new List<FriendlyUserInfo> { creator }, IdeasAvailable = DateTime.Now.AddDays(1) };

        }
        [Test]
        public async Task Add_InputValid()
        {
            // Act
            await service.Add(session);
            var result = await service.GetSession(session.SessionId);

            // Assert
            Assert.That(result, Is.Not.Null);
            Assert.That(result.CanJoin, Is.True);
            Assert.That(result.JoinedMembers.Count() == 1);
        }

        [Test]
        public async Task Join_InputValid()
        {
            // Arrange
            var joinUser = new FriendlyUserInfo { UserId = Guid.NewGuid().ToString(), FirstName = "first", LastName = "last" };
            // Act
            await service.Add(session);
            await service.Join(session.SessionId, joinUser);
            var result = await service.GetSession(session.SessionId);

            // Assert
            Assert.That(result.CanJoin, Is.True);
            Assert.That(result.JoinedMembers.Count(), Is.EqualTo(2));
            Assert.That(result.JoinedMembers[1].UserId, Is.EqualTo(joinUser.UserId));
        }

        [Test]
        public async Task StartSession_InputValid()
        {
            // Act
            await service.Add(session);
            await service.StartSession(session.SessionId);
            var result = await service.GetSession(session.SessionId);

            // Assert
            Assert.That(result.CanJoin, Is.False);
            Assert.That(result.JoinedMembers.Count(), Is.EqualTo(1));
        }
        [Test]
        public async Task GetSession_InputInValid()
        {
            // Act
            var result = await service.GetSession(Guid.NewGuid().ToString());

            // Assert
            Assert.That(result, Is.Null);
        }

        [Test]
        public async Task AddIdeas_InputValid()
        {
            // Act
            await service.Add(session);
            await service.StartSession(session.SessionId);
            await service.AddIdeas(session.SessionId, new List<string> { "hi", "wow" });
            await service.AddIdeas(session.SessionId, new List<string> { "hi", "wow" });
            var result = await service.GetSession(session.SessionId);

            // Assert
            Assert.That(result.Ideas.Count(), Is.EqualTo(4));
        }

        [Test]
        public async Task AddIdeas_InputSessionEnded()
        {
            // Act
            await service.Add(session);
            await service.StartSession(session.SessionId);
            await service.AddIdeas(session.SessionId, new List<string> { "hi", "wow" });
            await service.EndSession(session.SessionId);
            await Task.Delay(1001);
            await service.AddIdeas(session.SessionId, new List<string> { "hi", "wow" });
            var result = await service.GetSession(session.SessionId);

            // Assert
            Assert.That(result.Ideas.Count(), Is.EqualTo(2));
        }

        [Test]
        public async Task GetAllIdeas_InputValid()
        {
            // Act
            await service.Add(session);
            await service.StartSession(session.SessionId);
            await service.AddIdeas(session.SessionId, new List<string> { "hi", "wow" });
            await service.EndSession(session.SessionId);
            await Task.Delay(1001);
            await service.AddIdeas(session.SessionId, new List<string> { "hi", "wow" });
            var result = await service.GetAllIdeas(session.SessionId);

            // Assert
            Assert.That(result.Count(), Is.EqualTo(2));
        }

        [Test]
        public async Task AddVotes_InputValid()
        {
            // Act
            await service.Add(session);
            await service.StartSession(session.SessionId);
            await service.AddIdeas(session.SessionId, new List<string> { "hi", "wow" });
            var ideas = await service.GetAllIdeas(session.SessionId);
            await service.AddVotes(session.SessionId, ideas.Select(x=> new Idea { Id = x.Id, Thought = x.Thought, Likes = 1, Dislikes = 1}).ToList());
            await service.AddVotes(session.SessionId, ideas.Select(x=> new Idea { Id = x.Id, Thought = x.Thought, Likes = 1, Dislikes = 1}).ToList());
            var result = await service.GetAllIdeas(session.SessionId);

            // Assert
            Assert.That(result.All(x=>x.Likes == 2), Is.True);
        }
        [Test]
        public async Task AddVotes_InputInvalidSession()
        {
            // Act
            await service.Add(session);
            await service.StartSession(session.SessionId);
            await service.AddIdeas(session.SessionId, new List<string> { "hi", "wow" });
            var ideas = await service.GetAllIdeas(session.SessionId);
            await service.AddVotes(null, ideas.Select(x => new Idea { Id = x.Id, Thought = x.Thought, Likes = 1, Dislikes = 1 }).ToList());
            await service.AddVotes(null, ideas.Select(x => new Idea { Id = x.Id, Thought = x.Thought, Likes = 1, Dislikes = 1 }).ToList());
            var result = await service.GetAllIdeas(session.SessionId);

            // Assert
            Assert.That(result.All(x => x.Likes == 0), Is.True);
        }

        [Test]
        public async Task AddVotes_InputInvalidIdeas()
        {
            // Act
            await service.Add(session);
            await service.StartSession(session.SessionId);
            await service.AddIdeas(session.SessionId, new List<string> { "hi", "wow" });
            var ideas = await service.GetAllIdeas(session.SessionId);
            await service.AddVotes(session.SessionId, null);
            await service.AddVotes(session.SessionId, null);
            var result = await service.GetAllIdeas(session.SessionId);

            // Assert
            Assert.That(result.All(x => x.Likes == 0), Is.True);
        }

        [Test]
        public async Task SendVotesTimer_InputValid1100ms()
        {
            bool called = false;
            void callback(string param1, List<Idea> ideas)
            {
                called = true;
            }
            // Act
            await service.Add(session);
            await service.SendVotesTimer(session.SessionId, callback) ;
            await Task.Delay(1100);

            // Assert
            Assert.That(called, Is.True);
        }

        [Test]
        public async Task SendAllIdeasTimer_InputValid1100ms()
        {
            bool called = false;
            void callback(string param1, List<Idea> ideas)
            {
                called = true;
            }
            // Act
            await service.Add(session);
            await service.SendAllIdeasTimer(session.SessionId, callback);
            await Task.Delay(1100);

            // Assert
            Assert.That(called, Is.True);
        }

        [Test]
        public async Task SendAllIdeasTimer_InputInvalid900ms()
        {
            bool called = false;
            void callback(string param1, List<Idea> ideas)
            {
                called = true;
            }
            // Act
            await service.Add(session);
            await service.SendAllIdeasTimer(session.SessionId, callback);
            await Task.Delay(900);

            // Assert
            Assert.That(called, Is.False);
        }
        [Test]
        public async Task SendVotesTimer_InputInvalid900ms()
        {
            bool called = false;
            void callback(string param1, List<Idea> ideas)
            {
                called = true;
            }
            // Act
            await service.Add(session);
            await service.SendVotesTimer(session.SessionId, callback);
            await Task.Delay(900);

            // Assert
            Assert.That(called, Is.False);
        }
        [Test]
        public async Task RemoveSession_InputValid()
        {
            // Act
            await service.Add(session);
            await service.RemoveSession(session.SessionId);
            var result = await service.GetSession(session.SessionId);

            // Assert
            Assert.That(result, Is.Null);
        }
        [Test]
        public async Task AddFinalResult_InputValid()
        {
            // Act
            await service.AddFinalResult(null);

            // Assert
            Assert.Pass();
        }
    }
}
