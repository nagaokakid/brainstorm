namespace Logic.Exceptions
{
    public class UsernameExists: Exception
    {
        public UsernameExists() : base("Username already exists") 
        { 
        }
    }
}
