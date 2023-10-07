using System;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Threading.Tasks;
using Database;
using MongoDB.Bson;
using MongoDB.Driver;

// Generic class to represent a collection of T type objects (User, ChatRoom, Message, etc.)
public class MongoRepository<T> where T : class
{
    private IMongoCollection<T> collection;

    public MongoRepository(MongoContext context, string collectionName)
    {
        collection = context.GetCollection<T>(collectionName);
    }

    public async Task<IEnumerable<T>> GetAll()
    {
        return await collection.Find(_ => true).ToListAsync();
    }

    public async Task<T> GetById(string id)
    {
        var objectId = new ObjectId(id);
        var filter = Builders<T>.Filter.Eq("_id", objectId);
        return await collection.Find(filter).FirstOrDefaultAsync();
    }

    public async Task Create(T document)
    {
        await collection.InsertOneAsync(document);
    }

    public async Task Update(string id, T document)
    {
        var objectId = new ObjectId(id);
        var filter = Builders<T>.Filter.Eq("_id", objectId);
        await collection.ReplaceOneAsync(filter, document);
    }

    public async Task Delete(string id)
    {
        var objectId = new ObjectId(id);
        var filter = Builders<T>.Filter.Eq("_id", objectId);
        await collection.DeleteOneAsync(filter);
    }
}

