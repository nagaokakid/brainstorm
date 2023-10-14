﻿using MongoDB.Bson;
using MongoDB.Driver;

namespace Database.MongoDB
{
    // Generic class to represent a collection of data type documents (User, ChatRoom, Message, etc.)
    public class MongoRepository<TDocument> where TDocument : class
    {
        private IMongoCollection<TDocument>? collection;
        private string collectionName;
        private MongoClient? client;
        private IMongoDatabase? database;

        // Constructor: connect to MongoDB and link to a collection
        public MongoRepository(string collectionName)
        {
            this.collectionName = collectionName;
            ConnectToMongo();
        }

        // Attempt database connection
        private void ConnectToMongo()
        {
            try
            {
                var configReader = new ConfigReader();
                MongoContext.ReadConfigFile(configReader);
                client = new MongoClient(MongoContext.ConnectionString);
                database = client.GetDatabase(MongoContext.DatabaseName);
                collection = database.GetCollection<TDocument>(collectionName);
            }
            catch (MongoException ex)
            {
                Console.WriteLine("Failed to connect to MongoDB: " + ex.Message);
                throw;
            }
            catch (Exception ex)
            {
                Console.WriteLine("General error occurred: " + ex.Message);
                throw;
            }
        }

        // Get all the documents for a collection
        public async Task<IEnumerable<TDocument>> GetAllDocuments()
        {
            try
            {
                return await collection.Find(_ => true).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine("Failed to retrieve all documents for the collection on MongoDB: " + ex.Message);
                throw;
            }
        }

        // Get a single document by ID
        public async Task<TDocument> GetDocumentById(string id)
        {
            try
            {
                var objectId = new ObjectId(id);
                var filter = Builders<TDocument>.Filter.Eq("_id", objectId);
                return await collection.Find(filter).FirstOrDefaultAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine("Failed to retrieve document on MongoDB: " + ex.Message);
                throw;
            }

        }

        // Get a single document that matches the given field names and values
        public async Task<TDocument> GetDocumentByFieldValues(List<string> fieldNames, List<string> fieldValues)
        {
            try
            {
                var filterBuilder = Builders<TDocument>.Filter;
                var filter = filterBuilder.Empty;

                for (int i = 0; i < fieldNames.Count; i++)
                {
                    filter = filter & filterBuilder.Eq(fieldNames[i], fieldValues[i]);
                }

                return await collection.Find(filter).FirstOrDefaultAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine("Failed to retrieve document with given field names and values: " + ex.Message);
                throw;
            }
        }

        // Get all documents that match the given the field names and their values
        public async Task<IEnumerable<TDocument>> GetAllDocumentsByFieldValues(List<string> fieldNames, List<string> fieldValues)
        {
            try
            {
                var filterBuilder = Builders<TDocument>.Filter;
                var filter = filterBuilder.Empty;

                for (int i = 0; i < fieldNames.Count; i++)
                {
                    filter &= filterBuilder.Eq(fieldNames[i], fieldValues[i]);
                }

                return await collection.Find(filter).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine("Failed to get list of documents with given field names and values: " + ex.Message);
                throw;
            }

        }

        // Create a new document
        public async Task CreateDocument(TDocument document)
        {
            try
            {
                await collection.InsertOneAsync(document);
            }
            catch (Exception ex)
            {
                Console.WriteLine("Failed to create document on MongoDB: " + ex.Message);
                throw;
            }
        }

        // Overwrite an existing document with a new one
        public async Task ReplaceDocument(string id, TDocument newDocument)
        {
            try
            {
                var objectId = new ObjectId(id);
                var filter = Builders<TDocument>.Filter.Eq("_id", objectId);
                var result = await collection.ReplaceOneAsync(filter, newDocument);

                if (result.ModifiedCount == 0)
                {
                    Console.WriteLine("No document was replaced.");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("Failed to replace document on MongoDB: " + ex.Message);
                throw;
            }

        }

        // Update the value of a field in an existing document
        public async Task UpdateFieldInDocument(string id, string fieldName, string newFieldValue)
        {
            try
            {
                var objectId = new ObjectId(id);
                var filter = Builders<TDocument>.Filter.Eq("_id", objectId);
                var update = Builders<TDocument>.Update.Set(fieldName, newFieldValue);
                var result = await collection.UpdateOneAsync(filter, update);

                if (result.ModifiedCount == 0)
                {
                    Console.WriteLine("No document field was updated.");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("Failed to update field value in a document on MongoDB" + ex.Message);
                throw;
            }
        }

        // Add a new element to an array within an existing document
        public async Task AddToArrayInDocument(string id, string arrayName, string newElement)
        {
            try
            {
                var objectId = new ObjectId(id);
                var filter = Builders<TDocument>.Filter.Eq("_id", objectId);
                var update = Builders<TDocument>.Update.Push(arrayName, newElement);
                var result = await collection.UpdateOneAsync(filter, update);

                if (result.ModifiedCount == 0)
                {
                    Console.WriteLine("No document array was updated.");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("Failed to add element to document array on MongoDB: " + ex.Message);
                throw;
            }

        }

        // Remove an element from an array within an existing document
        public async Task RemoveFromArrayInDocument(string id, string arrayName, string elementToRemove)
        {
            try
            {
                var objectId = new ObjectId(id);
                var filter = Builders<TDocument>.Filter.Eq("_id", objectId);
                var update = Builders<TDocument>.Update.Pull(arrayName, elementToRemove);
                var result = await collection.UpdateOneAsync(filter, update);

                if (result.ModifiedCount == 0)
                {
                    Console.WriteLine("No element was removed from document array.");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("Failed to remove element from document array on MongoDB: " + ex.Message);
                throw;
            }

        }

        // Delete an existing document
        public async Task DeleteDocument(string id)
        {
            try
            {
                var objectId = new ObjectId(id);
                var filter = Builders<TDocument>.Filter.Eq("_id", objectId);
                var result = await collection.DeleteOneAsync(filter);

                if (result.DeletedCount == 0)
                {
                    Console.WriteLine("No document was deleted.");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("Failed to delete document on MongoDB: " + ex.Message);
                throw;
            }

        }
    }
}
