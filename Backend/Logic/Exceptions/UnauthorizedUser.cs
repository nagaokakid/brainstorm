namespace Logic.Exceptions
{
    public class UnauthorizedUser: Exception
    {
        public UnauthorizedUser() : base("Incorrect username or password")
        {
            
        }
    }
}
