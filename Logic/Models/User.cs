﻿namespace Logic.Models
{
    public class User
    {
        public string Id { get; set; } // GUID possibly
        public string Username { get; set; }
        public string Password { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public List<string> ChatroomIds { get; set; }
    }
}
