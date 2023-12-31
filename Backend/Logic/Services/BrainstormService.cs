﻿/*
 * BrainstormService.cs 
 * -------------------------
 * Represents a BrainstormService object from the database.
 * This file contains the data for the BrainstormService.
 * ---------------------------------------------------------
 * Author: Mr.Roland Fehr & Mr. Akira Cooper
 * Last modified: 28.10.2023
 * Version: 1.0
*/

using Database.CollectionContracts;
using Database.Data;
using Logic.Data;
using Logic.DTOs.User;
using Logic.Hubs;
using Microsoft.AspNetCore.SignalR;
using System.Collections.Concurrent;
using System.Diagnostics;

/// <summary>
///    This interface contains the methods for the BrainstormService
/// </summary>
public interface IBrainstormService
{
    Task Add(BrainstormSession session);
    Task AddIdeas(string sessionId, List<string> ideas);
    Task AddVotes(string sessionId, List<Idea> ideas);
    Task EndSession(string sessionId);
    Task<List<Idea>> GetAllIdeas(string sessionId);
    Task<BrainstormSession?> GetSession(string sessionId);
    Task Join(string sessionId, FriendlyUserInfo user);
    Task<List<Idea>> VoteAnotherRound(string sessionId);
    Task RemoveSession(string sessionId);
    Task SendAllIdeasTimer(string sessionId, Action<string, List<Idea>>? callback);
    Task SendVotesTimer(string sessionId, Action<string, List<Idea>>? callback);
    Task StartSession(string sessionId);
    Task RemoveUserFromSession(string sessionId, string userId);
}
namespace Logic.Services
{
    /// <summary>
    /// This class extends IBrainstormService interface and implements the methods
    /// </summary>
    public class BrainstormService : IBrainstormService
    {
        ConcurrentDictionary<string, BrainstormSession> sessions = new();
        private readonly IBrainstormResultCollection brainstormResultCollection;
        private readonly IHubContext<ChatRoomHub> chatRoomHubContext;

        /// <summary>
        ///   Constructor for BrainstormService
        /// </summary>
        /// <param name="brainstormResultCollection"></param>
        /// <param name="chatRoomHubContext"></param>
        public BrainstormService(IBrainstormResultCollection brainstormResultCollection, IHubContext<ChatRoomHub> chatRoomHubContext)
        {
            this.brainstormResultCollection = brainstormResultCollection;
            this.chatRoomHubContext = chatRoomHubContext;
        }

        /// <summary>
        ///  Adds a new BrainstormSession to the database
        /// </summary>
        /// <param name="session"></param>
        public async Task Add(BrainstormSession session)
        {
            Debug.Assert(session != null);

            sessions.TryAdd(session.SessionId, session);
        }

        /// <summary>
        ///   Join a friendly user to a session
        /// </summary>
        /// <param name="sessionId"></param>
        /// <param name="user"></param>
        public async Task Join(string sessionId, FriendlyUserInfo user)
        {
            Debug.Assert(sessionId != null);
            Debug.Assert(user != null);

            sessions.TryGetValue(sessionId, out var session);
            if (session != null && session.CanJoin) session.JoinedMembers.Add(user);
        }

        /// <summary>
        ///  This method is called to start a session for a brainstorm session
        /// </summary>
        /// <param name="sessionId"></param>
        public async Task StartSession(string sessionId)
        {
            Debug.Assert(sessionId != null);

            sessions.TryGetValue(sessionId, out var session);
            if (session != null) session.CanJoin = false;
        }

        /// <summary>
        ///  This method returns a BrainstormSession object from the database
        /// </summary>
        /// <param name="sessionId"> sessionId of the BrainstormSession object</param>
        public async Task<BrainstormSession?> GetSession(string sessionId)
        {
            Debug.Assert(sessionId != null);

            sessions.TryGetValue(sessionId, out var session);
            return session;
        }

        /// <summary>
        /// This method adds ideas to a BrainstormSession object
        /// </summary>
        /// <param name="sessionId">sessionId of the BrainstormSession object</param>
        /// <param name="ideas">ideas to add to the BrainstormSession object</param>
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

        /// <summary>
        /// This method returns all ideas from a BrainstormSession object
        /// </summary>
        /// <param name="sessionId"></param>
        public async Task<List<Idea>> GetAllIdeas(string sessionId)
        {
            Debug.Assert(sessionId != null);

            var result = await this.GetSession(sessionId);
            return result != null ? result.Ideas.Values.ToList() : new List<Idea>();
        }

        /// <summary>
        ///   RemoveSession removes a brainstorm session.
        /// </summary>
        /// <param name="sessionId"></param>
        public async Task RemoveSession(string sessionId)
        {
            Debug.Assert(sessionId != null);
            sessions.TryRemove(sessionId, out var session);
        }

