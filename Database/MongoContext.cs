using Microsoft.Extensions.Configuration;

namespace Database
{
    public class MongoContext
    {
        public static string ConnectionString { get; set; }
        public static string DatabaseName { get; set; }

        public MongoContext()
        {
            if (ConnectionString == null)
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
                    DatabaseName = configuration.GetConnectionString("ConnectionString:Database");

                    // Assemble the connection string
                    ConnectionString = $"mongo+srv://{username}:{apiKey}@{cluster}.mongodb.net/{DatabaseName}";
                }
                catch (FileNotFoundException)
                {
                    Console.WriteLine("Could not find the JSON file for MongoDB settings.");
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"An error occurred while reading the JSON file for MongoDB settings: {ex.Message}");
                }

            }
        } // constructor

    }

}