/*
 * UserHelper.cs
 * --------------
 * This file contains the UserHelper class to contain methods to create a User object from a RegisterUserRequest object and to create a FriendlyUserInfo object from a User object.
 * -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
 * Authors: Mr. Roland Fehr annd Mr Akira Cooper
 * Last modified: 28.10.2023
 * Version: 1.0
*/

using Database.Data;
using Logic.DTOs.User;

namespace Logic.Helpers
{
    /// <summary>
    ///   This static class contains methods to create a User object from a RegisterUserRequest object and to create a FriendlyUserInfo object from a User object.
    /// </summary>
    public static class UserHelper
    {
        /// <summary>
        ///   This static method creates a User object from a RegisterUserRequest object.
        /// </summary>
        /// <param name="request">The RegisterUserRequest object to create the User object from.</param>
        /// <returns>The created User object.</returns>
        public static User CreateUser(this RegisterUserRequest request)
        {
            return new User
            {
                Id = Guid.NewGuid().ToString(),
                Username = request.Username,
                Password = request.Password,
                FirstName = request.FirstName,
                LastName = request.LastName,
                ChatroomIds = new List<string>(),
                DirectMessageHistoryIds = new List<string>(),
                BrainstormResultIds = new List<string>()
            };
        }

        /// <summary>
        ///   This static method creates a FriendlyUserInfo object from a User object.
        /// </summary>
        /// <param name="user">The User object to create the FriendlyUserInfo object from.</param>
        /// <returns>The created FriendlyUserInfo object.</returns>
        public static FriendlyUserInfo ToFriendlyUser(this User user)
        {
            return new FriendlyUserInfo
            {
                UserId = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
            };
        }
    }
}
