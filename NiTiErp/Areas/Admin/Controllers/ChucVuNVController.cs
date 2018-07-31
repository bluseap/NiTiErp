using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using NiTiErp.Application.Dapper.Interfaces;
using NiTiErp.Application.Dapper.ViewModels;
using NiTiErp.Authorization;
using NiTiErp.Extensions;
using NiTiErp.Utilities.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;

namespace NiTiErp.Areas.Admin.Controllers
{
    public class ChucVuNVController : BaseController
    {
        private readonly IHostingEnvironment _hostingEnvironment;
        private readonly NiTiErp.Application.Interfaces.IUserService _userService;
        private readonly IAuthorizationService _authorizationService;

        private readonly IChucDanhService _chucdanhService;
        private readonly IChucVuNhanVienService _chucvunhanvienService;

        public ChucVuNVController(IHostingEnvironment hostingEnvironment,
            NiTiErp.Application.Interfaces.IUserService userService,
            IAuthorizationService authorizationService,

            IChucDanhService chucdanhService,
            IChucVuNhanVienService chucvunhanvienService
            )
        {
            _hostingEnvironment = hostingEnvironment;
            _userService = userService;
            _authorizationService = authorizationService;

            _chucdanhService = chucdanhService;
            _chucvunhanvienService = chucvunhanvienService;
        }

        public IActionResult Index()
        {
            return View();
        }

        #region AJAX API

        public IActionResult AddUpdateDMChucVu(ChucVuNhanVienViewModel chucvunhanvienVm)
        {
            if (!ModelState.IsValid)
            {
                IEnumerable<ModelError> allErrors = ModelState.Values.SelectMany(v => v.Errors);
                return new BadRequestObjectResult(allErrors);
            }
            else
            {
                var username = User.GetSpecificClaim("UserName");

                chucvunhanvienVm.CreateBy = username;
                chucvunhanvienVm.CreateDate = DateTime.Now;
                chucvunhanvienVm.UpdateBy = username;
                chucvunhanvienVm.UpdateDate = DateTime.Now;

                if (chucvunhanvienVm.InsertchucvunvId == 1)
                {
                    var result = _authorizationService.AuthorizeAsync(User, "DMCHUCVUNV", Operations.Create); // nhap danh muc chuc vu nhav vien
                    if (result.Result.Succeeded == false)
                    {
                        return new ObjectResult(new GenericResult(false, "Bạn không đủ quyền thêm mới."));
                    }

                    var chucvu = _chucvunhanvienService.ChucVuNhanVienAUD(chucvunhanvienVm, "InChucVuNhanVien");
                    return new OkObjectResult(chucvu);
                }
                else
                {
                    var result = _authorizationService.AuthorizeAsync(User, "DMCHUCVUNV", Operations.Update); //
                    if (result.Result.Succeeded == false)
                    {
                        return new ObjectResult(new GenericResult(false, "Bạn không đủ quyền sửa."));
                    }

                    var chucvu = _chucvunhanvienService.ChucVuNhanVienAUD(chucvunhanvienVm, "UpChucVuNhanVien");
                    return new OkObjectResult(chucvu);
                }
            }
        }

        [HttpGet]
        public IActionResult GetListChucVuPaging(string corporationId, string phongId, string keyword, int page,
            int pageSize, string hosoId)
        {
            var khuvuc = !string.IsNullOrEmpty(corporationId) ? corporationId : "%";
            var phong = !string.IsNullOrEmpty(phongId) ? phongId : "%";
            var tukhoa = !string.IsNullOrEmpty(keyword) ? keyword : "%";

            var model = _chucvunhanvienService.GetAllChucVuPaging(khuvuc, phong, tukhoa, page, pageSize,
                hosoId, "", "", "", "GetListChucVuMaKV");

            return new OkObjectResult(model);
        }

        [HttpGet]
        public IActionResult GetChucVudmId(string chucvuId)
        {
            var model = _chucvunhanvienService.GetAllChucVuPaging("", "", "", 1, 10,
                "", "", "", chucvuId, "GetChucVuId");

            return new OkObjectResult(model);
        }

        [HttpGet]
        public IActionResult ChucDanhGetList()
        {
            var model = _chucdanhService.ChucDanhGetList("", "", "", "ChucDanhGetList");

            return new OkObjectResult(model);
        }

        #endregion AJAX API
    }
}