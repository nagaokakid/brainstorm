﻿using MongoDB.Driver;
using MongoDB.Bson;
using Database.Data;

/* 
 * MongoRepository.cs
 * ------------------------
 * Represents a MongoRepository object.
 * This file contains the methods for the MongoRepository.
 * ---------------------------------------------------------
 * Author: Mr. Akira Cooper
 * Last Updated: 1/12/2023
 * Date Created: 1/12/2023
 * Version: 1.0
 */


namespace Database.MongoDB
{
    /// <summary>
    ///    A Generic class to represent a collection of data type documents (User, ChatRoom, Message, etc.)
    /// </summary>
    /// <typeparam name="TDocument"></typeparam>
    public class MongoRepository<TDocument> where TDocument : class
    {
        private IMongoCollection<TDocument> collection;
        private IMongoClient client;
        private IMongoDatabase database;

        // Hard-coded to avoid file location issues when using Docker
        private const string CONNECTION_STRING = "mongodb+srv://comp4350:pHPx243FmFpd645F@brainstorm.btgsxmb.mongodb.net/?retryWrites=true&w=majority";

        // Constructor: connect to MongoDB database and link to a specific collection
        public MongoRepository(string databaseName, string collectionName)
        {
            try
            {
                client = new MongoClient(CONNECTION_STRING);
                database = client.GetDatabase(databaseName);
                collection = database.GetCollection<TDocument>(collectionName);
            }
            catch (MongoConfigurationException ex)
            {
                Console.WriteLine("Mongo Exception! Failed to connect to MongoDB: " + ex.Message);
                Console.WriteLine(ex.StackTrace);
                throw;
            }
            catch (Exception ex)
            {
                Console.WriteLine("System Exception! Failed to connect to MongoDB: " + ex.Message);
                Console.WriteLine(ex.StackTrace);
                throw;
            }

        }

        // Get all the documents for a collection
        public async Task<List<TDocument>> GetAllDocuments()
        {
            try
            {
                return await collection.Find(_ => true).ToListAsync();
            }
            catch (MongoException ex)
            {
                Console.WriteLine("Mongo Exception! Failed to retrieve all documents for the collection: " + ex.Message);
                Console.WriteLine(ex.StackTrace);
                throw;
            }
            catch (Exception ex)
            {
                Console.WriteLine("System Exception! Failed to retrieve all documents for a collection: " + ex.Message);
                Console.WriteLine(ex.StackTrace);
                throw;
            }
        }

        // Get a single document by ID
        public async Task<TDocument> GetDocumentById(string id)
        {
            try
            {
                var filter = Builders<TDocument>.Filter.Eq("_id", id);
                return await collection.Find(filter).FirstOrDefaultAsync();
            }
            catch (MongoException ex)
            {
                Console.WriteLine("Mongo Exception! Failed to retrieve a document: " + ex.Message);
                Console.WriteLine(ex.StackTrace);
                throw;
            }
            catch (Exception ex)
            {
                Console.WriteLine("System Exception! Failed to retrieve a document: " + ex.Message);
                Console.WriteLine(ex.StackTrace);
                throw;
            }
        }

        // Get a single document that matches the given field names and values
        public async Task<TDocument> GetDocumentByFieldDictionary(Dictionary<string, string> fieldDict)
        {
            try
            {
                var filterBuilder = Builders<TDocument>.Filter;
                var filter = filterBuilder.Empty;

                foreach (var field in fieldDict)
                {
                    filter &= filterBuilder.Eq(field.Key, field.Value);
                }

                /*                for (int i = 0; i < fieldNames.Count; i++)
                                {
                                    filter = filter & filterBuilder.Eq(fieldNames[i], fieldValues[i]);
                                }*/

                return await collection.Find(filter).FirstOrDefaultAsync();
            }
            catch (MongoException ex)
            {
                Console.WriteLine("Mongo Exception! Failed to retrieve document with given field names and values: " + ex.Message);
                Console.WriteLine(ex.StackTrace);
                throw;
            }
            catch (Exception ex)
            {
                Console.WriteLine("System Exception! Failed to retrieve document with given field names and values: " + ex.Message);
                Console.WriteLine(ex.StackTrace);
                throw;
            }
        }

