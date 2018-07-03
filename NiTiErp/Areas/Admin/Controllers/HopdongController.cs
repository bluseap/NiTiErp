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

        #region Hop dong

        [HttpPost]
        public IActionResult AddUpdateHopDong(HopDongViewModel hopdongVm)
        {
            if (!ModelState.IsValid)
            {
                IEnumerable<ModelError> allErrors = ModelState.Values.SelectMany(v => v.Errors);
                return new BadRequestObjectResult(allErrors);
            }
            else
            {
                var username = User.GetSpecificClaim("UserName");

                hopdongVm.CreateBy = username;
                hopdongVm.CreateDate = DateTime.Now;
                hopdongVm.UpdateBy = username;
                hopdongVm.UpdateDate = DateTime.Now;

                if ((hopdongVm.InsertUpdateId == 0 && hopdongVm.InsertUpdateHopDongId == 0) ||
                    (hopdongVm.InsertUpdateId == 1 && hopdongVm.InsertUpdateHopDongId == 0))
                {
                    var result = _authorizationService.AuthorizeAsync(User, "NLLNV", Operations.Create); // nhap nhan vien
                    if (result.Result.Succeeded == false)
                    {
                        return new ObjectResult(new GenericResult(false, "Bạn không đủ quyền thêm mới."));
                    }

                    hopdongVm.Id = "1";

                    var hopdong = _hopdongService.HopDongAUD(hopdongVm, "InHopDong");
                    return new OkObjectResult(hopdong);
                } // khong co sua hop dong, nam trong muc Nhap Hop Dong Nhan Vien
                else if (hopdongVm.InsertUpdateId == 1 && hopdongVm.InsertUpdateHopDongId == 1)
                {
                    var result = _authorizationService.AuthorizeAsync(User, "NLLNV", Operations.Update); // nhap nhan vien
                    if (result.Result.Succeeded == false)
                    {
                        return new ObjectResult(new GenericResult(false, "Bạn không đủ quyền sửa."));
                    }

                    var trinhdo = _hopdongService.HopDongAUD(hopdongVm, "UpHopDong");
                    return new OkObjectResult(trinhdo);
                }
                else
                {
                    return new OkObjectResult(hopdongVm);
                }
            }
        }

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

        [HttpGet]
        public IActionResult GetAllHopDongId(string hopdongId)
        {
            var model = _hopdongService.GetAllHopDongPaging("", "", "", 1, 10,
                "", "", "", hopdongId, "GetAllHopDongId");

            return new OkObjectResult(model);
        }

        [HttpGet]
        public IActionResult GetAllHoSoHopDongId(string hosoId)
        {
            var model = _hopdongService.GetAllHopDongPaging("", "", "", 1, 10,
                hosoId, "", "", "", "GetAllHoSoHopDongId");

            return new OkObjectResult(model);
        }

        #endregion

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