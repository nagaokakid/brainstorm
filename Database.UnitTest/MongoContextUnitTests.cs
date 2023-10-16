using System.Text.Json;
using Moq;
using Database.MongoDB;

namespace Database.UnitTest
{
    [TestFixture]
    public class MongoContextUnitTests
    {
        Mock<IConfigReader> configReaderMock;

        [SetUp]
        public void Setup()
        {
            configReaderMock = new Mock<IConfigReader>();
        }

        [Test]
        public void ReadConfigFile_ValidConfigFile_SetConnectionStringAndDatabaseName()
        {

            // This is what the mongo config file looks like
            var json = "{\"ConnectionString\": {\"Username\": \"testUser\", \"Key\": \"testKey\", \"Database\": \"testDatabase\"}}";

            // The json object of the config file
            var jsonElement = JsonDocument.Parse(json).RootElement;

            // Setup mock config reader to read json config file and return json object
            configReaderMock.Setup(cr => cr.ReadJsonConfigFile("mongoSettings.json")).Returns(jsonElement);

            // Take action
            MongoContext.ReadConfigFile(configReaderMock.Object);

            // Assert connection string validity
            string correctString = "mongodb+srv://testUser:testKey@testDatabase.aj9h1fd.mongodb.net/?retryWrites=true&w=majority";
            Assert.That(MongoContext.ConnectionString, Is.EqualTo(correctString));
            Assert.That(MongoContext.DatabaseName, Is.EqualTo("testDatabase"));
        }

        [Test]
        public void ReadConfigFile_InvalidConfigFile_ThrowsException()
        {
            // Config file does not contain all the right properties for connection string
            var json = "{}";
            var jsonElement = JsonDocument.Parse(json).RootElement;
            configReaderMock.Setup(cr => cr.ReadJsonConfigFile("mongoSettings.json")).Returns(jsonElement);

            // Must throw exception when attempting to read expected properties
            Assert.Throws<KeyNotFoundException>(() => MongoContext.ReadConfigFile(configReaderMock.Object));
        }

    }
}