using Logic.DTOs.ChatRoom;
using Logic.Exceptions;
using Logic.Services;
using Microsoft.AspNetCore.Mvc;

namespace Logic.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChatRoomController : ControllerBase
    {
        private readonly IChatRoomService chatRoomService;

        public ChatRoomController(IChatRoomService chatRoomService)
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
    }
}
