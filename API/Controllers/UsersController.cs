using System.Collections.Generic;
using System.Linq;
using API.Data;
using API.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly DataContext _dataContext;
        public UsersController(DataContext dataContext)
        {
            _dataContext = dataContext;

        }
        [HttpGet]
        public ActionResult<IEnumerable<AppUser>> GetAll()
        {
            return _dataContext.Users.ToList();
        }

        [Authorize()]
        [HttpGet("{id}")]
        public ActionResult<AppUser> GetUser(int id)
        {
            return _dataContext.Users.Find(id);
        }
    }
}