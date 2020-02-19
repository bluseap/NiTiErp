using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Dapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using NiTiAPI.Dapper.Models;
using NiTiAPI.Dapper.ViewModels;
using NiTiAPI.Utilities.Constants;
using NiTiAPI.Web.Extensions;
using NiTiAPI.Web.Filters;


namespace NiTiAPI.Web.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [MiddlewareFilter(typeof(LocalizationPipeline))]
    [Authorize]
    public class LoginPoDocController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly SignInManager<AppUserPoDoc> _signInManager;
        private readonly UserManager<AppUserPoDoc> _userManager;

        public LoginPoDocController(UserManager<AppUserPoDoc> userManager,
            IConfiguration configuration,
            SignInManager<AppUserPoDoc> signInManager)
        {
            _signInManager = signInManager;
            _userManager = userManager;
            _configuration = configuration;
        }

        [HttpPost]
        [AllowAnonymous]
        [Route("lgPoDoc")]
        [ValidateModel]
        public async Task<IActionResult> lgPoDoc([FromBody] LoginViewModel model)
        {
            var user = await _userManager.FindByNameAsync(model.UserName);
            if (user != null)
            {
                var result = await _signInManager.PasswordSignInAsync(model.UserName, model.Password, false, true);
                if (!result.Succeeded)
                    return BadRequest("Mật khẩu không đúng");
                //var roles = await _userManager.GetRolesAsync(user);
                //var permissions = await GetPermissionByUserId(user.Id.ToString());
                var claims = new[]
                {
                    new Claim("Email", user.Email),
                    new Claim(SystemConstants.UserClaim.Id, user.Id.ToString()),
                    new Claim(ClaimTypes.Name, user.UserName),
                    new Claim(SystemConstants.UserClaim.FullName, user.FullName??string.Empty),
                    //new Claim(SystemConstants.UserClaim.Roles, string.Join(";", roles)),
                    //new Claim(SystemConstants.UserClaim.Permissions, JsonConvert.SerializeObject(permissions)),
                    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
                };
                var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Tokens:Key"]));
                var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

                var token = new JwtSecurityToken(_configuration["Tokens:Issuer"],
                    _configuration["Tokens:Issuer"],
                     claims,
                    expires: DateTime.Now.AddDays(2),
                    signingCredentials: creds);

                return Ok(new { token = new JwtSecurityTokenHandler().WriteToken(token) });
            }
            return NotFound($"Không tìm thấy tài khoản {model.UserName}");
        }

    }
}