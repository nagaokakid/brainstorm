/*
    Team: DarkArmy
    Last modified: 26.10.2023
    version: 1.0
    Overview: This file contains the logic for the chat room creation.
              It handles the requests and returns the responses.
*/

using Logic.DTOs.ChatRoom;
using Logic.Exceptions;
using Logic.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Logic.Controllers
{
    /// <summary>
    /// Controller for chat room creation.
    /// Handles chat room creation requests.
    /// Returns HTTP status codes and responses.
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    public class ChatRoomController : ControllerBase
    {
        private readonly IChatRoomService chatRoomService;

        /// <summary>
        /// Injects ChatRoomService for this controller.
        /// </summary>
        /// <param name="chatRoomService"></param>
        public ChatRoomController(IChatRoomService chatRoomService)
        {
            this.chatRoomService = chatRoomService;
        }

        /// <summary>
        /// Creates a chat room.
        /// </summary>
        /// <param name="request"></param>
        /// <exception cref="ChatRoomNotFound">Thrown when chat room is not found</exception>
        /// <exception cref="Exception">Thrown when server error occurs</exception>
        /// <returns>HTTP status codes and responses</returns>
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

        /// <summary>
        /// Checks if join code is valid.
        /// </summary>
        /// <param name="joinCode"></param>
        /// <exception cref="Exception">Thrown when server error occurs</exception>
        /// <returns>HTTP status codes and responses</returns>
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
