/*
 * UnauthorizedUser.cs
 * -------------------------
 * This file contains the exception for when a user is not authorized
 * ---------------------------------------------------------
 * Author: Mr. Roland Fehr
 * Last modified: 28.10.2023
 * Version: 1.0
*/

namespace Logic.Exceptions
{
    /// <summary>
    ///   This class represents the exception for when a user is not authorized
    /// </summary>
    public class UnauthorizedUser : Exception
    {
        public UnauthorizedUser() : base("Incorrect username or password")
        {

        }
    }
}
