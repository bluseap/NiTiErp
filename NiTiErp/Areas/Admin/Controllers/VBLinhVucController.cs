using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using NiTiErp.Application.Dapper.Interfaces;

namespace NiTiErp.Areas.Admin.Controllers
{
    public class VBLinhVucController : BaseController
    {
        private readonly IHostingEnvironment _hostingEnvironment;
        private readonly NiTiErp.Application.Interfaces.IUserService _userService;
        private readonly IAuthorizationService _authorizationService;

        private readonly IVanBanLinhVucService _vanbanlinhvucService;

        public VBLinhVucController(IHostingEnvironment hostingEnvironment,
            NiTiErp.Application.Interfaces.IUserService userService,
            IAuthorizationService authorizationService,

            IVanBanLinhVucService vanbanlinhvucService
            )
        {
            _hostingEnvironment = hostingEnvironment;
            _userService = userService;
            _authorizationService = authorizationService;

            _vanbanlinhvucService = vanbanlinhvucService;
        }

        public IActionResult Index()
        {
            //var username = User.GetSpecificClaim("UserName");
            //var result = _authorizationService.AuthorizeAsync(User, "VANBANDENXEM", Operations.Read);
            //if (result.Result.Succeeded == false)
            //    return new RedirectResult("/homevanban/Index");

            return View();
        }

        #region AJAX API

        [HttpGet]
        public IActionResult VanBanKhanGetList()
        {
            var model = _vanbanlinhvucService.VanBanLinhVucGetList("", "", "", "VanBanLinhVucGetList");
            return new OkObjectResult(model);
        }

        #endregion AJAX API
    }
}