        // Get all documents that match the given the field names and their values
        public async Task<List<TDocument>> GetAllDocumentsByFieldDictionary(Dictionary<string, string> fieldDict)
        {
            try
            {
                var filterBuilder = Builders<TDocument>.Filter;
                var filter = filterBuilder.Empty;

                foreach (var field in fieldDict)
                {
                    filter &= filterBuilder.Eq(field.Key, field.Value);
                }

                /*                for (int i = 0; i < fieldNames.Count; i++)
                                {
                                    filter &= filterBuilder.Eq(fieldNames[i], fieldValues[i]);
                                }*/

                return await collection.Find(filter).ToListAsync();
            }
            catch (MongoException ex)
            {
                Console.WriteLine("Mongo Exception! Failed to get a list of documents with given field names and values: " + ex.Message);
                Console.WriteLine(ex.StackTrace);
                throw;
            }
            catch (Exception ex)
            {
                Console.WriteLine("System Exception! Failed to get a list of documents wiht given field names and values: " + ex.Message);
                Console.WriteLine(ex.StackTrace);
                throw;
            }

        }

        // Get all documents where the given field name matches any of the values in the given list
        public async Task<List<TDocument>> GetAllDocumentsByValueList(string fieldName, List<string> valueList)
        {
            var filter = Builders<TDocument>.Filter.In(fieldName, valueList);
            return await collection.Find(filter).ToListAsync();
        }

        // Create a new document
        public async Task CreateDocument(TDocument document)
        {
            try
            {
                await collection.InsertOneAsync(document);
            }
            catch (MongoException ex)
            {
                Console.WriteLine("Mongo Exception! Failed to create document on MongoDB: " + ex.Message);
                Console.WriteLine(ex.StackTrace);
                throw;
            }
            catch (Exception ex)
            {
                Console.WriteLine("System Exception! Failed to create document on MongoDB: " + ex.Message);
                Console.WriteLine(ex.StackTrace);
                throw;
            }
        }

        // Overwrite an existing document with a new one
        public async Task ReplaceDocument(string id, TDocument newDocument)
        {
            try
            {
                var filter = Builders<TDocument>.Filter.Eq("_id", id);
                var result = await collection.ReplaceOneAsync(filter, newDocument);

                if (result.ModifiedCount == 0)
                {
                    Console.WriteLine("No document was replaced.");
                }
            }
            catch (MongoException ex)
            {
                Console.WriteLine("Mongo Exception! Failed to replace an existing document on MongoDB: " + ex.Message);
                Console.WriteLine(ex.StackTrace);
            }
            catch (Exception ex)
            {
                Console.WriteLine("System Exception! Failed to replace an existing document on MongoDB: " + ex.Message);
                Console.WriteLine(ex.StackTrace);
                throw;
            }
        }

        // Update the value of a field in an existing document
        public async Task UpdateFieldInDocument(string id, string fieldName, string newFieldValue)
        {
            try
            {
                var filter = Builders<TDocument>.Filter.Eq("_id", id);
                var update = Builders<TDocument>.Update.Set(fieldName, newFieldValue);
                var result = await collection.UpdateOneAsync(filter, update);

                if (result.ModifiedCount == 0)
                {
                    Console.WriteLine("No document field was updated.");
                }
            }
            catch (MongoException ex)
            {
                Console.WriteLine("Mongo Exception! Failed to update field value in a document on MongoDB" + ex.Message);
                Console.WriteLine(ex.StackTrace);
                throw;
            }
            catch (Exception ex)
            {
                Console.WriteLine("System Exception! Failed to update field value in a document on MongoDB: " + ex.Message);
                Console.WriteLine(ex.StackTrace);
                throw;
            }
        }

