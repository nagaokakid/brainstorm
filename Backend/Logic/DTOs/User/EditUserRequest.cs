namespace Logic.DTOs.User
{
    public class EditUserRequest: BaseUser
    {
        public string UserId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
    }
}
