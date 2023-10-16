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
            string currentDirectory = Directory.GetCurrentDirectory();

            // Full file path for config file
            string configFilePath = Path.Combine(currentDirectory, "../Database/MongoDB/" + fileName);

            // Read file and deserialize into JSON object
            string jsonConfigText = File.ReadAllText(configFilePath);
            var jsonObject = JsonSerializer.Deserialize<JsonElement>(jsonConfigText);

            return jsonObject;
        }
    }
}