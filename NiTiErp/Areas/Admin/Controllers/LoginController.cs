using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using NiTiErp.Models.AccountViewModels;
using Microsoft.AspNetCore.Authorization;
using NiTiErp.Data.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using NiTiErp.Utilities.Dtos;
using System.Net;
using NiTiErp.Application.Dapper.Interfaces;
using NiTiErp.Application.Dapper.ViewModels;

namespace NiTiErp.Areas.Admin.Controllers
{
    [Area("Admin")]
    public class LoginController : Controller
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly SignInManager<AppUser> _signInManager;
        private readonly ILogger _logger;

        private readonly IAppUserLoginService _appuserloginService;

        public LoginController(UserManager<AppUser> userManager,SignInManager<AppUser> signInManager
            ,ILogger<LoginController> logger, IAppUserLoginService appuserloginService)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _logger = logger;

            _appuserloginService = appuserloginService;
        }
        public IActionResult Index()
        {          
            return View();
        } 

        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Authen(LoginViewModel model)
        {
            if (ModelState.IsValid)
            {
                // This doesn't count login failures towards account lockout
                // To enable password failures to trigger account lockout, set lockoutOnFailure: true
                var result = await _signInManager.PasswordSignInAsync(model.Email, model.Password, model.RememberMe, lockoutOnFailure: false);
                if (result.Succeeded)
                {
                    _logger.LogInformation("User logged in.");

                    CountUserLogin(model.Email);

                    return new OkObjectResult(new GenericResult(true));
                }
                if (result.IsLockedOut)
                {
                    _logger.LogWarning("User account locked out.");
                    return new ObjectResult(new GenericResult(false, "Tài khoản đã bị khoá"));
                }
                else
                {
                    return new ObjectResult(new GenericResult(false, "Đăng nhập sai"));
                }
            }

            // If we got this far, something failed, redisplay form
            return new ObjectResult(new GenericResult(false, model));
        }

        public IActionResult CountUserLogin(string userNameId)
        {
            string ipString = HttpContext.Connection.RemoteIpAddress.ToString(); // LoginIpAddress

            IPHostEntry heserver = Dns.GetHostEntry(Dns.GetHostName());

            //var ip = heserver.AddressList[2].ToString();
            var nameComputer = heserver.HostName.ToString(); // LoginNameIp
            var localIp6 = heserver.AddressList[0].ToString();
            var temIp6 = heserver.AddressList[1].ToString();
            var ip6Address = heserver.AddressList[2].ToString();
            var ipComputer = heserver.AddressList[3].ToString(); // LoginIp


            var appuserloginVm = new AppUserLoginViewModel();

            //var username = User.GetSpecificClaim("UserName");
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

            var model = _appuserloginService.AppUserLoginAUD(appuserloginVm, "InAppUserLogin");

            return new OkObjectResult(model);
        }

    }
}