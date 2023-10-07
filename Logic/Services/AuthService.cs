﻿using Database.CollectionContracts;
using Database.Data;
using Logic.DTOs.ChatRoom;
using Logic.DTOs.Messages;
using Logic.DTOs.User;
using Logic.Exceptions;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Logic.Services
{
    // This class takes care of registering, signing in, and signing out a user
    public class AuthService
    {
        private readonly IUserCollection userCollection;
        private readonly IChatRoomCollection chatRoomCollection;
        private readonly IConfiguration config;
        private readonly UserService userService;

        public AuthService(IUserCollection userCollection, IChatRoomCollection chatRoomCollection, IConfiguration config, UserService userService)
        {
            this.userCollection = userCollection;
            this.chatRoomCollection = chatRoomCollection;

            // configuration settings for the api
            this.config = config;
            this.userService = userService;
        }

        public async Task<RegisterLoginResponse> RegisterUser(RegisterUserRequest registerUser)
        {
            // make sure username does not exist
            var exists = await userCollection.DoesUsernameExist(registerUser.Username);
            if (exists) throw new UserExists();

            // create user
            var newUser = new User
            {
                Id = Guid.NewGuid().ToString(),
                Username = registerUser.Username,
                Password = registerUser.Password,
                FirstName = registerUser.FirstName,
                LastName = registerUser.LastName,
                ChatroomIds = new List<string>()
            };
            await userCollection.Add(newUser);

            // return registered user
            return new RegisterLoginResponse
            {
                UserInfo = new FriendlyUserInfo()
                {
                    UserId = newUser.Id,
                    FirstName = newUser.FirstName,
                    LastName = newUser.LastName,
                },
                Token = CreateToken(newUser),
            };
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

        public async Task<RegisterLoginResponse> LoginUser(LoginUserRequest loginRequest)
        {
            // make sure the request is not null or empty
            if (loginRequest == null || string.IsNullOrEmpty(loginRequest.Username) || string.IsNullOrEmpty(loginRequest.Password))
            {
                throw new UnauthorizedUser();
            }

            // verify username and password
            var user = await userCollection.Get(loginRequest.Username, loginRequest.Password) ?? throw new UnauthorizedUser();

            // return logged in user
            return new RegisterLoginResponse
            {
                UserInfo = new FriendlyUserInfo
                {
                    UserId = user.Id,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                },
                Token = CreateToken(user),
                ChatRooms = await GetFriendlyChatRooms(user.ChatroomIds)
            };
        }

        private async Task<List<FriendlyChatRoom>> GetFriendlyChatRooms(List<string> chatRoomIds)
        {
            var result = new List<FriendlyChatRoom>();
            foreach (var room in chatRoomIds)
            {
                var found = await chatRoomCollection.GetById(room);
                if (found == null) throw new ChatRoomNotFound();

                result.Add(new FriendlyChatRoom
                {
                    Id = found.Id,
                    Title = found.Title,
                    Description = found.Description,
                    Messages = found.Messages.Select(x => new MessageInfo
                    {
                        ChatRoomId = found.Id,
                        Message = x.Message,
                        Timestamp = x.Timestamp,
                        FromUserInfo = userService.GetFriendly(x.FromUserId).Result
                    }).ToList(),
                    JoinCode = found.JoinCode,
                    Members = await userService.GetList(found.MemberIds)
                });
            }

            return result;
        }
    }
}
