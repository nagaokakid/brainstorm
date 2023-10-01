using Logic.DTOs.User;
using Logic.Exceptions;
using Logic.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

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
        public async Task<ActionResult<RegisterUserResponse>> RegisterUser(RegisterUserRequest registerUser)
        {
            try
            {
                // register user
                var user = await authService.RegisterUser(registerUser);
                return Created($"/api/users/{user.Id}", user);
            }
            catch(UserExists e)
            {
                return BadRequest(e.Message);
            }
            catch (Exception)
            {
                // Server error
                return StatusCode(500);
            }
        }
    }
}
