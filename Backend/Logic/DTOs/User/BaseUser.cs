/*
 * BaseUser.cs
 * -------------
 * Defines the base user class
 * This file contains the data for the base user
 * ---------------------------------------------------------
 * Author: Mr. Roland Fehr
 * Last modified: 28.10.2023
 * Version: 1.0
*/


namespace Logic.DTOs.User
{
    /// <summary>
    ///   This abstract class contains data for the base user
    /// </summary>
    public abstract class BaseUser
    {
        public string Username { get; set; }
        public string Password { get; set; }
    }
}
