﻿namespace Logic.DTOs.User
{
    public class RegisterLoginResponse
    {
        public string UserId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Token { get; set; }
        public List<Models.ChatRoom> ChatRooms { get; set; }
    }
}
