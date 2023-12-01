/**
 *  BrainstormSession.cs
 *  --------------------
 *  Represents a BrainstormSession object from the database.
 *  This file contains the data for the brainstorm session.
 *  ---------------------------------------------------------
 *  Author: Mr. Roland Fehr
 *  Last modified: 28.10.2023
 *  Version: 1.0
*/

using Logic.DTOs.User;

namespace Logic.Data
{
    /// <summary>
    ///   This class contains data for the brainstorm session.
    /// </summary>
    public class BrainstormSession
    {
        private const int VOTE_TIMER = 1000;
        private const int IDEA_TIMER = 1000;
        public string SessionId { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string ChatRoomId { get; set; }
        public int TimerSeconds { get; set; }
        public FriendlyUserInfo Creator { get; set; }
        public bool CanJoin { get; set; } = true;
        public List<FriendlyUserInfo> JoinedMembers { get; set; }
        public Dictionary<string, Idea> Ideas { get; set; }
        public DateTime IdeasAvailable { get; set; }


        public Timer? SendVoteTimer { get; set; }
        public Timer? SendAllIdeasTimer { get; set; }

        /// <summary>
        ///     Sets the timer for sending the votes to the clients.
        /// </summary>
        /// <param name="action"></param>
        public void SetVoteTimer(Action<string, List<Idea>> action)
        {
            this.SendVoteTimer = new Timer((obj) =>
            {
                action(this.SessionId, this.Ideas.Values.ToList());
            }, null, VOTE_TIMER, Timeout.Infinite);
        }

        /// <summary>
        ///    Sets the timer for sending all ideas to the clients.
        /// </summary>
        /// <param name="action"></param>
        public void SetAllIdeasTimer(Action<string, List<Idea>> action)
        {
            this.SendAllIdeasTimer = new Timer((obj) =>
            {
                action(this.SessionId, this.Ideas.Values.ToList());
            }, null, IDEA_TIMER, Timeout.Infinite);
        }
    }
}
