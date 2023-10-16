using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;

namespace Database.Data
{
    public class User
    {
        [BsonId]
        [BsonElement("_id")]
        public string Id { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public List<string> ChatroomIds { get; set; }
    }
}
