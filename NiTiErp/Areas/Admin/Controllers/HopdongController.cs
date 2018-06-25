using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using NiTiErp.Application.Dapper.Interfaces;
using NiTiErp.Application.Dapper.ViewModels;
using NiTiErp.Authorization;
using NiTiErp.Extensions;
using NiTiErp.Utilities.Dtos;
using NiTiErp.Utilities.Helpers;
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
    public class HopdongController : BaseController
    {
        private readonly IHostingEnvironment _hostingEnvironment;
        private readonly NiTiErp.Application.Interfaces.IUserService _userService;
        private readonly IAuthorizationService _authorizationService;

        private IDieuKienTimService _dieukientimService;

        public HopdongController(IHostingEnvironment hostingEnvironment,
            NiTiErp.Application.Interfaces.IUserService userService,
            IAuthorizationService authorizationService,

            IDieuKienTimService dieukientimService        )
        {
            _hostingEnvironment = hostingEnvironment;
            _userService = userService;
            _authorizationService = authorizationService;

            _dieukientimService = dieukientimService;
        }

        public IActionResult Index()
        {
            return View();
        }

        #region Danh muc Hop dong nhan vien
        [HttpGet]
        public IActionResult DieuKienGetList()
        {          
            var model = _dieukientimService.DieuKienTimGetList("HopDongNhanVien", "", "", "BangDieuKienTimGetList");
            return new OkObjectResult(model);
        }

        #endregion


    }
}