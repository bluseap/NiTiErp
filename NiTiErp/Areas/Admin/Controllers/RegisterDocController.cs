using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using NiTiErp.Application.Dapper.Interfaces;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;

namespace NiTiErp.Areas.Admin.Controllers
{
    public class RegisterDocController : BaseController
    {
        private readonly IHostingEnvironment _hostingEnvironment;
        private readonly NiTiErp.Application.Interfaces.IUserService _userService;
        private readonly IAuthorizationService _authorizationService;

        private readonly IRegisterDocService _registerdocService;

        public RegisterDocController(IHostingEnvironment hostingEnvironment,
            NiTiErp.Application.Interfaces.IUserService userService,
            IAuthorizationService authorizationService,

            IRegisterDocService registerdocService
            )
        {
            _hostingEnvironment = hostingEnvironment;
            _userService = userService;
            _authorizationService = authorizationService;

            _registerdocService = registerdocService;
        }

        public IActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public IActionResult GetByVBDDuyetId(long vanbandenduyetId)
        {
            var model = _registerdocService.GetByVBDDuyetId(vanbandenduyetId);
            return new OkObjectResult(model);
        }


    }
}