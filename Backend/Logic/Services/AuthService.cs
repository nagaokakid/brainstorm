/*
 * AuthService.cs
 * --------------
 * Represents a AuthService object from the database.
 * This file contains the data for the AuthService.
 * ---------------------------------------------------------
 * Author: Mr. Roland Fehr
 * Last modified: 28.10.2023
 * Version: 1.0
*/

using Database.CollectionContracts;
using Database.Data;
using Logic.Converters;
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
    /// <summary>
    ///   This class takes care of registering, signing in, and signing out a user
    /// </summary>
    public class AuthService
    {
        private readonly IUserCollection userCollection;
        private readonly IChatRoomCollection chatRoomCollection;
        private readonly IDirectMessageCollection directMessageCollection;
        private readonly IConfiguration config;
        private readonly UserService userService;

        /// <summary>
        ///  Constructor for AuthService
        /// </summary>
        /// <param name="userCollection"></param>
        /// <param name="chatRoomCollection"></param>
        /// <param name="directMessageCollection"></param>
        /// <param name="config"></param>
        /// <param name="userService"></param>
        public AuthService(IUserCollection userCollection, IChatRoomCollection chatRoomCollection, IDirectMessageCollection directMessageCollection, IConfiguration config, UserService userService)
        {
            this.userCollection = userCollection;
            this.chatRoomCollection = chatRoomCollection;
            this.directMessageCollection = directMessageCollection;

            // configuration settings for the api
            this.config = config;
            this.userService = userService;
        }

        /// <summary>
        ///   This method registers a user
        /// </summary>
        /// <param name="registerUser">The user to register</param>
        /// <returns>The registered user</returns>
        public async Task<RegisterLoginResponse> RegisterUser(RegisterUserRequest registerUser)
        {
            // make sure input is not null or empty
            if (registerUser == null || string.IsNullOrEmpty(registerUser.Username) || string.IsNullOrEmpty(registerUser.Password) || string.IsNullOrEmpty(registerUser.FirstName) || string.IsNullOrEmpty(registerUser.LastName))
                throw new BadRequest();

            var user = await userService.CreateUser(registerUser);

            // return registered user
            return new RegisterLoginResponse
            {
                UserInfo = user,
                Token = CreateToken(user),
            };
        }

        /// <summary>
        ///   This method creates a jwt bearer token
        /// </summary>
        /// <param name="newUser"></param>
        /// <returns> The jwt bearer token</returns>
        private string CreateToken(FriendlyUserInfo newUser)
        {
            // create jwt token
            var symmetricKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config.GetValue<string>("JwtSettings:Key")));
            var signedCredential = new SigningCredentials(symmetricKey, SecurityAlgorithms.HmacSha512);

            var claims = new List<Claim>
            {
                  new Claim(JwtRegisteredClaimNames.Sub, newUser.UserId),
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

        /// <summary>   
        ///   This method logs in a user
        /// </summary>
        /// <param name="loginRequest">The user to login</param>
        /// <returns>The logged in user</returns>
        public async Task<RegisterLoginResponse> LoginUser(LoginUserRequest loginRequest)
        {
            // make sure the request is not null or empty
            if (loginRequest == null || string.IsNullOrEmpty(loginRequest.Username) || string.IsNullOrEmpty(loginRequest.Password))
            {
                throw new UnauthorizedUser();
            }

            // verify username and password
            var user = await userCollection.Get(loginRequest.Username, loginRequest.Password) ?? throw new UnauthorizedUser();
            var friendly = new FriendlyUserInfo
            {
                UserId = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
            };

            // get list of users so that we don't need to go to db everytime
            var users = await userCollection.GetAll();

            // return logged in user
            return new RegisterLoginResponse
            {
                UserInfo = friendly,
                Token = CreateToken(friendly),
                ChatRooms = await GetFriendlyChatRooms(user.ChatroomIds, users),
                DirectMessages = await GetDirectMessages(user.Id, users)
            };
        }

        /// <summary>
        ///   This method logs out a user
        /// </summary>
        /// <param name="userId">The user to logout</param>
        /// <returns>The logged out user</returns>
        private async Task<List<FriendlyDirectMessageHistory>> GetDirectMessages(string userId, Dictionary<string, User> users)
        {
            var hist = await directMessageCollection.GetAll(userId);
            if (hist != null)
            {
                return hist.ToDTO(users);
            }
            return new List<FriendlyDirectMessageHistory>();
        }

        /// <summary>
        ///  This method gets a list of friendly chatrooms
        ///  Friendly means that the user ids can be replaced with the user info
        ///  </summary>
        ///  <param name="chatRoomIds">The chatroom ids to get</param>
        ///  <param name="users">The users to convert</param>
        ///  <returns>The list of friendly chatrooms</returns>
        public async Task<List<FriendlyChatRoom>> GetFriendlyChatRooms(List<string> chatRoomIds, Dictionary<string, User> users)
        {
            var result = new List<FriendlyChatRoom>();

            // get friendly chatroom for each chatRoomId
            foreach (var room in chatRoomIds)
            {
                var found = await chatRoomCollection.GetById(room) ?? throw new ChatRoomNotFound();
                result.Add(new FriendlyChatRoom
                {
                    Id = found.Id,
                    Title = found.Title,
                    Description = found.Description,
                    Messages = found.Messages.Select(x => new MessageInfo
                    {
                        MessageId = x.ChatRoomMessageId,
                        ChatRoomId = found.Id,
                        Message = x.Message,
                        Timestamp = x.Timestamp,
                        FromUserInfo = x.FromUserId.ToFriendlyUserInfo(users),
                    }).ToList(),
                    JoinCode = found.JoinCode,
                    Members = found.MemberIds.ToFriendlyUserInfo(users),
                });
            }

            return result;
        }

        public async Task DeleteUser(string id)
        {
            if(id == null) throw new ArgumentNullException(nameof(id));

            // get user first
            var result = await userCollection.Get(id);
            if(result != null)
            {
                // remove user from all chats first
                foreach (var chatId in result.ChatroomIds)
                {
                    await chatRoomCollection.RemoveUser(id, chatId);
                }

            }
            
            // delete user
            await userCollection.DeleteUser(id);

        }

        public async Task EditUser(EditUserRequest editUserRequest)
        {
            // validate edit request
            if (editUserRequest == null || editUserRequest.UserId == null || editUserRequest.FirstName == null || editUserRequest.Username == null || editUserRequest.Password == null) throw new ArgumentNullException();

            // get existing user from DB
            var existingUser = await userCollection.Get(editUserRequest.UserId);
            
            // try to edit user if found
            if(existingUser != null)
            {
                existingUser.FirstName = editUserRequest.FirstName;
                existingUser.LastName = editUserRequest.LastName;
                existingUser.Username = editUserRequest.Username;
                existingUser.Password = editUserRequest.Password;

                // save modified user
                await userCollection.Edit(existingUser);
            }
            else
            {
                throw new BadRequest();
            }

        }
    }
}
