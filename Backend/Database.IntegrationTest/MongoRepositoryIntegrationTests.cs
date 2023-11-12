using Database.MongoDB;
using Database.Data;
using MongoDB.Driver;
using MongoDB.Bson.Serialization.Attributes;

namespace Database.IntegrationTest
{
    [TestFixture]
    public class MongoRepositoryIntegrationTests
    {
        private IMongoClient client;
        private IMongoDatabase database;

        private MongoRepository<User> testUserRepo;
        private MongoRepository<ChatRoom> testChatRoomRepo;
        private MongoRepository<ChatRoomMessage> testChatRoomMessageRepo;
        private MongoRepository<DirectMessage> testDirectMessageRepo;
        private MongoRepository<DirectMessageHistory> testDirectMessageHistoryRepo;
        private MongoRepository<BrainstormResult> testBrainstormResultRepo;

        private User testUser1;
        private User testUser2;
        private ChatRoom testChatRoom1;
        private ChatRoom testChatRoom2;
        private ChatRoomMessage testChatRoomMessage1;
        private ChatRoomMessage testChatRoomMessage2;
        private DirectMessage testDirectMessage1;
        private DirectMessage testDirectMessage2;
        private DirectMessageHistory testDirectMessageHistory1;
        private DirectMessageHistory testDirectMessageHistory2;
        private BrainstormResult testBrainstormResult1;
        private BrainstormResult testBrainstormResult2;

        // Connect to db collections and ressign data objects before every test
        [SetUp]
        public void Setup()
        {
            testUserRepo = new("test", "User");
            testChatRoomRepo = new("test", "ChatRoom");
            testChatRoomMessageRepo = new("test", "ChatRoomMessage");
            testDirectMessageRepo = new("test", "DirectMessage");
            testDirectMessageHistoryRepo = new("test", "DirectMessageHistory");
            testBrainstormResultRepo = new("test", "BrainstormResult");

            testUser1 = new User()
            {
                Id = "u1",
                Username = "testUsername",
                Password = "testPassword",
                FirstName = "testFirstName",
                LastName = "testLastName",
                ChatroomIds = new List<string>(),
                DirectMessageHistoryIds = new List<string>(),
                BrainstormResultIds = new List<string>()
            };
            testUser2 = new User()
            {
                Id = "u2",
                Username = "testUsername",
                Password = "testPassword",
                FirstName = "testFirstName",
                LastName = "testLastName",
                ChatroomIds = new List<string>(),
                DirectMessageHistoryIds = new List<string>(),
                BrainstormResultIds = new List<string>()
            };

            testChatRoom1 = new ChatRoom()
            {
                Id = "cr1",
                Title = "testTitle",
                Description = "testDescription",
                JoinCode = "123456",
                Messages = new List<ChatRoomMessage>(),
                MemberIds = new List<string>()
            };
            testChatRoom2 = new ChatRoom()
            {
                Id = "cr2",
                Title = "testTitle",
                Description = "testDescription",
                JoinCode = "123456",
                Messages = new List<ChatRoomMessage>(),
                MemberIds = new List<string>()
            };

            testChatRoomMessage1 = new ChatRoomMessage()
            {
                FromUserId = "u1",
                Message = "testMessage",
                Timestamp = DateTime.Now
            };
            testChatRoomMessage2 = new ChatRoomMessage()
            {
                FromUserId = "u2",
                Message = "testMessage",
                Timestamp = DateTime.Now
            };

            testDirectMessage1 = new DirectMessage()
            {
                FromUserId = "u1",
                Message = "testMessage",
                Timestamp = DateTime.Now
            };
            testDirectMessage2 = new DirectMessage()
            {
                FromUserId = "u2",
                Message = "testMessage",
                Timestamp = DateTime.Now
            };

            testDirectMessageHistory1 = new DirectMessageHistory()
            {
                Id = "dmh1",
                UserId1 = "u1",
                UserId2 = "u2",
                DirectMessages = new List<DirectMessage>()
            };

            testDirectMessageHistory2 = new DirectMessageHistory()
            {
                Id = "dmh2",
                UserId1 = "u1",
                UserId2 = "u2",
                DirectMessages = new List<DirectMessage>()
            };

            testBrainstormResult1 = new BrainstormResult()
            {
                Id = "br1",
                ChatroomId = "c1",
                EndTime = DateTime.Now,
                IdeasWithVotes = new()
            };

            testBrainstormResult2 = new BrainstormResult()
            {
                Id = "br2",
                ChatroomId = "c2",
                EndTime = DateTime.Now,
                IdeasWithVotes = new()
            };
        }

