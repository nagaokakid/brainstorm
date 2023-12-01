/*
 * BrainstormSessionHelper.cs
 * -------------------------
 * This file contains the BrainstormSessionHelper class.
 * ---------------------------------------------------------
 * Author: Mr. Roland Fehr
 * Last modified: 28.10.2023
 * Version: 1.0
*/

using Logic.Data;
using Logic.DTOs.ChatRoom;
using System.Diagnostics;

namespace Logic.Helpers
{
    /// <summary>
    ///    This static class contains helper methods for the BrainstormSession
    /// </summary>
    public static class BrainstormSessionHelper
    {
        /// <summary>
        ///    This static method converts a BrainstormSession to a BrainstormDTO
        /// </summary>
        /// <param name="session">The BrainstormSession to convert</param>
        /// <exception cref="ArgumentNullException">Thrown when the session is null</exception>
        /// <returns>The converted BrainstormDTO</returns>
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
