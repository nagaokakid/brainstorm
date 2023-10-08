using Microsoft.Extensions.Configuration;
using MongoDB.Driver;

namespace Database
{
    public class MongoContext
    {
        private readonly IMongoDatabase database;

        public MongoContext()
        {
            try
            {
                // Get the current working directory
                string currentDirectory = Directory.GetCurrentDirectory();

                // Build the full path to the JSON configuration file
                string configFilePath = Path.Combine(currentDirectory, "mongoSettings.json");

                // Create a ConfigurationBuilder
                var builder = new ConfigurationBuilder().AddJsonFile(configFilePath, optional: true, reloadOnChange: true);

                // Build the IConfiguration
                IConfigurationRoot configuration = builder.Build();

                // Get all parts of the MongoDB connection string from the JSON config file
                string username = configuration.GetConnectionString("ConnectionString:Username");
                string apiKey = configuration.GetConnectionString("ConnectionString:API_Key");
                string cluster = configuration.GetConnectionString("ConnectionString:Cluster");
                string databaseName = configuration.GetConnectionString("ConnectionString:Database");

                // Assemble the connection string
                string connectionString = $"mongo+srv://{username}:{apiKey}@{cluster}.mongodb.net/{databaseName}";

                // Establish a connection to Mongo Atlas and retrieve brainstorm app database
                var client = new MongoClient(connectionString);
                database = client.GetDatabase(databaseName);
            }
            catch (FileNotFoundException)
            {
                Console.WriteLine("Mongo settings JSON file not found.");
            }
            catch (MongoClientException ex)
            {
                Console.WriteLine($"Error with Mongo client: {ex.Message}");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error reading Mongo settings JSON file: {ex.Message}");
            }

        }

        // Return a MongoDB collection given the collection name
        public IMongoCollection<T> GetCollection<T>(string collectionName)
        {
            return database.GetCollection<T>(collectionName);
        }

    }
}