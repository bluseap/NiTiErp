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
    public class HeSoLuongController : BaseController
    {
        private readonly IHostingEnvironment _hostingEnvironment;
        private readonly NiTiErp.Application.Interfaces.IUserService _userService;
        private readonly IAuthorizationService _authorizationService;

        private readonly IHeSoLuongService _hesoluongService;
        private readonly IMucLuongToiThieuService _mucluongtoithieu;

        public HeSoLuongController(IHostingEnvironment hostingEnvironment,
            NiTiErp.Application.Interfaces.IUserService userService,
            IAuthorizationService authorizationService,

            IHeSoLuongService hesoluongService,
            IMucLuongToiThieuService mucluongtoithieu
            )
        {
            _hostingEnvironment = hostingEnvironment;
            _userService = userService;
            _authorizationService = authorizationService;

            _hesoluongService = hesoluongService;
            _mucluongtoithieu = mucluongtoithieu;
        }

        public IActionResult Index()
        {
            return View();
        }

        #region AJAX API

        [HttpGet]
        public IActionResult HeSoLuongKhuVuc(string corporationId, string phongId, string keyword, int page,
            int pageSize, string hosoId, string chucVuId)
        {
            var khuvuc = !string.IsNullOrEmpty(corporationId) ? corporationId : "%";
            var phong = !string.IsNullOrEmpty(phongId) ? phongId : "%";
            var tukhoa = !string.IsNullOrEmpty(keyword) ? keyword : "%";
            var chucvu = !string.IsNullOrEmpty(chucVuId) ? chucVuId : "%";

            var model = _hesoluongService.HeSoLuongGetList( khuvuc, phong, keyword, "", "", "", chucvu, "", "", "GetListHeSoLuongKhuVuc");

            return new OkObjectResult(model);
        }

        public IActionResult PostHeSoLuongKhuVuc(string corporationId, string phongId, string keyword, int page,
            int pageSize, string hosoId, string chucVuId)
        {
            var khuvuc = !string.IsNullOrEmpty(corporationId) ? corporationId : "%";
            var phong = !string.IsNullOrEmpty(phongId) ? phongId : "%";
            var tukhoa = !string.IsNullOrEmpty(keyword) ? keyword : "%";
            var chucvu = !string.IsNullOrEmpty(chucVuId) ? chucVuId : "%";

            var model = _hesoluongService.HeSoLuongGetList(khuvuc, phong, keyword, "", "", "", chucvu, "", "", "GetListHeSoLuongKhuVuc");

            return new OkObjectResult(model);
        }

        [HttpGet]
        public IActionResult GetAllMucLuongId(string mucluongId)
        {           
            var model = _mucluongtoithieu.GetAllMucLuongPaging("", "", "", 1, 1000, "", "", "", mucluongId, "GetMucLuongTTId");

            return new OkObjectResult(model);
        }

        #endregion


    }
}