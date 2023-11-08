using Logic.DTOs.ChatRoom;
using Logic.Exceptions;
using Logic.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Logic.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChatRoomController : ControllerBase
    {
        private readonly ChatRoomService chatRoomService;

        public ChatRoomController(ChatRoomService chatRoomService)
        {
            this.chatRoomService = chatRoomService;
        }

        [HttpPost]
        public async Task<ActionResult<CreateChatRoomResponse>> CreateChatRoom(CreateChatRoomRequest request)
        {
            try
            {
                return await chatRoomService.CreateChatRoom(request);
            }
            catch (ChatRoomNotFound e)
            {
                return BadRequest(e.Message);
            }
            catch (Exception)
            {
                return StatusCode(500);
            }
        }

        [AllowAnonymous]
        [HttpGet("{joinCode}")]
        public async Task<ActionResult<bool>> IsJoinCodeValid(string joinCode)
        {
            try
            {
                return await chatRoomService.IsJoinCodeValid(joinCode);
            }
            catch (Exception)
            {
                return StatusCode(500);
            }
        }
    }
}
