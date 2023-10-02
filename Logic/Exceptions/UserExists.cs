namespace Logic.Exceptions
{
    public class UserExists: Exception
    {
        public UserExists() : base("Username already exists") 
        { 
        }
    }
}
