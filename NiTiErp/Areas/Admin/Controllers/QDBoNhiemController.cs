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
    public class QDBoNhiemController : BaseController
    {
        private readonly IHostingEnvironment _hostingEnvironment;
        private readonly NiTiErp.Application.Interfaces.IUserService _userService;
        private readonly IAuthorizationService _authorizationService;

        private readonly IQDBoNhiemService _qdbonhiemService;
        private readonly IChucVuNhanVienService _chucvunhanvienService;
        private readonly IPhongDanhMucService _phongdanhmucService;

        public QDBoNhiemController(IHostingEnvironment hostingEnvironment,
            NiTiErp.Application.Interfaces.IUserService userService,
            IAuthorizationService authorizationService,

            IQDBoNhiemService qdbonhiemService,
            IChucVuNhanVienService chucvunhanvienService,
            IPhongDanhMucService phongdanhmucService            
            )
        {
            _hostingEnvironment = hostingEnvironment;
            _userService = userService;
            _authorizationService = authorizationService;

            _qdbonhiemService = qdbonhiemService;
            _chucvunhanvienService = chucvunhanvienService;
            _phongdanhmucService = phongdanhmucService;

        }

        public IActionResult Index()
        {
            return View();
        }

        #region AJAX API

        public IActionResult AddUpdateQDBoNhiem(QDBoNhiemViewModel qdbonhiemVm)
        {
            if (!ModelState.IsValid)
            {
                IEnumerable<ModelError> allErrors = ModelState.Values.SelectMany(v => v.Errors);
                return new BadRequestObjectResult(allErrors);
            }
            else
            {
                var username = User.GetSpecificClaim("UserName");

                qdbonhiemVm.CreateBy = username;
                qdbonhiemVm.CreateDate = DateTime.Now;
                qdbonhiemVm.UpdateBy = username;
                qdbonhiemVm.UpdateDate = DateTime.Now;

                if (qdbonhiemVm.InsertqdnnId == 1)
                {
                    var result = _authorizationService.AuthorizeAsync(User, "QDNVBN", Operations.Create); // nhap qd bo nhiem
                    if (result.Result.Succeeded == false)
                    {
                        return new ObjectResult(new GenericResult(false, "Bạn không đủ quyền thêm mới."));
                    }

                    var qdbonhiem = _qdbonhiemService.QDBoNhiemAUD(qdbonhiemVm, "InBoNhiem");
                    return new OkObjectResult(qdbonhiem);
                }
                else
                {
                    var result = _authorizationService.AuthorizeAsync(User, "QDNVBN", Operations.Update); // qd bo nhiem
                    if (result.Result.Succeeded == false)
                    {
                        return new ObjectResult(new GenericResult(false, "Bạn không đủ quyền sửa."));
                    }

                    var qdbonhiem = _qdbonhiemService.QDBoNhiemAUD(qdbonhiemVm, "UpBoNhiem");
                    return new OkObjectResult(qdbonhiem);
                }
            }
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