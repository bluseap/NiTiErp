using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using NiTiErp.Application.Dapper.Interfaces;

namespace NiTiErp.Areas.Admin.Controllers
{
    public class VBKhanController : BaseController
    {
        private readonly IHostingEnvironment _hostingEnvironment;
        private readonly NiTiErp.Application.Interfaces.IUserService _userService;
        private readonly IAuthorizationService _authorizationService;

        private readonly IVanBanKhanService _vanbankhanService;

        public VBKhanController(IHostingEnvironment hostingEnvironment,
            NiTiErp.Application.Interfaces.IUserService userService,
            IAuthorizationService authorizationService,

            IVanBanKhanService vanbankhanService
            )
        {
            _hostingEnvironment = hostingEnvironment;
            _userService = userService;
            _authorizationService = authorizationService;

            _vanbankhanService = vanbankhanService;
        }

        public IActionResult Index()
        {
            return View();
        }

        #region AJAX API

        [HttpGet]
        public IActionResult VanBanKhanGetList()
        {
            var model = _vanbankhanService.VanBanKhanGetList("", "", "", "VanBanKhanGetList");
            return new OkObjectResult(model);
        }

        #endregion AJAX API
    }
}