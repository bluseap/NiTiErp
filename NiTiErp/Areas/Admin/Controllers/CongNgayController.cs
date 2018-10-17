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
    public class CongNgayController : BaseController
    {
        private readonly IHostingEnvironment _hostingEnvironment;
        private readonly NiTiErp.Application.Interfaces.IUserService _userService;
        private readonly IAuthorizationService _authorizationService;

       
        private readonly ILuongBaoHiemService _luongbaohiemService;

        private readonly Application.Dapper.Interfaces.ICorporationService _corporationsService;

        public CongNgayController(IHostingEnvironment hostingEnvironment,
            NiTiErp.Application.Interfaces.IUserService userService,
            IAuthorizationService authorizationService,

            ILuongBaoHiemService luongbaohiemService,
            Application.Dapper.Interfaces.ICorporationService corporationsService
            )
        {
            _hostingEnvironment = hostingEnvironment;
            _userService = userService;
            _authorizationService = authorizationService;

            _luongbaohiemService = luongbaohiemService;

            _corporationsService = corporationsService;
        }

        public IActionResult Index()
        {
            return View();
        }

        #region AJAX API

        public IActionResult LuongBaoHiemGetList(int nam, int thang, string corporationId, string phongId,
            string chucvuId, string keyword, int page, int pageSize)
        {
            var khuvuc = !string.IsNullOrEmpty(corporationId) ? corporationId : "%";
            var phong = !string.IsNullOrEmpty(phongId) ? phongId : "%";
            var tukhoa = !string.IsNullOrEmpty(keyword) ? keyword : "%";
            var chucvu = !string.IsNullOrEmpty(chucvuId) ? chucvuId : "%";

            var hosoid = new Guid();

            var model = _luongbaohiemService.LuongBaoHiemGetList(1, nam, thang, khuvuc, phong, 
                chucvuId, hosoid, "", "", "", "", keyword, "GetListLuongBaoHiemKy");

            return new OkObjectResult(model);
        }

        #endregion



    }
}