using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using NiTiErp.Application.Dapper.Interfaces;

namespace NiTiErp.Areas.Admin.Controllers
{
    public class VBDiDMSoController : BaseController
    {
        private readonly IHostingEnvironment _hostingEnvironment;
        private readonly NiTiErp.Application.Interfaces.IUserService _userService;
        private readonly IAuthorizationService _authorizationService;

        private readonly IVanBanDiSoService _vanbandisoService;

        public VBDiDMSoController(IHostingEnvironment hostingEnvironment,
            NiTiErp.Application.Interfaces.IUserService userService,
            IAuthorizationService authorizationService,

           IVanBanDiSoService vanbandisoService
            )
        {
            _hostingEnvironment = hostingEnvironment;
            _userService = userService;
            _authorizationService = authorizationService;

            _vanbandisoService = vanbandisoService;
        }

        public IActionResult Index()
        {
            //var username = User.GetSpecificClaim("UserName");
            //var result = _authorizationService.AuthorizeAsync(User, "VANBANDENDUYET", Operations.Read);
            //if (result.Result.Succeeded == false)
            //    return new RedirectResult("/homevanban/Index");

            return View();
        }

        #region AJAX API

        [HttpGet]
        public IActionResult VanBanCoQuanGetList(string corporationid, int nam)
        {
            var model = _vanbandisoService.VanBanDiSoGetList(corporationid, nam, "", 1, "", "GetAllVanBanDiSoNamKV");
            return new OkObjectResult(model);
        }

        [HttpGet]
        public IActionResult VanBanCoQuanGetListKV(string corporationid)
        {
            var model = _vanbandisoService.VanBanDiSoGetList(corporationid, 1, "", 1, "", "GetAllVanBanDiSoKV");
            return new OkObjectResult(model);
        }

        #endregion AJAX API

    }
}