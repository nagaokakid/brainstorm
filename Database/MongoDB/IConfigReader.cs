using System.Text.Json;

namespace Database.MongoDB
{
    public interface IConfigReader
    {
        public JsonElement ReadJsonConfigFile(string fileName);
    }

    public class ConfigReader : IConfigReader
    {

        // Read JSON config file and return a JSON object
        public JsonElement ReadJsonConfigFile(string fileName)
        {
            string? currentDirectory = Directory.GetCurrentDirectory();
            string targetDirectoryPath = "";

            // Look for config file starting from current directory, moving up the tree, one level at a time
            while (!string.IsNullOrEmpty(currentDirectory)) 
            {
                string directoryToCheck = Path.Combine(currentDirectory, "Database/MongoDB/");
                if (Directory.Exists(directoryToCheck))
                {
                    targetDirectoryPath = directoryToCheck;
                    break;
                }
                currentDirectory = Directory.GetParent(currentDirectory)?.FullName;
            }

            // Full file path for config file
            string configFilePath = Path.Combine(targetDirectoryPath, fileName);

            // Read file and deserialize into JSON object
            string jsonConfigText = File.ReadAllText(configFilePath);
            var jsonObject = JsonSerializer.Deserialize<JsonElement>(jsonConfigText);

            return jsonObject;
        }
    }
}