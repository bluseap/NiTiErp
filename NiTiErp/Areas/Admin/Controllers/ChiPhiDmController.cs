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
    public class ChiPhiDmController : BaseController
    {
        private readonly IHostingEnvironment _hostingEnvironment;
        private readonly NiTiErp.Application.Interfaces.IUserService _userService;
        private readonly IAuthorizationService _authorizationService;

        private readonly IChiPhiBangDanhMucService _chiphibangdanhmucService;
        private readonly IChiPhiLoaiService _chiphiloaiService;

        public ChiPhiDmController(IHostingEnvironment hostingEnvironment,
            NiTiErp.Application.Interfaces.IUserService userService,
            IAuthorizationService authorizationService,

            IChiPhiBangDanhMucService chiphibangdanhmucService,
            IChiPhiLoaiService chiphiloaiService
            )
        {
            _hostingEnvironment = hostingEnvironment;
            _userService = userService;
            _authorizationService = authorizationService;

            _chiphibangdanhmucService = chiphibangdanhmucService;
            _chiphiloaiService = chiphiloaiService;
        }

        public IActionResult Index()
        {
            return View();
        }

        #region AJAX API



        #region Danh muc

        [HttpGet]
        public IActionResult ChiPhiLoaiGetList()
        {
            var model = _chiphiloaiService.ChiPhiLoaiGetList("", "", "", "ChiPhiLoaiGetList");
            return new OkObjectResult(model);
        }

        [HttpGet]
        public IActionResult ChiPhiBangGetList()
        {
            var model = _chiphibangdanhmucService.ChiPhiBangDanhMucGetList("", "", "", "ChiPhiBangDanhMucGetList");
            return new OkObjectResult(model);
        }

        #endregion


        #endregion

    }
}