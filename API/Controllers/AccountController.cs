using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using API.Data;
using API.Dto;
using API.Entities;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AccountController : ControllerBase
    {
        private readonly DataContext _dataContext;
        private readonly ITokenService _tokenService;

        public AccountController(DataContext dataContext, ITokenService tokenService)
        {
            _tokenService = tokenService;
            _dataContext = dataContext;
        }
        [HttpPost("register")]
        public async Task<ActionResult<AppUser>> Register(RegisterDto registerDto)
        {
            if (await UserExists(registerDto.UserName)) return BadRequest("UserName Already Taken");
            using var hmac = new HMACSHA512();
            var user = new AppUser
            {
                UserName = registerDto.UserName.ToLower(),
                PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(registerDto.Password)),
                PasswordSalt = hmac.Key
            };
            _dataContext.Users.Add(user);
            await _dataContext.SaveChangesAsync();
            return user;
        }
        [HttpPost("login")]
        public async Task<ActionResult<AppUser>> LoginUser(LoginDto loginDto)
        {
            var user = await _dataContext.Users.SingleOrDefaultAsync(u => u.UserName == loginDto.UserName);
            if (user != null)
            {
                using var hmac = new HMACSHA512(user.PasswordSalt);
                byte[] passwordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(loginDto.Password));
                for (int i = 0; i < passwordHash.Length; i++)
                {
                    if (passwordHash[i] != user.PasswordHash[i])
                    {
                        return BadRequest("Invalid Password");
                    }

                }
                return Ok(new LoginResultDto { UserName = user.UserName, Token = _tokenService.CreateToken(user)});

            }
            return BadRequest("Unknown UserName or Password");
        }

        private async Task<bool> UserExists(string userName)
        {
            return await _dataContext.Users.AnyAsync(q => q.UserName == userName.ToLower());

        }
    }
}