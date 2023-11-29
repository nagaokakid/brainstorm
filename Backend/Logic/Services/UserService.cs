/*
 * UserService.cs
 * -------------------------
 * Represents a UserService object from the database.
 * This file contains the data for the UserService.
 * ---------------------------------------------------------
 * Author: Mr. Roland Fehr
 * Last modified: 28.10.2023
 * Version: 1.0
*/

using Database.CollectionContracts;
using Logic.DTOs.User;
using Logic.Exceptions;
using Logic.Helpers;

namespace Logic.Services
{
    /// <summary>
    ///   This class contains the data for the UserService.
    /// </summary>
    public class UserService
    {
        private readonly IUserCollection userCollection;

        /// <summary>
        ///  Constructor for the UserService
        /// </summary>
        /// <param name="userCollection"></param>
        public UserService(IUserCollection userCollection)
        {
            this.userCollection = userCollection;
        }

        /// <summary>
        ///   This method registers a user
        /// </summary>
        /// <param name="registerUser">The user to register</param>
        public async Task<FriendlyUserInfo> CreateUser(RegisterUserRequest registerUser)
        {
            // make sure username does not exist
            var exists = await userCollection.DoesUsernameExist(registerUser.Username);
            if (exists) throw new UsernameExists();

            // create user
            var newUser = registerUser.CreateUser();
            await userCollection.Add(newUser);

            return newUser.ToFriendlyUser();
        }
    }
}
