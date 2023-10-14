using System.Text.Json;

namespace Database.MongoDB
{
    public interface IConfigReader
    {
        JsonElement ReadJsonConfigFile(string fileName);
    }

    public class ConfigReader : IConfigReader
    {
        // Read json config file and return a JSON object
        public JsonElement ReadJsonConfigFile(string fileName)
        {
            // Get file path
            string currentDirectory = Directory.GetCurrentDirectory();
            string configFilePath = Path.Combine(currentDirectory, fileName);

            // Read file and deserialize as JSON object
            string jsonConfigText = File.ReadAllText(configFilePath);
            var jsonObject = JsonSerializer.Deserialize<JsonElement>(jsonConfigText);

            return jsonObject;
        }
    }
}