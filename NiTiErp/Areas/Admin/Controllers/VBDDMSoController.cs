using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using NiTiErp.Application.Dapper.Interfaces;

namespace NiTiErp.Areas.Admin.Controllers
{
    public class VBDDMSoController : BaseController
    {
        private readonly IHostingEnvironment _hostingEnvironment;
        private readonly NiTiErp.Application.Interfaces.IUserService _userService;
        private readonly IAuthorizationService _authorizationService;

        private readonly IVanBanDenSoService _vanbandensoService;

        public VBDDMSoController(IHostingEnvironment hostingEnvironment,
            NiTiErp.Application.Interfaces.IUserService userService,
            IAuthorizationService authorizationService,

           IVanBanDenSoService vanbandensoService
            )
        {
            _hostingEnvironment = hostingEnvironment;
            _userService = userService;
            _authorizationService = authorizationService;

            _vanbandensoService = vanbandensoService;
        }

        public IActionResult Index()
        {
            //var username = User.GetSpecificClaim("UserName");
            //var result = _authorizationService.AuthorizeAsync(User, "DANHMUCVANBANCOQUAN", Operations.Read);
            //if (result.Result.Succeeded == false)
            //    return new RedirectResult("/homevanban/Index");

            return View();
        }

        #region AJAX API

        [HttpGet]
        public IActionResult VanBanCoQuanGetList(string corporationid, int nam)
        {
            var model = _vanbandensoService.VanBanDenSoGetList(corporationid, nam, "", 1, "", "GetAllVanBanDenSoNamKV");
            return new OkObjectResult(model);
        }

        [HttpGet]
        public IActionResult VanBanCoQuanGetListKV(string corporationid)
        {
            var model = _vanbandensoService.VanBanDenSoGetList(corporationid, 1, "", 1, "", "GetAllVanBanDenSoKV");
            return new OkObjectResult(model);
        }

        #endregion AJAX API


    }
}