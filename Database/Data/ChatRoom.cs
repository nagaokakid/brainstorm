﻿namespace Database.Data
{
    public class ChatRoom
    {
        public string Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public int JoinCode { get; set; }
        public List<ChatRoomMessage> Messages { get; set; }
        public List<string> MemberIds { get; set; }
    }
}