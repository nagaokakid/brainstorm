using Database.CollectionContracts;
using Logic.DTOs.Messages;
using Logic.Helpers;

namespace Logic.Services
{
    public class DirectMessageService
    {
        private readonly IDirectMessageCollection directMessageCollection;
        private readonly IUserCollection userCollection;

        public DirectMessageService(IDirectMessageCollection directMessageCollection, IUserCollection userCollection)
        {
            this.directMessageCollection = directMessageCollection;
            this.userCollection = userCollection;
        }
        public async Task AddNewMessage(MessageInfo msg)
        {
            await directMessageCollection.Add(msg.FromDTO());
        }

        public async Task<List<MessageInfo>> GetMessagesByUserId(string fromId, string toId)
        {
            var result = await directMessageCollection.Get(fromId, toId);
            if(result == null) return new List<MessageInfo>();

            return result.ToDTO(await userCollection.GetAll());
        }
    }
}
