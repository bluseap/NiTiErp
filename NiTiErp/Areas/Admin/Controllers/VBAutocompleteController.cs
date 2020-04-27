using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.AspNetCore.SignalR;
using NiTiErp.Application.Dapper.Interfaces;
using NiTiErp.Application.Dapper.ViewModels;
using NiTiErp.Authorization;
using NiTiErp.Extensions;
using NiTiErp.Hubs;
using NiTiErp.Utilities.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;

namespace NiTiErp.Areas.Admin.Controllers
{
    public class VBAutocompleteController : BaseController
    {
        private readonly IHostingEnvironment _hostingEnvironment;
        private readonly NiTiErp.Application.Interfaces.IUserService _userService;
        private readonly IAuthorizationService _authorizationService;

        private readonly IVBAutocompleteService _vbAutocompleteServices;

        public VBAutocompleteController(IHostingEnvironment hostingEnvironment,
            NiTiErp.Application.Interfaces.IUserService userService,
            IAuthorizationService authorizationService,
            IVBAutocompleteService vbAutocompleteServices
            )
        {
            _hostingEnvironment = hostingEnvironment;
            _userService = userService;
            _authorizationService = authorizationService;

            _vbAutocompleteServices = vbAutocompleteServices;
        }

        public IActionResult Index()
        {
            //var username = User.GetSpecificClaim("UserName");
            //var result = _authorizationService.AuthorizeAsync(User, "VANBANDENXEM", Operations.Read);
            //if (result.Result.Succeeded == false)
            //    return new RedirectResult("/homevanban/Index");

            return View();
        }

        [HttpGet]
        public IActionResult GetListVBAuto(string codeXL)
        {
            var model = _vbAutocompleteServices.VBAutoGetList(codeXL, "",
                "", "", "", "GetVanBanAutocomplete");

            return new OkObjectResult(model);
        }

        [HttpGet]
        public IActionResult GetListHoSoAuto(string codeXL)
        {
            var model = _vbAutocompleteServices.VBAutoGetList(codeXL, "",
                "", "", "", "GetHoSoNhanVienAutocomplete");

            return new OkObjectResult(model);
        }

    }
}