using Logic.Data;
using Logic.DTOs.ChatRoom;
using System.Diagnostics;

namespace Logic.Helpers
{
    public static class BrainstormSessionHelper
    {
        public static BrainstormDTO ToDTO(this BrainstormSession session)
        {
            if (session == null) throw new ArgumentNullException($"{nameof(session)} is null");

            return new BrainstormDTO
            {
                SessionId = session.SessionId,
                Title = session.Title,
                Description = session.Description,
                Creator = session.Creator,
                Members = session.JoinedMembers,
            };
        }
    }
}
