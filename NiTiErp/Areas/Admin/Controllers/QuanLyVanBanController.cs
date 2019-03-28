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

namespace NiTiErp.Areas.Admin.Controllers
{
    public class QuanLyVanBanController : BaseController
    {
        private readonly IHostingEnvironment _hostingEnvironment;
        private readonly NiTiErp.Application.Interfaces.IUserService _userService;
        private readonly IAuthorizationService _authorizationService;

        private readonly IQuanLyVanBanService _quanlyvanbanService;

        public QuanLyVanBanController(IHostingEnvironment hostingEnvironment,
            NiTiErp.Application.Interfaces.IUserService userService,
            IAuthorizationService authorizationService,

           IQuanLyVanBanService quanlyvanbanService
            )
        {
            _hostingEnvironment = hostingEnvironment;
            _userService = userService;
            _authorizationService = authorizationService;

            _quanlyvanbanService = quanlyvanbanService;
        }

        public IActionResult Index()
        {
            return View();
        }

        #region AJAX API

        [HttpGet]
        public IActionResult QLVBDiGetList(string corporationid)
        {
            var ngayht = DateTime.Now;
            var namht = DateTime.Now.Year;
            var model = _quanlyvanbanService.QuanLyVanBanGetList(corporationid, namht, "",
                ngayht, ngayht, 0, 0,"", 1, 1000, 0, "", "GetAllVanBanDiKV");

            return new OkObjectResult(model);
        }

        [HttpGet]
        public IActionResult QLVBDiGetId(long danhmuchosoid)
        {
            var ngayht = DateTime.Now;
            var namht = DateTime.Now.Year;
            var model = _quanlyvanbanService.QuanLyVanBanGetList("", namht, "",
                ngayht, ngayht, 0, 0, "", 1, 1000, danhmuchosoid, "", "GetAllQuanLyVanBanId");

            return new OkObjectResult(model);
        }


        [HttpGet]
        public IActionResult QLVBDenGetList(string corporationid)
        {
            var ngayht = DateTime.Now;
            var namht = DateTime.Now.Year;
            var model = _quanlyvanbanService.QuanLyVanBanGetList(corporationid, namht, "",
                ngayht, ngayht, 0, 0, "", 1, 1000, 0, "", "GetAllVanBanDenKV");

            return new OkObjectResult(model);
        }

        #endregion


    }
}