using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using API.Data;
using API.Dto;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        //private readonly DataContext _dataContext;
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;
        private readonly IPhotoService _photoService;
        public UsersController(IUserRepository userRepository, IMapper mapper, IPhotoService photoService)
        {
            _photoService = photoService;
            _mapper = mapper;
            _userRepository = userRepository;
        }
        [HttpGet]
        public async Task<ActionResult<IEnumerable<AppUserDto>>> GetUsersAsync()
        {
            var users = await _userRepository.GetUsersAsync();
            var usersDto = _mapper.Map<IEnumerable<AppUserDto>>(users);
            return Ok(usersDto);
        }


        /*[HttpGet("{id}")]
        public async Task<ActionResult<AppUser>> GetUserById(int id)
        {
            var user = await _userRepository.GetUserByIdAsync(id);
            var userDto = _mapper.Map<AppUserDto>(user);
            return Ok(userDto);
        }*/

        [HttpGet("{userName}", Name ="GetUser")]
        public async Task<ActionResult<AppUserDto>> GetUserByUserName(string userName)
        {
            var user = await _userRepository.GetUserByUsernameAsync(userName);
            var userDto = _mapper.Map<AppUserDto>(user);
            return Ok(userDto);
        }

        [HttpPut]
        public async Task<ActionResult> UpdateUser(MemberUpdateDto memberUpdateDto)
        {
            var userName = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var user = await _userRepository.GetUserByUsernameAsync(userName);
            _mapper.Map(memberUpdateDto, user);
            if (await _userRepository.SaveAllAsync())
            {
                return NoContent();
            }
            return BadRequest("Failed to update user");
        }

        [HttpPost("add-photo")]
        public async Task<ActionResult<PhotoDto>> AddPhoto(IFormFile file)
        {
            var user = await _userRepository.GetUserByUsernameAsync(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            var result = await _photoService.AddPhotoAsync(file);
            if(result.Error != null)
            {
                return BadRequest(result.Error.Message);
            }
            var photo = new Photo{
                Url = result.SecureUrl.AbsoluteUri,
                PublicId = result.PublicId
            };
            if(user.Photos.Count == 0)
            {
                photo.IsMain = true;
            }

            user.Photos.Add(photo);
            if(await _userRepository.SaveAllAsync())
            {
                //return _mapper.Map<PhotoDto>(photo);
                return CreatedAtRoute("GetUser",new {userName = user.UserName},_mapper.Map<PhotoDto>(photo));
            }
            return BadRequest("Problem adding photo");
        }
        [HttpPut("set-main-photo/{photoId}")]
        public async Task<ActionResult> SetMainPhoto(int photoId)
        {
            var user = await _userRepository.GetUserByUsernameAsync(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            var photo = user.Photos.FirstOrDefault(x=> x.ID == photoId);
            if(photo.IsMain) return BadRequest("This is already your main photo");
            var currentMain = user.Photos.FirstOrDefault(x=>x.IsMain);
            if(currentMain!=null)
            {
                currentMain.IsMain = false;
                photo.IsMain = true;
                if (await _userRepository.SaveAllAsync()) return NoContent();
            }
            return BadRequest("Failed To Set Main Photo");
        }
        [HttpDelete("delete-photo/{photoId}")]
        public async Task<ActionResult> DeletePhoto(int photoId)
        {
            var user = await _userRepository.GetUserByUsernameAsync(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            var photo = user.Photos.FirstOrDefault(x => x.ID == photoId);
            if (photo == null) return NotFound();
            if (photo.IsMain) return BadRequest("You cannot delete your main photo");
            if(photo.PublicId!= null)
            {
                var result = await _photoService.DeletePhotoAsync(photo.PublicId);
                if (result.Error != null) return BadRequest(result.Error.Message);
            }
            user.Photos.Remove(photo);
            if (await _userRepository.SaveAllAsync()) return Ok();
            return BadRequest("Failed to delete the photo");
        }
    }
}