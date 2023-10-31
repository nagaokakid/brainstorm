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
            var returnId = await directMessageCollection.Add(msg.FromUserInfo.UserId, msg.ToUserInfo.UserId, msg.FromDTO());
            if (returnId != null) // new direct message history was created in db; add ID to users
            {
                await userCollection.AddDirectMessageHistoryToUser(msg.FromUserInfo.UserId, returnId);
                await userCollection.AddDirectMessageHistoryToUser(msg.ToUserInfo.UserId, returnId);
            }
        }

        public async Task<FriendlyDirectMessageHistory?> GetMessagesByUserId(string userId1, string userId2)
        {
            if (userId1 == null) throw new ArgumentNullException($"{nameof(userId1)} parameter is null");
            if (userId2 == null) throw new ArgumentNullException($"{nameof(userId2)} parameter is null");
            
            var result = await directMessageCollection.Get(userId1, userId2);
            if(result == null) return null;
            return result.ToDTO(await userCollection.GetAll());
        }
    }
}
