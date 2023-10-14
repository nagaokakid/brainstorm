namespace Database.MongoDB
{
    public static class MongoContext
    {
        public static string? ConnectionString { get; private set; }
        public static string? DatabaseName { get; private set; }

        public static void ReadConfigFile(IConfigReader configReader)
        {
            if (ConnectionString == null)
            {
                try
                {
                    // Read the json config file and return a json object
                    var jsonObject = configReader.ReadJsonConfigFile("mongoSettings.json");

                    // Gather the attributes for the connection string
                    var parentProperty = jsonObject.GetProperty("ConnectionString");
                    var username = parentProperty.GetProperty("Username").GetString();
                    var key = parentProperty.GetProperty("Key").GetString();
                    var database = parentProperty.GetProperty("Database").GetString();

                    // Assemble the connection string
                    ConnectionString = $"mongodb+srv://{username}:{key}@{database}.aj9h1fd.mongodb.net/?retryWrites=true&w=majority";
                    DatabaseName = database;
                }
                catch (FileNotFoundException)
                {
                    Console.WriteLine("Could not find the config file for MongoDB.");
                    throw;
                }
                catch (Exception ex)
                {
                    Console.WriteLine("An error occurred while reading the config file for MongoDB: " + ex.Message);
                    throw;
                }

            }

        }



    } // class

} // namespace