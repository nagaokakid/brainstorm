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
    Task AddVotes(string sessionId, List<Idea> ideas);
    Task EndSession(string sessionId);
    Task<List<Idea>> GetAllIdeas(string sessionId);
    Task<BrainstormSession?> GetSession(string sessionId);
    Task Join(string sessionId, FriendlyUserInfo user);
    Task RemoveSession(string sessionId);
    Task SendVotesTimer(string sessionId, Action<string> callback);
    Task StartSession(string sessionId);
}
namespace Logic.Services
{
    public class BrainstormService : IBrainstormService
    {
        ConcurrentDictionary<string, BrainstormSession> sessions = new ();
        private readonly IBrainstormResultCollection brainstormResultCollection;

        public BrainstormService(IBrainstormResultCollection brainstormResultCollection)
        {
            this.brainstormResultCollection = brainstormResultCollection;
        }
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

            if (sessions.TryGetValue(sessionId, out var session) && DateTime.Now <= session.IdeasAvailable)
            {
                var newIdeas = ideas.Select(x => new Idea
                {
                    Id = Guid.NewGuid().ToString(),
                    Thought = x,
                    Likes = 0,
                    Dislikes = 0,
                });
                foreach (var i in newIdeas)
                {
                    session.Ideas.Add(i.Id, i);
                }
            }
        }

        public async Task<List<Idea>> GetAllIdeas(string sessionId)
        {
            Debug.Assert(sessionId != null);

            var result = await this.GetSession(sessionId);
            return result != null ? result.Ideas.Values.ToList() : new List<Idea>();
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

            // when session ends, users have x seconds to send all their ideas. Because after x seconds the results are sent to the users
            if (result != null) result.IdeasAvailable = DateTime.Now.AddSeconds(1);
        }

        public async Task AddVotes(string sessionId, List<Idea> ideas)
        {
            var result = await GetSession(sessionId);
            if (result != null)
            {
                foreach (var i in ideas)
                {
                    if (result.Ideas.TryGetValue(i.Id, out Idea idea))
                    {
                        idea.Likes += i.Likes;
                        idea.Dislikes += i.Dislikes;
                    }
                }
            }
        }

        public async Task SendVotesTimer(string sessionId, Action<string> callback)
        {
            var session = await GetSession(sessionId);
            if (session != null)
            {
                session.SendVoteTimer = new Timer((obj) =>
                {
                    callback(sessionId);
                    Timer timer = (Timer)obj;
                    timer.Change(Timeout.Infinite, Timeout.Infinite);
                    timer.Dispose();
                }, null, 2000, Timeout.Infinite);
            }
        }

        public async Task AddFinalResult(BrainstormResult brainstormResult)
        {
            brainstormResultCollection.Add(brainstormResult);
        }
    }
}
