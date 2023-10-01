using Logic.DTOs.User;
using Logic.Exceptions;
using Logic.Models;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Logic.Services
{
    // This class takes care of registering, signing in, and signing out a user
    public class AuthService
    {
        private readonly DatabaseService databaseService;
        private readonly IConfiguration config;

        public AuthService(DatabaseService databaseService, IConfiguration config)
        {
            this.databaseService = databaseService;

            // configuration settings for the api
            this.config = config;
        }

        public async Task<RegisterUserResponse> RegisterUser(RegisterUserRequest registerUser)
        {
            // make sure username does not exist
            var exists = databaseService.DoesUserExist(registerUser.Username);
            if (exists) throw new UserExists();

            // create user
            var newUser = await databaseService.CreateUser(registerUser);

            if (newUser != null)
            {
                // return registered user
                return new RegisterUserResponse
                {
                    Id = newUser.Id,
                    Name = newUser.FirstName,
                    Token = CreateToken(newUser),
                };
            }

            throw new Exception("Server error");
        }

        // creates the jwt bearer token
        private string CreateToken(User newUser)
        {
            // create jwt token
            var symmetricKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config.GetValue<string>("JwtSettings:Key")));
            var signedCredential = new SigningCredentials(symmetricKey, SecurityAlgorithms.HmacSha512);

            var claims = new List<Claim>
            {
                  new Claim(JwtRegisteredClaimNames.Sub, newUser.Id),
                  new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            };

            var securityToken = new JwtSecurityToken(
                issuer: config.GetValue<string>("JwtSettings:Issuer"),
                audience: config.GetValue<string>("JwtSettings:Audience"),
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(Convert.ToInt32(config.GetValue<string>("JwtSettings:DurationInMin"))),
                signingCredentials: signedCredential
                );

            return new JwtSecurityTokenHandler().WriteToken(securityToken);
        }
    }
}
