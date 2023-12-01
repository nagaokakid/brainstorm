/*
* UserNotFound.cs
* -------------
* This file contains the UserNotFound exception.
* ---------------------------------------------------------
* Author: Mr. Roland Fehr
* Last modified: 28.10.2023
* Version: 1.0
*/

namespace Logic.Exceptions
{
    /// <summary>
    ///   This class represents the exception for when a user is not found
    /// </summary>
    public class UserNotFound : Exception
    {
        public UserNotFound() : base("User not found")
        {

        }
    }
}
