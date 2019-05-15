using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Net;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Dapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using NiTiAPI.Dapper.Models;
using NiTiAPI.Dapper.Repositories.Interfaces;
using NiTiAPI.Utilities.Constants;
using NiTiAPI.Utilities.Dtos;
using NiTiAPI.WebErp.Filters;

namespace NiTiAPI.WebErp.Areas.Admin.Controllers
{
    [Area("Admin")]
    public class LoginController : Controller
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly SignInManager<AppUser> _signInManager;
        private readonly ILogger _logger;

        private readonly IAppUserLoginRepository _appuserloginrepository;

        private readonly IConfiguration _configuration;
        private readonly string _connectionString;

        public LoginController(UserManager<AppUser> userManager, SignInManager<AppUser> signInManager
            , ILogger<LoginController> logger, IAppUserLoginRepository appuserloginrepository,
            IConfiguration configuration)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _logger = logger;
            _appuserloginrepository = appuserloginrepository;

            _configuration = configuration;
            _connectionString = configuration.GetConnectionString("DbConnectionString");
        }
        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Authen(AppUser model)
        {
            if (ModelState.IsValid)
            {
                var user = await _userManager.FindByNameAsync(model.UserName);
                if (user != null)
                {
                    var result = await _signInManager.PasswordSignInAsync(model.UserName, model.PasswordHash, false, true);
                    if (!result.Succeeded)
                        return BadRequest("Password failed");
                    var roles = await _userManager.GetRolesAsync(user);
                    var permissions = await GetPermissionByUserId(user.Id.ToString());
                    var claims = new[]
                    {
                        new Claim("Email", user.Email),
                        new Claim(SystemConstants.UserClaim.Id, user.Id.ToString()),
                        new Claim(ClaimTypes.Name, user.UserName),
                        new Claim(SystemConstants.UserClaim.FullName, user.FullName??string.Empty),
                        new Claim(SystemConstants.UserClaim.Roles, string.Join(";", roles)),
                        new Claim(SystemConstants.UserClaim.Permissions, JsonConvert.SerializeObject(permissions)),
                        new Claim(SystemConstants.UserClaim.Avatar, user.Avatar ?? string.Empty),
                        new Claim(SystemConstants.UserClaim.CorporationId, user.CorporationId.ToString()),
                        new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
                    };
                    var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Tokens:Key"]));
                    var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

                    CountUserLogin(user.UserName);

                    var token = new JwtSecurityToken(_configuration["Tokens:Issuer"],
                        _configuration["Tokens:Issuer"],
                         claims,
                        expires: DateTime.Now.AddDays(2),
                        signingCredentials: creds);

                    return Ok(new { token = new JwtSecurityTokenHandler().WriteToken(token) });
                    //return new OkObjectResult(new GenericResult(true));
                }
                return NotFound($"User name not found. {model.UserName}");

                // This doesn't count login failures towards account lockout
                // To enable password failures to trigger account lockout, set lockoutOnFailure: true
                //var result = await _signInManager.PasswordSignInAsync(model.UserName, model.PasswordHash, false, true);
                //if (result.Succeeded)
                //{
                //    _logger.LogInformation("User logged in.");

                //    CountUserLogin(model.Email);

                //    return new OkObjectResult(new GenericResult(true));
                //}
                //if (result.IsLockedOut)
                //{
                //    _logger.LogWarning("User account locked out.");
                //    return new ObjectResult(new GenericResult(false, "Tài khoản đã bị khoá"));
                //}
                //else
                //{
                //    return new ObjectResult(new GenericResult(false, "Đăng nhập sai"));
                //}
            }

            // If we got this far, something failed, redisplay form
            return new ObjectResult(new GenericResult(false, model));
        }

        private async Task<List<string>> GetPermissionByUserId(string userId)
        {
            using (var conn = new SqlConnection(_connectionString))
            {
                if (conn.State == System.Data.ConnectionState.Closed)
                    conn.Open();

                var paramaters = new DynamicParameters();
                paramaters.Add("@userId", userId);

                var result = await conn.QueryAsync<string>("Get_Permission_ByUserId", paramaters, null, null, System.Data.CommandType.StoredProcedure);
                return result.ToList();
            }
        }

        public void CountUserLogin(string userNameId)
        {
            string ipString = HttpContext.Connection.RemoteIpAddress.ToString(); // LoginIpAddress

            IPHostEntry heserver = Dns.GetHostEntry(Dns.GetHostName());

            //var ip = heserver.AddressList[2].ToString();
            var nameComputer = heserver.HostName.ToString(); // LoginNameIp
            var localIp6 = heserver.AddressList[0] != null ? heserver.AddressList[0].ToString() : "";
            var temIp6 = heserver.AddressList[1] != null ? heserver.AddressList[1].ToString() : "";
            var ip6Address = "";
            var ipComputer = ipString;//heserver.AddressList[3].ToString(); // LoginIp
            var appuserloginVm = new AppUserLogin();
            var username = userNameId;

            appuserloginVm.UserName = username;
            appuserloginVm.LoginIpAddress = ipString;
            appuserloginVm.LoginIp = ipComputer;
            appuserloginVm.LoginNameIp = nameComputer;
            appuserloginVm.LoginIp6Address = ip6Address;
            appuserloginVm.LoginLocalIp6Adress = localIp6;
            appuserloginVm.LoginMacIp = temIp6;
            appuserloginVm.CreateDate = DateTime.Now;
            appuserloginVm.CreateBy = username;

            var model = _appuserloginrepository.Create(appuserloginVm);
        }


    }
}