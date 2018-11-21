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
using OfficeOpenXml.Style;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Globalization;
using System.IO;
using System.Linq;

namespace NiTiErp.Areas.Admin.Controllers
{
    public class ChiPhiController : BaseController
    {
        private readonly IHostingEnvironment _hostingEnvironment;
        private readonly NiTiErp.Application.Interfaces.IUserService _userService;
        private readonly IAuthorizationService _authorizationService;

        private readonly IDieuKienTimService _dieukientimService;

        private readonly Application.Dapper.Interfaces.ICorporationService _corporationsService;

        public ChiPhiController(IHostingEnvironment hostingEnvironment,
            NiTiErp.Application.Interfaces.IUserService userService,
            IAuthorizationService authorizationService,

            IDieuKienTimService dieukientimService,

            Application.Dapper.Interfaces.ICorporationService corporationsService
            )
        {
            _hostingEnvironment = hostingEnvironment;
            _userService = userService;
            _authorizationService = authorizationService;

            _dieukientimService = dieukientimService;

            _corporationsService = corporationsService;
        }

        public IActionResult Index()
        {
            return View();
        }

        #region AJAX API



        #region Danh mục chi phi luong

        [HttpGet]
        public IActionResult DieuKienGetList()
        {
            var model = _dieukientimService.DieuKienTimGetList("ChiPhi", "", "", "BangDieuKienTimGetList");
            return new OkObjectResult(model);
        }

        #endregion

        #endregion


    }
}