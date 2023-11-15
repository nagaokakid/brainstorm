using MongoDB.Bson.Serialization.Attributes;

namespace Database.Data
{
    public class User
    {
        [BsonId]
        [BsonElement("_id")]
        public string Id { get; set; }

        [BsonElement("Username")]
        public string Username { get; set; }

        [BsonElement("Password")]
        public string Password { get; set; }

        [BsonElement("FirstName")]
        public string FirstName { get; set; }

        [BsonElement("LastName")]
        public string LastName { get; set; }

        [BsonElement("ChatroomIds")]
        public List<string> ChatroomIds { get; set; }

        [BsonElement("DirectMessageHistoryIds")]
        public List<string> DirectMessageHistoryIds {  get; set; }

        [BsonElement("BrainstormResultIds")]
        public List<string> BrainstormResultIds { get; set; }
    }
}