        // Add a new element to an array within an existing document
        public async Task AddToArrayInDocument(string id, string arrayName, object newElement)
        {
            try
            {
                var filter = Builders<TDocument>.Filter.Eq("_id", id);
                var update = Builders<TDocument>.Update.Push(arrayName, newElement);
                var result = await collection.UpdateOneAsync(filter, update);

                if (result.ModifiedCount == 0)
                {
                    Console.WriteLine("No document array was updated.");
                }
            }
            catch (MongoException ex)
            {
                Console.WriteLine("Mongo Exception! Failed to add element to document array on MongoDB: " + ex.Message);
                Console.WriteLine(ex.StackTrace);
                throw;
            }
            catch (Exception ex)
            {
                Console.WriteLine("System Exception! Failed to add element to document array on MongoDB: " + ex.Message);
                Console.WriteLine(ex.StackTrace);
                throw;
            }
        }

        // Remove an element from an array within an existing document
        public async Task RemoveFromArrayInDocument(string id, string arrayName, object elementToRemove)
        {
            try
            {
                var filter = Builders<TDocument>.Filter.Eq("_id", id);
                var update = Builders<TDocument>.Update.Pull(arrayName, elementToRemove);
                var result = await collection.UpdateOneAsync(filter, update);

                if (result.ModifiedCount == 0)
                {
                    Console.WriteLine("No element was removed from document array.");
                }
            }
            catch (MongoException ex)
            {
                Console.WriteLine("Mongo Exception! Failed to remove element from document array on MongoDB: " + ex.Message);
                Console.WriteLine(ex.StackTrace);
                throw;
            }
            catch (Exception ex)
            {
                Console.WriteLine("System Exception! Failed to remove element from document array on MongoDB: " + ex.Message);
                Console.WriteLine(ex.StackTrace);
                throw;
            }
        }

        // Remove a document from a nested collection (i.e.: delete a message from a chatroom's list of message objects)
        public async Task RemoveDocumentFromNestedCollection(string id, string dataType, string nestedCollectionName, string nestedDocumentId)
        {
            try
            {
                var filter = Builders<TDocument>.Filter.Eq("_id", id);
                UpdateDefinition<TDocument> update = null;

                if (dataType == "ChatRoomMessage")
                {
                    var nestedFilter = Builders<ChatRoomMessage>.Filter.Eq("_id", nestedDocumentId);
                    update = Builders<TDocument>.Update.PullFilter(nestedCollectionName, nestedFilter);
                }
                else if (dataType == "DirectMessage")
                {
                    var nestedFilter = Builders<DirectMessage>.Filter.Eq("_id", nestedDocumentId);
                    update = Builders<TDocument>.Update.PullFilter(nestedCollectionName, nestedFilter);
                }

                var result = await collection.UpdateOneAsync(filter, update);

                if (result.ModifiedCount == 0)
                {
                    Console.WriteLine("No document was removed from nested collection.");
                }
            }
            catch (MongoException ex)
            {
                Console.WriteLine("Mongo Exception! Failed to remove document from nested collection in MongoDB: " + ex.Message);
                Console.WriteLine(ex.StackTrace);
                throw;
            }
            catch (Exception ex)
            {
                Console.WriteLine("System Exception! Failed to remove document from nested collection in MongoDB: " + ex.Message);
                Console.WriteLine(ex.StackTrace);
                throw;
            }
        }

        // Delete an existing document
        public async Task DeleteDocument(string id)
        {
            try
            {
                var filter = Builders<TDocument>.Filter.Eq("_id", id);
                var result = await collection.DeleteOneAsync(filter);

                if (result.DeletedCount == 0)
                {
                    Console.WriteLine("No document was deleted.");
                }
            }
            catch (MongoException ex)
            {
                Console.WriteLine("Mongo Exception! Failed to delete document on MongoDB: " + ex.Message);
                Console.WriteLine(ex.StackTrace);
                throw;
            }
            catch (Exception ex)
            {
                Console.WriteLine("System Exception! Failed to delete document on MongoDB: " + ex.Message);
                Console.WriteLine(ex.StackTrace);
                throw;
            }

        }
    }
}

