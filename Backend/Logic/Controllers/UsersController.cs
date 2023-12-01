/*
    Team: DarkArmy
    Author:Roland Fehr
    Last modified: 28.11.2023
    version: 1.0
    Overview: This file contains the logic for the user registration and login.
              It handles the requests and returns the responses.
*/

using Logic.DTOs.User;
using Logic.Exceptions;
using Logic.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;

namespace Logic.Controllers
{
    /// <summary>
    /// Controller for user registration and login.
    /// Handles user registration and login requests.
    /// Returns HTTP status codes and responses.
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly AuthService authService;

        /// <summary>
        /// Injects AuthService for this controller.
        /// </summary>
        /// <param name="authService"></param>
        public UsersController(AuthService authService)
        {
            // inject authService for this controller
            this.authService = authService;
        }

        /// <summary>
        /// Registers a user.
        /// </summary>
        /// <param name="registerUser"></param>
        /// <exception cref="UsernameExists">Thrown when username already exists</exception>
        /// <exception cref="BadRequest">Thrown when request is invalid</exception>
        /// <exception cref="Exception">Thrown when server error occurs</exception>
        /// <returns>HTTP status codes and responses</returns>
        [HttpPost]
        [AllowAnonymous]
        public async Task<ActionResult<RegisterLoginResponse>> RegisterUser(RegisterUserRequest registerUser)
        {
            try
            {
                // register user
                var user = await authService.RegisterUser(registerUser);
                return Created($"/api/users/{user.UserInfo.UserId}", user);
            }
            catch (UsernameExists e)
            {
                return BadRequest(e.Message);
            }
            catch (BadRequest)
            {
                return BadRequest();
            }
            catch (Exception)
            {
                // Server error
                return StatusCode(500);
            }
        }

        /// <summary>
        /// Logs in a user.
        /// </summary>
        /// <param name="loginUserRequest"></param>
        /// <exception cref="UnauthorizedUser">Thrown when user is unauthorized</exception>
        /// <exception cref="Exception">Thrown when server error occurs</exception>
        /// <returns>HTTP status codes and responses</returns>
        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<ActionResult<RegisterLoginResponse>> LoginUser(LoginUserRequest loginUserRequest)
        {
            try
            {
                return await authService.LoginUser(loginUserRequest);
            }
            catch (UnauthorizedUser)
            {
                return Unauthorized();
            }
            catch (Exception e)
            {
                Debug.WriteLine(e);
                return StatusCode(500);
            }
        }
    }
}
