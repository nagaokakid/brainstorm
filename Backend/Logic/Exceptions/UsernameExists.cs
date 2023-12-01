/*
 * UsernameExists.cs
 * -------------------------
 * This file contains the exception for when a username already exists
 * ---------------------------------------------------------
 * Author: Mr. Roland Fehr
 * Last modified: 28.10.2023
 * Version: 1.0
*/

namespace Logic.Exceptions
{
    /// <summary>
    ///  This class represents the exception for when a username already exists
    /// </summary>
    public class UsernameExists : Exception
    {
        public UsernameExists() : base("Username already exists")
        {
        }
    }
}
