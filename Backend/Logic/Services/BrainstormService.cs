using Database.CollectionContracts;
using Database.Data;
using Logic.Data;
using Logic.DTOs.User;
using System.Collections.Concurrent;
using System.Diagnostics;
public interface IBrainstormService
{
    Task Add(BrainstormSession session);
    Task AddIdeas(string sessionId, List<string> ideas);
    Task EndSession(string sessionId);
    Task<List<string>> GetAllIdeas(string sessionId);
    Task<BrainstormSession?> GetSession(string sessionId);
    Task Join(string sessionId, FriendlyUserInfo user);
    Task RemoveSession(string sessionId);
    Task StartSession(string sessionId);
}
namespace Logic.Services
{
    public class BrainstormService : IBrainstormService
    {
<<<<<<< HEAD
        ConcurrentDictionary<string, BrainstormSession> sessions = new ();
        private readonly IBrainstormResultCollection brainstormResultCollection;

        public BrainstormService(IBrainstormResultCollection collection)
        {
            brainstormResultCollection = collection;
        }
=======
        ConcurrentDictionary<string, BrainstormSession> sessions = new();
>>>>>>> origin/dev

        public async Task Add(BrainstormSession session)
        {
            Debug.Assert(session != null);

            sessions.TryAdd(session.SessionId, session);
        }

        public async Task Join(string sessionId, FriendlyUserInfo user)
        {
            Debug.Assert(sessionId != null);
            Debug.Assert(user != null);

            sessions.TryGetValue(sessionId, out var session);
            if (session != null && session.CanJoin) session.JoinedMembers.Add(user);
        }

        public async Task StartSession(string sessionId)
        {
            Debug.Assert(sessionId != null);

            sessions.TryGetValue(sessionId, out var session);
            if (session != null) session.CanJoin = false;
        }

        public async Task<BrainstormSession?> GetSession(string sessionId)
        {
            Debug.Assert(sessionId != null);

            sessions.TryGetValue(sessionId, out var session);
            return session;
        }

        public async Task AddIdeas(string sessionId, List<string> ideas)
        {
            Debug.Assert(ideas != null);
            Debug.Assert(sessionId != null);

            sessions.TryGetValue(sessionId, out var session);
            if (session != null && DateTime.Now <= session.IdeasAvailable)
            {
                session.Ideas.AddRange(ideas);
            }
        }

        public async Task<List<string>> GetAllIdeas(string sessionId)
        {
            Debug.Assert(sessionId != null);

            var result = await this.GetSession(sessionId);
            return result != null ? result.Ideas : new List<string>();
        }

        public async Task RemoveSession(string sessionId)
        {
            Debug.Assert(sessionId != null);
            sessions.TryRemove(sessionId, out var session);
        }

        public async Task EndSession(string sessionId)
        {
            Debug.Assert(sessionId != null);

            var result = await GetSession(sessionId);

            // when session ends, users have 1 second to send all their ideas. Because after 1 second the results are send to the users
            if (result != null) result.IdeasAvailable = DateTime.Now.AddSeconds(1);
        }

        public async Task AddFinalResult(BrainstormResult brainstormResult)
        {
            brainstormResultCollection.Add(brainstormResult);
        }
    }
}
