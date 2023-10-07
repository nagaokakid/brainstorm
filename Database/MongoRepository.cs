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
    private readonly IMongoCollection<T> collection;

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
        return await collection.Find(item => item.Id.Equals(objectId)).FirstOrDefaultAsync();
    }

    public async Task<IEnumerable<T>> Find(Expression<Func<T, bool>> filter)
    {
        return await collection.Find(filter).ToListAsync();
    }

    public async Task Create(T entity)
    {
        await collection.InsertOneAsync(entity);
    }

    public async Task Update(string id, T entity)
    {
        var objectId = new ObjectId(id);
        await collection.ReplaceOneAsync(item => item.Id.Equals(objectId), entity);
    }

    public async Task Delete(string id)
    {
        var objectId = new ObjectId(id);
        await collection.DeleteOneAsync(item => item.Id.Equals(objectId));
    }
}

