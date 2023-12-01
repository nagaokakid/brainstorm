/*
 * RegisterUserRequest.cs
 * -------------------------
 * Represents a RegisterUserRequest object from the database.
 * This file contains the data for the RegisterUserRequest.
 * ---------------------------------------------------------
 * Author: Mr. Roland Fehr
 * Last modified: 28.10.2023
 * Version: 1.0
*/

namespace Logic.DTOs.User
{
    /// <summary>
    ///   This class contains data for the RegisterUserRequest
    /// </summary>
    public class RegisterUserRequest : BaseUser
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
    }
}
