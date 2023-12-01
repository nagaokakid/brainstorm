/*
 * FriendlyDirectMessageHistory.cs
 * -------------------------
 * Represents a FriendlyDirectMessageHistory object from the database.
 * This file contains the data for the FriendlyDirectMessageHistory.
 * ---------------------------------------------------------
 * Author: Mr. Roland Fehr
 * Last modified: 28.10.2023
 * Version: 1.6
*/

using Logic.DTOs.User;
using System.Diagnostics;

namespace Logic.DTOs.Messages
{
    /// <summary>
    ///   This class contains data for the FriendlyDirectMessageHistory
    /// </summary>
    public class FriendlyDirectMessageHistory
    {
        public FriendlyUserInfo User1 { get; set; }
        public FriendlyUserInfo User2 { get; set; }
        public List<DirectMessageInfo> DirectMessages { get; set; }
    }
}
