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
    public class QDNangNgachController : BaseController
    {
        private readonly IHostingEnvironment _hostingEnvironment;
        private readonly NiTiErp.Application.Interfaces.IUserService _userService;
        private readonly IAuthorizationService _authorizationService;

        private readonly IHeSoLuongService _hesoluongService;
        private readonly IBacLuongService _bacluongService;

        public QDNangNgachController(IHostingEnvironment hostingEnvironment,
           NiTiErp.Application.Interfaces.IUserService userService,
           IAuthorizationService authorizationService,

           IHeSoLuongService hesoluongService,
           IBacLuongService bacluongService
           )
        {
            _hostingEnvironment = hostingEnvironment;
            _userService = userService;
            _authorizationService = authorizationService;

            _hesoluongService = hesoluongService;
            _bacluongService = bacluongService;
        }

        public IActionResult Index()
        {
            return View();
        }

        #region AJAX API

        [HttpGet]
        public IActionResult GetChucVuBac(string corporationId, string chucvuId, string bacluongId)
        {   
            var model = _hesoluongService.HeSoLuongGetList(corporationId, "", "", "", "", "", chucvuId, bacluongId, "", "GetHeSoLuongChucVuBac");
            return new OkObjectResult(model);
        }

        [HttpGet]
        public IActionResult BacLuongGetList()
        {
            var corporationId = User.GetSpecificClaim("CorporationId");

            var model = _bacluongService.BacLuongGetList(corporationId, "", "", "BacLuongGetList");
            return new OkObjectResult(model);
        }

        #endregion

    }
}