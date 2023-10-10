using MongoDB.Bson;
using MongoDB.Driver;

namespace Database
{
    // Generic class to represent a collection of T type objects (User, ChatRoom, Message, etc.)
    public class MongoRepository<Data> where Data : class
    {
        private IMongoCollection<Data> collection;
        private readonly MongoContext context;
        private MongoClient client;
        private IMongoDatabase database;

        // Constructor: connect to MongoDB database and retrieve the collection by name
        public MongoRepository(string collectionName)
        {
            context = new();
            client = new MongoClient(MongoContext.ConnectionString);
            database = client.GetDatabase(MongoContext.DatabaseName);
            collection = database.GetCollection<Data>(collectionName);
        }

        // Get all the documents
        public async Task<IEnumerable<Data>> GetAll()
        {
            return await collection.Find(_ => true).ToListAsync();
        }

        // Get a single document by ID
        public async Task<Data> GetById(string id)
        {
            var objectId = new ObjectId(id);
            var filter = Builders<Data>.Filter.Eq("_id", objectId);
            return await collection.Find(filter).FirstOrDefaultAsync();
        }

        // Create a new document
        public async Task Create(Data data)
        {
            await collection.InsertOneAsync(data);
        }

        // Update an existing document
        public async Task Update(string id, Data data)
        {
            var objectId = new ObjectId(id);
            var filter = Builders<Data>.Filter.Eq("_id", objectId);
            await collection.ReplaceOneAsync(filter, data);
        }

        // Delete an existing document
        public async Task Delete(string id)
        {
            var objectId = new ObjectId(id);
            var filter = Builders<Data>.Filter.Eq("_id", objectId);
            await collection.DeleteOneAsync(filter);
        }
    }
}

