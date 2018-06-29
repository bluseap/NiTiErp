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
        private IHopDongService _hopdongService;

        public HopdongController(IHostingEnvironment hostingEnvironment,
            NiTiErp.Application.Interfaces.IUserService userService,
            IAuthorizationService authorizationService,

            IHopDongService hopdongService,
            IDieuKienTimService dieukientimService        )
        {
            _hostingEnvironment = hostingEnvironment;
            _userService = userService;
            _authorizationService = authorizationService;

            _hopdongService = hopdongService;
            _dieukientimService = dieukientimService;
        }

        public IActionResult Index()
        {
            return View();
        }

        #region AJAX API

        [HttpGet]
        public IActionResult GetListHopDong(string corporationId, string phongId, string keyword, int page,
            int pageSize, string hosoId, string hopdongId)
        {
            var khuvuc = !string.IsNullOrEmpty(corporationId) ? corporationId : "%";
            var phong = !string.IsNullOrEmpty(phongId) ? phongId : "%";
            var tukhoa = !string.IsNullOrEmpty(keyword) ? keyword : "%";

            var model = _hopdongService.GetAllHopDongPaging(khuvuc, phong, tukhoa, page, pageSize,
                hosoId, "", "", hopdongId, "GetAllHopDongTim");

            return new OkObjectResult(model);
        }

        #region Danh muc Hop dong nhan vien
        [HttpGet]
        public IActionResult DieuKienGetList()
        {          
            var model = _dieukientimService.DieuKienTimGetList("HopDongNhanVien", "", "", "BangDieuKienTimGetList");
            return new OkObjectResult(model);
        }

        #endregion

        #endregion

    }
}