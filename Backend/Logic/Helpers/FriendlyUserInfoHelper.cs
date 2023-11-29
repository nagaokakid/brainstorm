/*
 * FriendlyUserInfoHelper.cs
 * -------------------------
 * This file contains the FriendlyUserInfoHelper.
 * ---------------------------------------------------------
 * Author: Mr. Roland Fehr
 * Last modified: 28.10.2023
 * Version: 1.0
*/

using Database.Data;
using Logic.DTOs.User;

namespace Logic.Helpers
{
    /// <summary>
    ///     This static class contains the FriendlyUserInfoHelper
    /// </summary>
    public static class FriendlyUserInfoHelper
    {
        /// <summary>
        ///    This static method converts a User object to a FriendlyUserInfo object
        /// </summary>
        /// <param name="memberId"></param>
        /// <param name="users"></param>
        /// <returns> The converted FriendlyUserInfo object</returns>
        public static FriendlyUserInfo ToFriendlyUserInfo(this string memberId, Dictionary<string, User>? users)
        {
            if (string.IsNullOrEmpty(memberId)) throw new ArgumentNullException($"{nameof(memberId)} cannot be null");
            if (users != null && users.Any() && users.TryGetValue(memberId, out var user))
            {
                return user.ToFriendlyUser();
            }

            return new FriendlyUserInfo { UserId = memberId };
        }

        /// <summary>
        ///   This static method converts a List of User objects to a List of FriendlyUserInfo objects
        /// </summary>
        /// <param name="memberIds"></param>
        /// <param name="users"></param>
        /// <returns> The converted List of FriendlyUserInfo objects</returns>
        public static List<FriendlyUserInfo> ToFriendlyUserInfo(this List<string>? memberIds, Dictionary<string, User>? users)
        {
            if (memberIds != null && memberIds.Any())
            {
                return memberIds.Select(x => x.ToFriendlyUserInfo(users)).ToList();
            }
            return new List<FriendlyUserInfo>();
        }
    }
}
