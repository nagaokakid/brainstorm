using Database;

namespace Database.UnitTest
{
    [TestFixture]
    public class MongoContextUnitTests
    {
        private string connectionString;
        private string databaseName;

        [SetUp]
        public void Setup()
        {
        }

        [Test]
        public void ConfigFile_ReadProperties_Success()
        {
            MongoContext.ConnectionString = connectionString;
        }
    }
}