        // Clear all db collections after each test
        [TearDown]
        public void TearDown()
        {
            client = new MongoClient("mongodb+srv://comp4350:pHPx243FmFpd645F@brainstorm.btgsxmb.mongodb.net/?retryWrites=true&w=majority");
            database = client.GetDatabase("test");

            database.DropCollection("User");
            database.DropCollection("ChatRoom");
            database.DropCollection("ChatRoomMessage");
            database.DropCollection("DirectMessage");
            database.DropCollection("DirectMessageHistory");
            database.DropCollection("BrainstormResult");
        }

        [Test]
        public void CreateDocument_GivenValidObject_DoesNotThrowMongoException()
        {
            Assert.DoesNotThrowAsync(() => testUserRepo.CreateDocument(testUser1));
            Assert.DoesNotThrowAsync(() => testChatRoomRepo.CreateDocument(testChatRoom1));
            Assert.DoesNotThrowAsync(() => testChatRoomMessageRepo.CreateDocument(testChatRoomMessage1));
            Assert.DoesNotThrowAsync(() => testDirectMessageRepo.CreateDocument(testDirectMessage1));
            Assert.DoesNotThrowAsync(() => testDirectMessageHistoryRepo.CreateDocument(testDirectMessageHistory1));
            Assert.DoesNotThrowAsync(() => testBrainstormResultRepo.CreateDocument(testBrainstormResult1));
        }

        [Test]
        public async Task GetAllDocuments_ReturnsDocuments_Success()
        {
            Assert.DoesNotThrowAsync(() => testUserRepo.CreateDocument(testUser1));
            Assert.DoesNotThrowAsync(() => testChatRoomRepo.CreateDocument(testChatRoom1));
            Assert.DoesNotThrowAsync(() => testChatRoomMessageRepo.CreateDocument(testChatRoomMessage1));
            Assert.DoesNotThrowAsync(() => testDirectMessageRepo.CreateDocument(testDirectMessage1));
            Assert.DoesNotThrowAsync(() => testDirectMessageHistoryRepo.CreateDocument(testDirectMessageHistory1));
            Assert.DoesNotThrowAsync(() => testBrainstormResultRepo.CreateDocument(testBrainstormResult1));
            Assert.DoesNotThrowAsync(() => testUserRepo.CreateDocument(testUser2));
            Assert.DoesNotThrowAsync(() => testChatRoomRepo.CreateDocument(testChatRoom2));
            Assert.DoesNotThrowAsync(() => testChatRoomMessageRepo.CreateDocument(testChatRoomMessage2));
            Assert.DoesNotThrowAsync(() => testDirectMessageRepo.CreateDocument(testDirectMessage2));
            Assert.DoesNotThrowAsync(() => testDirectMessageHistoryRepo.CreateDocument(testDirectMessageHistory2));
            Assert.DoesNotThrowAsync(() => testBrainstormResultRepo.CreateDocument(testBrainstormResult2));

            Assert.IsNotNull(testUserRepo.GetAllDocuments());
            Assert.IsNotNull(testChatRoomRepo.GetAllDocuments());
            Assert.IsNotNull(testChatRoomMessageRepo.GetAllDocuments());
            Assert.IsNotNull(testDirectMessageRepo.GetAllDocuments());
            Assert.IsNotNull(testDirectMessageHistoryRepo.GetAllDocuments());
            Assert.IsNotNull(testBrainstormResultRepo.GetAllDocuments());

            var users = await testUserRepo.GetAllDocuments();
            var chatRooms = await testChatRoomRepo.GetAllDocuments();
            var chatRoomMessages = await testChatRoomMessageRepo.GetAllDocuments();
            var directMessages = await testDirectMessageRepo.GetAllDocuments();
            var directMessageHistories = await testDirectMessageHistoryRepo.GetAllDocuments();
            var brainstormResults = await testBrainstormResultRepo.GetAllDocuments();

            Assert.That(2, Is.EqualTo(users.Count));
            Assert.That(2, Is.EqualTo(chatRooms.Count));
            Assert.That(2, Is.EqualTo(chatRoomMessages.Count));
            Assert.That(2, Is.EqualTo(directMessages.Count));
            Assert.That(2, Is.EqualTo(directMessageHistories.Count));
            Assert.That(2, Is.EqualTo(brainstormResults.Count));


        }



    }
}