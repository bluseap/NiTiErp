using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using NiTiErp.Application.Dapper.Interfaces;
using NiTiErp.Application.Dapper.ViewModels;
using NiTiErp.Authorization;
using NiTiErp.Extensions;
using NiTiErp.Utilities.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NiTiErp.Areas.Admin.Controllers
{
    public class EmailDaGuiController : BaseController
    {
        private readonly IHostingEnvironment _hostingEnvironment;
        private readonly NiTiErp.Application.Interfaces.IUserService _userService;
        private readonly IAuthorizationService _authorizationService;

        private readonly IEmailNoiBoService _emailnoiboService;
        private readonly IEmailNoiBoNhanService _emailnoibonhanService;
        private readonly IEmailNoiBoNhanFileService _emailnoibonhanfileService;

        public EmailDaGuiController(IHostingEnvironment hostingEnvironment,
            NiTiErp.Application.Interfaces.IUserService userService,
            IAuthorizationService authorizationService,
            IEmailNoiBoService emailnoiboService,
            IEmailNoiBoNhanService emailnoibonhanService,
            IEmailNoiBoNhanFileService emailnoibonhanfileService
            )
        {
            _hostingEnvironment = hostingEnvironment;
            _userService = userService;
            _authorizationService = authorizationService;

            _emailnoiboService = emailnoiboService;
            _emailnoibonhanService = emailnoibonhanService;
            _emailnoibonhanfileService = emailnoibonhanfileService;
        }

        public IActionResult Index()
        {
            var username = User.GetSpecificClaim("UserName");
            var result = _authorizationService.AuthorizeAsync(User, "EMAILNOIBODAGUI", Operations.Read);
            if (result.Result.Succeeded == false)
                return new RedirectResult("/homevanban/Index");

            return View();
        }

        [HttpGet]
        public async Task<IActionResult> GetListEmailDaGui(string NguoiGui, int page, int pageSize)
        {
            var model = await _emailnoiboService.GetPagingGui(NguoiGui, page, pageSize);
            return new OkObjectResult(model);
        }

        [HttpGet]
        public async Task<IActionResult> GetEmailNoiBoGui(long EmailNoiBoId)
        {
            var model = await _emailnoiboService.GetByEmailNoiBo(EmailNoiBoId);
            return new OkObjectResult(model);
        }

    }
}