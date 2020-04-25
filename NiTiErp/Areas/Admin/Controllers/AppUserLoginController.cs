using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using NiTiErp.Application.Dapper.Interfaces;
using NiTiErp.Application.Dapper.ViewModels;
using NiTiErp.Authorization;
using NiTiErp.Extensions;
using NiTiErp.Utilities.Dtos;
using OfficeOpenXml;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Globalization;
using System.IO;
using System.Linq;

namespace NiTiErp.Areas.Admin.Controllers
{
    public class AppUserLoginController : BaseController
    {
        private readonly IHostingEnvironment _hostingEnvironment;
        private readonly NiTiErp.Application.Interfaces.IUserService _userService;
        private readonly IAuthorizationService _authorizationService;

        private readonly IAppUserLoginService _appuserloginService;        

        public AppUserLoginController(IHostingEnvironment hostingEnvironment,
            NiTiErp.Application.Interfaces.IUserService userService,
            IAuthorizationService authorizationService,

            IAppUserLoginService appuserloginService
            )
        {
            _hostingEnvironment = hostingEnvironment;
            _userService = userService;
            _authorizationService = authorizationService;

            _appuserloginService = appuserloginService;       

        }

        public IActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public IActionResult GetUserName(string username)
        {
            var model = _appuserloginService.GetAllAppUserPaging("", "", 1, 1000, "", username, "", "GetUserNameOnline");

            return new OkObjectResult(model);
        }

        [HttpGet]
        public IActionResult GetNhomXuLyHoSoNhanVien(string username)
        {
            var model = _appuserloginService.GetAllAppUserPaging("", "", 1, 1000, "", username, "", "GetNhomXuLyHoSoNhanVien");

            return new OkObjectResult(model);
        }

        [HttpGet]
        public IActionResult GetNhomVanThuHoSoNhanVien(string username)
        {
            var model = _appuserloginService.GetAllAppUserPaging("", "", 1, 1000, "", username, "", "GetNhomVanThuHoSoNhanVien");

            return new OkObjectResult(model);
        }

        [HttpGet]
        public IActionResult GetHoSoNhanVien(string username)
        {
            var model = _appuserloginService.GetAllAppUserPaging("", "", 1, 1000, "", username, "", "GetHoSoNhanVien");

            return new OkObjectResult(model);
        }

    }
}