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

        private readonly ILuongDotInKyService _luongdotinkyService;
        private readonly IDieuKienTimService _dieukientimService;
        private readonly ILuongKyHieuService _luongkyhieuService;
        private readonly ILuongBaoHiemService _luongbaohiemService;

        private readonly Application.Dapper.Interfaces.ICorporationService _corporationsService;

        public CongNgayController(IHostingEnvironment hostingEnvironment,
            NiTiErp.Application.Interfaces.IUserService userService,
            IAuthorizationService authorizationService,

            ILuongDotInKyService luongdotinkyService,
            IDieuKienTimService dieukientimService,
            ILuongKyHieuService luongkyhieuService,
            ILuongBaoHiemService luongbaohiemService,
            Application.Dapper.Interfaces.ICorporationService corporationsService
            )
        {
            _hostingEnvironment = hostingEnvironment;
            _userService = userService;
            _authorizationService = authorizationService;

            _luongdotinkyService = luongdotinkyService;
            _dieukientimService = dieukientimService;
            _luongkyhieuService = luongkyhieuService;
            _luongbaohiemService = luongbaohiemService;

            _corporationsService = corporationsService;
        }

        public IActionResult Index()
        {
            return View();
        }

        #region AJAX API

        [HttpPost]
        public IActionResult AddUpdateLuongBaoHiem(LuongBaoHiemViewModel luongbaohiemVm)
        {
            if (!ModelState.IsValid)
            {
                IEnumerable<ModelError> allErrors = ModelState.Values.SelectMany(v => v.Errors);
                return new BadRequestObjectResult(allErrors);
            }
            else
            {
                var username = User.GetSpecificClaim("UserName");

                luongbaohiemVm.CreateBy = username;
                luongbaohiemVm.CreateDate = DateTime.Now;
                luongbaohiemVm.UpdateBy = username;
                luongbaohiemVm.UpdateDate = DateTime.Now;

                if (luongbaohiemVm.InsertLuongBaoHiemId == 2 )
                {
                    var result = _authorizationService.AuthorizeAsync(User, "LUONGNHAP", Operations.Update); // Cap nhat luong bao hiem nhan vien cham cong ngay
                    if (result.Result.Succeeded == false)
                    {
                        return new ObjectResult(new GenericResult(false, "Bạn không đủ quyền thêm mới."));
                    }                   

                    var luongbaohiem = _luongbaohiemService.LuongBaoHiemAUD(luongbaohiemVm, "UpBangChamCongNgay");
                    return new OkObjectResult(luongbaohiem);
                
                }
                else
                {
                    return new OkObjectResult(luongbaohiemVm);
                }

            }
        }

        public IActionResult LuongBaoHiemGetList(int nam, int thang, string corporationId, string phongId,
            string chucvuId, string keyword, int page, int pageSize, string dotinluong)
        {
            var khuvuc = !string.IsNullOrEmpty(corporationId) ? corporationId : "%";
            var phong = !string.IsNullOrEmpty(phongId) ? phongId : "%";
            var tukhoa = !string.IsNullOrEmpty(keyword) ? keyword : "%";
            var chucvu = !string.IsNullOrEmpty(chucvuId) ? chucvuId : "%";

            var hosoid = new Guid();

            var model = _luongbaohiemService.LuongBaoHiemGetList(1, nam, thang, khuvuc, phong, 
                chucvuId, hosoid, "", "", "", dotinluong, tukhoa, "GetListLuongBaoHiemKy");

            return new OkObjectResult(model);
        }

        public IActionResult LuongBaoHiemGetListId(Int64 Id, int nam, int thang, string corporationId, string phongId,
            string chucvuId, string keyword, int page, int pageSize)
        {
            var khuvuc = !string.IsNullOrEmpty(corporationId) ? corporationId : "%";
            var phong = !string.IsNullOrEmpty(phongId) ? phongId : "%";
            var tukhoa = !string.IsNullOrEmpty(keyword) ? keyword : "%";
            var chucvu = !string.IsNullOrEmpty(chucvuId) ? chucvuId : "%";

            var hosoid = new Guid();

            var model = _luongbaohiemService.LuongBaoHiemGetList(Id, nam, thang, khuvuc, phong,
                chucvuId, hosoid, "", "", "", "", keyword, "GetLuongBaoHiemId");

            return new OkObjectResult(model);
        }

        #region Danh muc Hop dong nhan vien

        [HttpGet]
        public IActionResult LuongKyHieuGetList()
        {
            var model = _luongkyhieuService.LuongKyHieuGetList("LuongKyHieu", "", "", "KyHieuChamCongGetList");
            return new OkObjectResult(model);
        }

        [HttpGet]
        public IActionResult DieuKienGetList()
        {
            var model = _dieukientimService.DieuKienTimGetList("LuongBaoHiem", "", "", "BangDieuKienTimGetList");
            return new OkObjectResult(model);
        }

        [HttpGet]
        public IActionResult LuongDotInGetList(string makv)
        {
            var model = _luongdotinkyService.LuongDotInKyGetList(makv, "", "", "LuongDotInKyGetList");
            return new OkObjectResult(model);
        }

        #endregion

        #endregion



    }
}