using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;

namespace Database.Data
{
    public class DirectMessageHistory
    {
        [BsonId]
        [BsonElement("_id")]
        public string Id { get; set; }
        public string UserId1 { get; set; }
        public string UserId2 { get; set; }
        public List<DirectMessage> DirectMessages { get; set; }
    }
}
