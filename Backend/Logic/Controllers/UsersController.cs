using Logic.DTOs.User;
using Logic.Exceptions;
using Logic.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;

namespace Logic.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly AuthService authService;

        public UsersController(AuthService authService)
        {
            // inject authService for this controller
            this.authService = authService;
        }

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
