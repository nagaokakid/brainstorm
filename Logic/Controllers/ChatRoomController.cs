using Logic.DTOs.ChatRoom;
using Logic.Models;
using Logic.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Logic.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChatRoomController : ControllerBase
    {
        private readonly DatabaseService databaseService;

        public ChatRoomController(DatabaseService databaseService)
        {
            this.databaseService = databaseService;
        }

        [HttpPost]
        public async Task<ActionResult<CreateChatRoomResponse>> CreateChatRoom(CreateChatRoomRequest request)
        {
            try
            {
                return await databaseService.CreateChatRoom(request);
            }
            catch (Exception)
            {
                return StatusCode(500);
            }
        }
    }
}
