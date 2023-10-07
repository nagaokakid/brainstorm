using Logic.DTOs.Messages;

namespace Logic.Services
{
    public class DirectMessageService
    {
        private List<MessageInfo> messages = new();

        public async Task AddNewMessage(MessageInfo msg)
        {
            messages.Add(msg);
        }

        public async Task<List<MessageInfo>> GetMessagesByUserId(string userId)
        {
            var result = messages.Where(x=> x.ToUserInfo.UserId == userId || x.FromUserInfo.UserId == userId)?.ToList();
            if(result == null) return new List<MessageInfo>();
            return result;
        }
    }
}