        /// <summary>
        ///  EndSession method ends a brainstorm session.
        /// </summary>
        /// <param name="sessionId"></param>
        public async Task EndSession(string sessionId)
        {
            Debug.Assert(sessionId != null);

            var result = await GetSession(sessionId);

            // when session ends, users have x seconds to send all their ideas. Because after x seconds the results are sent to the users
            if (result != null) result.IdeasAvailable = DateTime.Now.AddSeconds(1);
        }

        /// <summary>
        /// AddVotes method adds votes to a brainstorm session.
        /// </summary>
        /// <param name="sessionId"></param>
        /// <param name="ideas"></param>
        public async Task AddVotes(string sessionId, List<Idea> ideas)
        {
            if (sessionId != null && ideas != null)
            {
                var result = await GetSession(sessionId);
                if (result != null)
                {
                    foreach (var i in ideas)
                    {
                        if (result.Ideas.TryGetValue(i.Id, out Idea? idea))
                        {
                            idea.Likes += i.Likes;
                            idea.Dislikes += i.Dislikes;
                        }
                    }
                }
            }
        }

        /// <summary>
        ///   SendVotesTimer method sends votes to a brainstorm session.
        /// </summary>
        /// <param name="sessionId"></param>
        /// <param name="callback"></param>
        public async Task SendVotesTimer(string sessionId, Action<string, List<Idea>>? callback)
        {
            if (callback != null)
            {
                (await GetSession(sessionId))?.SetVoteTimer(callback);
            }
            else
            {
                (await GetSession(sessionId))?.SetVoteTimer(SendAllVotes);
            }
        }

        /// <summary>
        ///  This method sends all ideas to a brainstorm session with a callback.
        /// </summary>
        /// <param name="sessionId"></param>
        /// <param name="callback"></param>
        public async Task SendAllIdeasTimer(string sessionId, Action<string, List<Idea>>? callback)
        {
            if (callback != null)
            {
                (await GetSession(sessionId))?.SetAllIdeasTimer(callback);
            }
            else
            {
                (await GetSession(sessionId))?.SetAllIdeasTimer(SendAllIdeas);
            }
        }

        /// <summary>
        ///   This method sends all ideas to a brainstorm session.
        /// </summary>
        /// <param name="sessionId"></param>
        /// <param name="ideas"></param>
        private void SendAllIdeas(string sessionId, List<Idea> ideas)
        {
            this.chatRoomHubContext.Clients.Groups(sessionId).SendAsync("ReceiveAllIdeas", sessionId, ideas);
        }

        /// <summary>
        ///     This method sends all votes to a brainstorm session.
        /// </summary>
        /// <param name="sessionId"></param>
        /// <param name="votes"></param>
        private void SendAllVotes(string sessionId, List<Idea> votes)
        {
            FilterIdeas(sessionId).Wait();
            var result = GetSession(sessionId).Result;
            this.chatRoomHubContext.Clients.Group(sessionId).SendAsync("ReceiveVoteResults", sessionId, result.Ideas.Select(x => x.Value).ToList());
        }

        /// <summary>
        ///   This method adds a final result in a brainstorm session.
        /// </summary>
        /// <param name="brainstormResult"></param>
        /// <returns></returns>
        public async Task AddFinalResult(BrainstormResult brainstormResult)
        {
            brainstormResultCollection.Add(brainstormResult);
        }

        /// <summary>
        ///  This method filters ideas in a brainstorm session.
        /// </summary>
        /// <param name="sessionId"></param>
        private async Task FilterIdeas(string sessionId)
        {
            var result = await GetSession(sessionId);
            if (result != null)
            {
                var filtered = result.Ideas.Where(x => x.Value?.Likes > x.Value?.Dislikes)?.Select(x => x.Value).ToList();
                if (filtered != null)
                {
                    // create dictionary and replace in session
                    Dictionary<string, Idea> newDict = new();
                    foreach (var i in filtered)
                    {
                        newDict[i.Id] = i;
                    }

                    // replace ideas
                    result.Ideas = newDict;
                }
            }
        }

        /// <summary>
        /// This method votes another round in a brainstorm session.
        /// </summary>
        /// <param name="sessionId"></param>
        public async Task<List<Idea>> VoteAnotherRound(string sessionId)
        {
            if (!string.IsNullOrEmpty(sessionId))
            {
                var result = await GetSession(sessionId);
                if (result != null)
                {
                    // set all votes to zero to vote again
                    foreach (var idea in result.Ideas.Values)
                    {
                        idea.Dislikes = 0;
                        idea.Likes = 0;
                    }

                    return result.Ideas.Values.ToList();
                }
            }
            return new List<Idea>();
        }

        /// <summary>
        /// This method removes a user from a brainstorm session.
        /// </summary>
        /// <param name="sessionId"></param>
        /// <param name="userId"></param>
        public async Task RemoveUserFromSession(string sessionId, string userId)
        {
            var result = await GetSession(sessionId);
            if (result != null)
            {
                int index = result.JoinedMembers.FindIndex(x => x.UserId == userId);
                result.JoinedMembers.RemoveAt(index);
            }
        }
    }
}
