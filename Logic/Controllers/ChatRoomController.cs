using Logic.DTOs.ChatRoom;
using Logic.Services;
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
            catch (Exception)
            {
                return StatusCode(500);
            }
        }
    }
}
