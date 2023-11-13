using Database.MongoDB;
using Database.Data;
using MongoDB.Driver;

namespace Database.UnitTest
{
    [TestFixture]
    public class MongoRepositoryUnitTests
    {
        private const string CONNECTION_STRING = "mongodb+srv://comp4350:O954Xbw6kQ488jym@brainstorm.btgsxmb.mongodb.net/?retryWrites=true&w=majority";
        private const string DATABASE_NAME = "test";

        [SetUp]
        public void Setup()
        {
        }

        [Test]
        public void MongoClient_GivenValidConnectionString_DoesNotThrowMongoException()
        {
            Assert.DoesNotThrow(() => new MongoClient(CONNECTION_STRING));
        }

        [Test]
        public void MongoClient_GivenInvalidConnectionString_ThrowsMongoException()
        {
            Assert.Throws<MongoConfigurationException>(() => new MongoClient("invalid_connection_string"));
        }

        [Test]
        public void MongoDatabase_GivenValidDatabaseName_DoesNotThrowMongoExceptionAndIsNotNull()
        {
            IMongoClient client = new MongoClient(CONNECTION_STRING);
            Assert.DoesNotThrow(() => client.GetDatabase(DATABASE_NAME));
            Assert.IsNotNull(client.GetDatabase(DATABASE_NAME));
        }

        [Test]
        public void Constructor_GivenValidCollectionNameOfUser_DoesNotThrowException()
        {
            string validCollectionName = "User";
            Assert.DoesNotThrow(() => new MongoRepository<User>(DATABASE_NAME, validCollectionName));
        }

        [Test]
        public void Constructor_GivenValidCollectionNameOfDirectMessage_DoesNotThrowException()
        {
            string validCollectionName = "DirectMessage";
            Assert.DoesNotThrow(() => new MongoRepository<DirectMessage>(DATABASE_NAME, validCollectionName));
        }

        [Test]
        public void Constructor_GivenValidCollectionNameOfChatRoom_DoesNotThrowException()
        {
            string validCollectionName = "ChatRoom";
            Assert.DoesNotThrow(() => new MongoRepository<ChatRoom>(DATABASE_NAME, validCollectionName));
        }

        [Test]
        public void Constructor_GivenValidCollectionNameOfChatRoomMessage_DoesNotThrowException()
        {
            string validCollectionName = "ChatRoomMessage";
            Assert.DoesNotThrow(() => new MongoRepository<ChatRoomMessage>(DATABASE_NAME, validCollectionName));
        }



    } // class
} // namespace
