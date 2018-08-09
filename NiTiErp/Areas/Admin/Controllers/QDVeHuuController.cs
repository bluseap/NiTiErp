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
    public class QDVeHuuController : BaseController
    {
        private readonly IHostingEnvironment _hostingEnvironment;
        private readonly NiTiErp.Application.Interfaces.IUserService _userService;
        private readonly IAuthorizationService _authorizationService;

        private readonly IQDNghiHuuService _qdnghihuuService;
        private readonly IChucVuNhanVienService _chucvunhanvienService;
        private readonly IPhongDanhMucService _phongdanhmucService;

        public QDVeHuuController(IHostingEnvironment hostingEnvironment,
            NiTiErp.Application.Interfaces.IUserService userService,
            IAuthorizationService authorizationService,

            IQDNghiHuuService qdnghihuuService,
            IChucVuNhanVienService chucvunhanvienService,
            IPhongDanhMucService phongdanhmucService
            )
        {
            _hostingEnvironment = hostingEnvironment;
            _userService = userService;
            _authorizationService = authorizationService;

            _qdnghihuuService = qdnghihuuService;
            _chucvunhanvienService = chucvunhanvienService;
            _phongdanhmucService = phongdanhmucService;

        }

        public IActionResult Index()
        {
            return View();
        }

        #region AJAX API

        public IActionResult AddUpdateQDBoNhiem(QDNghiHuuViewModel qdnghihuuVm)
        {
            if (!ModelState.IsValid)
            {
                IEnumerable<ModelError> allErrors = ModelState.Values.SelectMany(v => v.Errors);
                return new BadRequestObjectResult(allErrors);
            }
            else
            {
                var username = User.GetSpecificClaim("UserName");

                qdnghihuuVm.CreateBy = username;
                qdnghihuuVm.CreateDate = DateTime.Now;
                qdnghihuuVm.UpdateBy = username;
                qdnghihuuVm.UpdateDate = DateTime.Now;

                if (qdnghihuuVm.InsertqdvhId == 1)
                {
                    var result = _authorizationService.AuthorizeAsync(User, "QDNVNH", Operations.Create); // nhap qd bo nhiem
                    if (result.Result.Succeeded == false)
                    {
                        return new ObjectResult(new GenericResult(false, "Bạn không đủ quyền thêm mới."));
                    }

                    var qdnghihuu = _qdnghihuuService.QDNghiHuuAUD(qdnghihuuVm, "InBoNhiem");
                    return new OkObjectResult(qdnghihuu);
                }
                else
                {
                    var result = _authorizationService.AuthorizeAsync(User, "QDNVNH", Operations.Update); // qd bo nhiem
                    if (result.Result.Succeeded == false)
                    {
                        return new ObjectResult(new GenericResult(false, "Bạn không đủ quyền sửa."));
                    }

                    var qdnghihuu = _qdnghihuuService.QDNghiHuuAUD(qdnghihuuVm, "UpBoNhiem");
                    return new OkObjectResult(qdnghihuu);
                }
            }
        }

        [HttpGet]
        public IActionResult GetListVeHuu(string corporationId, string phongId, string keyword, int page, int pageSize)
        {
            var khuvuc = !string.IsNullOrEmpty(corporationId) ? corporationId : "%";
            var phong = !string.IsNullOrEmpty(phongId) ? phongId : "%";
            var tukhoa = !string.IsNullOrEmpty(keyword) ? keyword : "%";

            var model = _qdnghihuuService.GetAllNghiHuuPaging(khuvuc, phong, tukhoa, page, pageSize, "", "", "", "", "GetAllNghiHuuTim");

            return new OkObjectResult(model);
        }

        [HttpGet]
        public IActionResult GetBoNhiemId(string bonhiemId)
        {
            var model = _qdnghihuuService.GetAllNghiHuuPaging("", "", "", 1, 1000, "", "", "", bonhiemId, "GetAllNghiHuuId");

            return new OkObjectResult(model);
        }

        #endregion

    }
}