using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using NiTiErp.Application.Dapper.Interfaces;

namespace NiTiErp.Areas.Admin.Controllers
{
    public class VBMatController : BaseController
    {
        private readonly IHostingEnvironment _hostingEnvironment;
        private readonly NiTiErp.Application.Interfaces.IUserService _userService;
        private readonly IAuthorizationService _authorizationService;

        private readonly IVanBanMatService _vanbanmatService;

        public VBMatController(IHostingEnvironment hostingEnvironment,
            NiTiErp.Application.Interfaces.IUserService userService,
            IAuthorizationService authorizationService,

            IVanBanMatService vanbanmatService
            )
        {
            _hostingEnvironment = hostingEnvironment;
            _userService = userService;
            _authorizationService = authorizationService;

            _vanbanmatService = vanbanmatService;
        }

        public IActionResult Index()
        {
            return View();
        }

        #region AJAX API

        [HttpGet]
        public IActionResult VanBanMatGetList()
        {
            var model = _vanbanmatService.VanBanMatGetList("", "", "", "VanBanMatGetList");
            return new OkObjectResult(model);
        }

        #endregion AJAX API
    }
}