using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using NiTiErp.Application.Dapper.Interfaces;


namespace NiTiErp.Areas.Admin.Controllers
{
    public class VBCoQuanController : BaseController
    {
        private readonly IHostingEnvironment _hostingEnvironment;
        private readonly NiTiErp.Application.Interfaces.IUserService _userService;
        private readonly IAuthorizationService _authorizationService;

        private readonly IVanBanCoQuanService _vanbancoquanService;

        public VBCoQuanController(IHostingEnvironment hostingEnvironment,
            NiTiErp.Application.Interfaces.IUserService userService,
            IAuthorizationService authorizationService,

            IVanBanCoQuanService vanbancoquanService
            )
        {
            _hostingEnvironment = hostingEnvironment;
            _userService = userService;
            _authorizationService = authorizationService;

            _vanbancoquanService = vanbancoquanService;
        }

        public IActionResult Index()
        {
            return View();
        }

        #region AJAX API

        [HttpGet]
        public IActionResult VanBanCoQuanGetList()
        {
            var model = _vanbancoquanService.VanBanCoQuanGetList("", "", "", "VanBanCoQuanGetList");
            return new OkObjectResult(model);
        }

        #endregion AJAX API
    }
}