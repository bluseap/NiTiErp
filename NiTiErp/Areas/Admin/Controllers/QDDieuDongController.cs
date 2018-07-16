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
    public class QDDieuDongController : BaseController
    {
        private readonly IHostingEnvironment _hostingEnvironment;
        private readonly NiTiErp.Application.Interfaces.IUserService _userService;
        private readonly IAuthorizationService _authorizationService;

        private readonly IQDDieuDongService _qddieudongService;
        private readonly IChucVuNhanVienService _chucvunhanvienService;
        private readonly IPhongDanhMucService _phongdanhmucService;

        public QDDieuDongController(IHostingEnvironment hostingEnvironment,
            NiTiErp.Application.Interfaces.IUserService userService,
            IAuthorizationService authorizationService,

            IQDDieuDongService qddieudongService,
            IChucVuNhanVienService chucvunhanvienService,
            IPhongDanhMucService phongdanhmucService
            )
        {
            _hostingEnvironment = hostingEnvironment;
            _userService = userService;
            _authorizationService = authorizationService;

            _qddieudongService = qddieudongService;
            _chucvunhanvienService = chucvunhanvienService;
            _phongdanhmucService = phongdanhmucService;

        }

        public IActionResult Index()
        {
            return View();
        }

        #region AJAX API

        public IActionResult AddUpdateQDDieuDong(QDDieuDongViewModel qddieudongVm)
        {
            if (!ModelState.IsValid)
            {
                IEnumerable<ModelError> allErrors = ModelState.Values.SelectMany(v => v.Errors);
                return new BadRequestObjectResult(allErrors);
            }
            else
            {
                var username = User.GetSpecificClaim("UserName");

                qddieudongVm.CreateBy = username;
                qddieudongVm.CreateDate = DateTime.Now;
                qddieudongVm.UpdateBy = username;
                qddieudongVm.UpdateDate = DateTime.Now;

                if (qddieudongVm.InsertqdddId == 1)
                {
                    var result = _authorizationService.AuthorizeAsync(User, "QDNVDD", Operations.Create); // nhap qd dieu dong
                    if (result.Result.Succeeded == false)
                    {
                        return new ObjectResult(new GenericResult(false, "Bạn không đủ quyền thêm mới."));
                    }

                    var qddieudong = _qddieudongService.QDDieuDongAUD(qddieudongVm, "InDieuDong");
                    return new OkObjectResult(qddieudong);
                }
                else
                {
                    var result = _authorizationService.AuthorizeAsync(User, "QDNVDD", Operations.Update); // qd dieu dong
                    if (result.Result.Succeeded == false)
                    {
                        return new ObjectResult(new GenericResult(false, "Bạn không đủ quyền sửa."));
                    }

                    var qddieudong = _qddieudongService.QDDieuDongAUD(qddieudongVm, "UpDieuDong");
                    return new OkObjectResult(qddieudong);
                }
            }
        }

        [HttpGet]
        public IActionResult GetListDieuDong(string corporationId, string phongId, string keyword, int page, int pageSize)
        {
            var khuvuc = !string.IsNullOrEmpty(corporationId) ? corporationId : "%";
            var phong = !string.IsNullOrEmpty(phongId) ? phongId : "%";
            var tukhoa = !string.IsNullOrEmpty(keyword) ? keyword : "%";

            var model = _qddieudongService.GetAllDieuDongPaging(khuvuc, phong, tukhoa, page, pageSize, "", "", "", "", "GetAllDieuDongTim");

            return new OkObjectResult(model);
        }

        [HttpGet]
        public IActionResult GetDieuDongId(string dieudongId)
        {
            var model = _qddieudongService.GetAllDieuDongPaging("", "", "", 1, 1000, "", "", "", dieudongId, "GetAllDieuDongId");

            return new OkObjectResult(model);
        }

        #endregion

        #region Danh muc

        [HttpGet]
        public IActionResult GetListPhong()
        {
            var model = _phongdanhmucService.PhongDanhMucGetList("", "", "", "GetListPhong");
            return new OkObjectResult(model);
        }

        [HttpGet]
        public IActionResult ChucVuNhanVienGetList()
        {
            var model = _chucvunhanvienService.ChucVuNhanVienGetList("", "", "", "ChucVuNhanVienGetListAll");
            return new OkObjectResult(model);
        }

        [HttpGet]
        public IActionResult ChucVuKhuVucGetList(string makv)
        {
            var model = _chucvunhanvienService.ChucVuNhanVienGetList(makv, "", "", "ChucVuNhanVienGetList");
            return new OkObjectResult(model);
        }

        #endregion

    }
}