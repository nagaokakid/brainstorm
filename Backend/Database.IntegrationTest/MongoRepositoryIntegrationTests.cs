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

        // Attempt insertion of documents for each repo
        [Test]
        public void CreateDocument_GivenValidObject_DoesNotThrowMongoException()
        {
            Assert.DoesNotThrowAsync(() => testUserRepo.CreateDocument(testUser1));
            Assert.DoesNotThrowAsync(() => testChatRoomRepo.CreateDocument(testChatRoom1));
            Assert.DoesNotThrowAsync(() => testDirectMessageHistoryRepo.CreateDocument(testDirectMessageHistory1));
            Assert.DoesNotThrowAsync(() => testBrainstormResultRepo.CreateDocument(testBrainstormResult1));
        }

        // Attempt insertion of documents and then retrieval by ID for each repo
        [Test]
        public void GetDocumentById_GivenValidObject_Success()
        {
            Assert.DoesNotThrowAsync(() => testUserRepo.CreateDocument(testUser1));
            Assert.DoesNotThrowAsync(() => testChatRoomRepo.CreateDocument(testChatRoom1));
            Assert.DoesNotThrowAsync(() => testDirectMessageHistoryRepo.CreateDocument(testDirectMessageHistory1));
            Assert.DoesNotThrowAsync(() => testBrainstormResultRepo.CreateDocument(testBrainstormResult1));

            Assert.IsNotNull(testUserRepo.GetDocumentById("u1"));
            Assert.IsNotNull(testUserRepo.GetDocumentById("u2"));
            Assert.IsNotNull(testChatRoomRepo.GetDocumentById("cr1"));
            Assert.IsNotNull(testChatRoomRepo.GetDocumentById("cr2"));
            Assert.IsNotNull(testDirectMessageHistoryRepo.GetDocumentById("dmh1"));
            Assert.IsNotNull(testDirectMessageHistoryRepo.GetDocumentById("dmh2"));
            Assert.IsNotNull(testBrainstormResultRepo.GetDocumentById("br1"));
            Assert.IsNotNull(testBrainstormResultRepo.GetDocumentById("br2"));
        }

        // Attempt insertion and then retrieval of all documents for each repo
        [Test]
        public async Task GetAllDocuments_ReturnsDocuments_Success()
        {
            Assert.DoesNotThrowAsync(() => testUserRepo.CreateDocument(testUser1));
            Assert.DoesNotThrowAsync(() => testChatRoomRepo.CreateDocument(testChatRoom1));
            Assert.DoesNotThrowAsync(() => testDirectMessageHistoryRepo.CreateDocument(testDirectMessageHistory1));
            Assert.DoesNotThrowAsync(() => testBrainstormResultRepo.CreateDocument(testBrainstormResult1));
            Assert.DoesNotThrowAsync(() => testUserRepo.CreateDocument(testUser2));
            Assert.DoesNotThrowAsync(() => testChatRoomRepo.CreateDocument(testChatRoom2));
            Assert.DoesNotThrowAsync(() => testDirectMessageHistoryRepo.CreateDocument(testDirectMessageHistory2));
            Assert.DoesNotThrowAsync(() => testBrainstormResultRepo.CreateDocument(testBrainstormResult2));

            Assert.IsNotNull(testUserRepo.GetAllDocuments());
            Assert.IsNotNull(testChatRoomRepo.GetAllDocuments());
            Assert.IsNotNull(testDirectMessageHistoryRepo.GetAllDocuments());
            Assert.IsNotNull(testBrainstormResultRepo.GetAllDocuments());

            var users = await testUserRepo.GetAllDocuments();
            var chatRooms = await testChatRoomRepo.GetAllDocuments();
            var directMessageHistories = await testDirectMessageHistoryRepo.GetAllDocuments();
            var brainstormResults = await testBrainstormResultRepo.GetAllDocuments();

            Assert.That(users.Count, Is.EqualTo(2));
            Assert.That(chatRooms.Count, Is.EqualTo(2));
            Assert.That(directMessageHistories.Count, Is.EqualTo(2));
            Assert.That(brainstormResults.Count, Is.EqualTo(2));
        }

        // Attempt insertion and then retrieval of a document's array
        [Test]
        public async Task GetDocumentArray_ReturnsArray_Success()
        {
            testUser1.ChatroomIds = new() { "cr1" };
            Assert.DoesNotThrowAsync(() => testUserRepo.CreateDocument(testUser1));

            var user = await testUserRepo.GetDocumentById(testUser1.Id);
            Assert.IsNotNull(user);
            Assert.IsNotNull(user.ChatroomIds);
            Assert.That(user.ChatroomIds[0], Is.EqualTo("cr1"));
        }

        // Attempt deletion from document's array and then verify
        [Test]
        public async Task DeleteElementInDocumentArray_DoesNotThrowMongoException()
        {
            testUser1.ChatroomIds = new() { "cr1" };
            Assert.DoesNotThrowAsync(() => testUserRepo.CreateDocument(testUser1));

            Assert.DoesNotThrowAsync(() => testUserRepo.RemoveFromArrayInDocument(testUser1.Id, "ChatroomIds", "cr1"));
            var user = await testUserRepo.GetDocumentById(testUser1.Id);
            var chatrooms = user.ChatroomIds;
            Assert.That(chatrooms.Count, Is.EqualTo(0));
        }

        // Attempt replace operation for existing document
        [Test]
        public async Task ReplaceDocument_DocumentIsDifferent_Success()
        {
            await testUserRepo.CreateDocument(testUser1);
            testUser2.Id = testUser1.Id;
            testUser2.ChatroomIds = new() {"second"};
            await testUserRepo.ReplaceDocument(testUser1.Id, testUser2); // need to retain the original ID since _id is immutable in MongoDB
            var user = await testUserRepo.GetDocumentById("u1");

            Assert.That(user.ChatroomIds[0], Is.EqualTo("second"));
        }

        // Attempt retrieval of all documents based on dictionary of field values
        [Test]
        public async Task GetAllDocumentsByFieldDictionary_DocumentsFound_Success()
        {
            await testUserRepo.CreateDocument(testUser1);
            await testUserRepo.CreateDocument(testUser2);

            Dictionary<string, string> fieldDict = new()
            {
                {"Username", "testUsername"},
                {"Password", "testPassword"}
            };

            var users = await testUserRepo.GetAllDocumentsByFieldDictionary(fieldDict);

            Assert.That(users.Count, Is.EqualTo(2));
        }

        // Attempt retrieval of all documents based list of field values
        [Test]
        public async Task GetAllDocumentsByFieldValuesList_DocumentsFound_Success()
        {
            testUser1.FirstName = "a";
            testUser2.FirstName = "b";
            await testUserRepo.CreateDocument(testUser1);
            await testUserRepo.CreateDocument(testUser2);

            List<string> values = new() { "a", "b" };

            var users = await testUserRepo.GetAllDocumentsByValueList("FirstName", values);

            Assert.That(users.Count, Is.EqualTo(2));
        }

        // Attempt change of field value for existing document
        [Test]
        public async Task ChangeFieldValueForDocument_ChangeMade_Success()
        {
            await testUserRepo.CreateDocument(testUser1);
            await testUserRepo.UpdateFieldInDocument(testUser1.Id, "FirstName", "changed");

            var user = await testUserRepo.GetDocumentById(testUser1.Id);
            Assert.That(user.FirstName, Is.EqualTo("changed"));
        }

        // Attempt deletion of an existing document
        [Test]
        public async Task DeleteDocument_Removed_ReturnsNull()
        {
            await testUserRepo.CreateDocument(testUser1);
            await testUserRepo.DeleteDocument(testUser1.Id);
            var user = await testUserRepo.GetDocumentById(testUser1.Id);
            Assert.IsNull(user);
        }


    } // class
} // namespace