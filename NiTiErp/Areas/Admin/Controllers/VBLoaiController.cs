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
    public class VBLoaiController : BaseController
    {
        private readonly IHostingEnvironment _hostingEnvironment;
        private readonly NiTiErp.Application.Interfaces.IUserService _userService;
        private readonly IAuthorizationService _authorizationService;

        private readonly IVanBanLoaiService _vanbanloaiService;

        public VBLoaiController(IHostingEnvironment hostingEnvironment,
            NiTiErp.Application.Interfaces.IUserService userService,
            IAuthorizationService authorizationService,

            IVanBanLoaiService vanbanloaiService
            )
        {
            _hostingEnvironment = hostingEnvironment;
            _userService = userService;
            _authorizationService = authorizationService;

            _vanbanloaiService = vanbanloaiService;
        }

        public IActionResult Index()
        {
            var username = User.GetSpecificClaim("UserName");
            var result = _authorizationService.AuthorizeAsync(User, "DANHMUCVANBANLOAI", Operations.Read);
            if (result.Result.Succeeded == false)
                return new RedirectResult("/homevanban/Index");

            return View();
        }

        #region AJAX API

        [HttpPost]
        public IActionResult AddUpdateVanBanLoai(VanBanLoaiViewModel vblVm)
        {
            if (!ModelState.IsValid)
            {
                IEnumerable<ModelError> allErrors = ModelState.Values.SelectMany(v => v.Errors);
                return new BadRequestObjectResult(allErrors);
            }
            else
            {
                var username = User.GetSpecificClaim("UserName");

                vblVm.CreateBy = username;
                vblVm.CreateDate = DateTime.Now;
                vblVm.UpdateBy = username;
                vblVm.UpdateDate = DateTime.Now;

                if (vblVm.InsertVanBanLoaiId == 1)
                {
                    var result = _authorizationService.AuthorizeAsync(User, "DANHMUCVANBANLOAI", Operations.Create); // nhap danh muc van ban phoi hop
                    if (result.Result.Succeeded == false)
                    {
                        return new ObjectResult(new GenericResult(false, "Bạn không đủ quyền thêm mới."));
                    }

                    var vanbanloai = _vanbanloaiService.VanBanLoaiAUD(vblVm, "InVanBanLoai");
                    return new OkObjectResult(vanbanloai);
                }
                else
                {
                    var result = _authorizationService.AuthorizeAsync(User, "DANHMUCVANBANLOAI", Operations.Update); //  nhap danh muc van ban phoi hop
                    if (result.Result.Succeeded == false)
                    {
                        return new ObjectResult(new GenericResult(false, "Bạn không đủ quyền sửa."));
                    }

                    var vanbanloai = _vanbanloaiService.VanBanLoaiAUD(vblVm, "UpVanBanLoai");
                    return new OkObjectResult(vanbanloai);
                }
            }
        }

        [HttpPost]
        public IActionResult DeleteVanBanLoai(VanBanLoaiViewModel vblVm)
        {
            if (!ModelState.IsValid)
            {
                IEnumerable<ModelError> allErrors = ModelState.Values.SelectMany(v => v.Errors);
                return new BadRequestObjectResult(allErrors);
            }
            else
            {
                if (vblVm.InsertVanBanLoaiId == 3)
                {
                    var result = _authorizationService.AuthorizeAsync(User, "DANHMUCVANBANLOAI", Operations.Delete); // xoa 
                    if (result.Result.Succeeded == false)
                    {
                        return new ObjectResult(new GenericResult(false, "Bạn không đủ quyền xóa."));
                    }

                    vblVm.CreateDate = DateTime.Now;
                    vblVm.UpdateDate = DateTime.Now;

                    var vanbanloai = _vanbanloaiService.VanBanLoaiAUD(vblVm, "DelVanBanLoai");

                    return new OkObjectResult(vanbanloai);
                }
                else
                {
                    return new OkObjectResult(vblVm);
                }
            }
        }

        [HttpGet]
        public IActionResult GetVanBanLoaiId(int vanbanloaiId)
        {
            var model = _vanbanloaiService.GetAllVanBanLoaiPaging("", "", 1, 100, vanbanloaiId, "", "GetVanBanLoaiId");

            return new OkObjectResult(model);
        }

        [HttpGet]
        public IActionResult GetListVanBanLoai(string keyword, int page, int pageSize)
        {
            var ngayht = DateTime.Now;
            var namht = DateTime.Now.Year;
            //var makhuvuc = !string.IsNullOrEmpty(corporationId) ? corporationId : "%";
            var tukhoa = !string.IsNullOrEmpty(keyword) ? keyword : "%";

            var model = _vanbanloaiService.GetAllVanBanLoaiPaging("", tukhoa, page, pageSize, 0, "", "GetAllVanBanLoai");

            return new OkObjectResult(model);
        }

        [HttpGet]
        public IActionResult VanBanLoaiGetList()
        {
            var model = _vanbanloaiService.VanBanLoaiGetList("", "", "", "VanBanLoaiGetList");
            return new OkObjectResult(model);
        }

        #endregion AJAX API
    }
}