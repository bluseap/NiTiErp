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
    public class VBLinhVucController : BaseController
    {
        private readonly IHostingEnvironment _hostingEnvironment;
        private readonly NiTiErp.Application.Interfaces.IUserService _userService;
        private readonly IAuthorizationService _authorizationService;

        private readonly IVanBanLinhVucService _vanbanlinhvucService;

        public VBLinhVucController(IHostingEnvironment hostingEnvironment,
            NiTiErp.Application.Interfaces.IUserService userService,
            IAuthorizationService authorizationService,

            IVanBanLinhVucService vanbanlinhvucService
            )
        {
            _hostingEnvironment = hostingEnvironment;
            _userService = userService;
            _authorizationService = authorizationService;

            _vanbanlinhvucService = vanbanlinhvucService;
        }

        public IActionResult Index()
        {
            var username = User.GetSpecificClaim("UserName");
            var result = _authorizationService.AuthorizeAsync(User, "DANHMUCVANBANLINHVUC", Operations.Read);
            if (result.Result.Succeeded == false)
                return new RedirectResult("/homevanban/Index");

            return View();
        }

        #region AJAX API

        [HttpPost]
        public IActionResult AddUpdateVanBanLinhVuc(VanBanLinhVucViewModel vblvVm)
        {
            if (!ModelState.IsValid)
            {
                IEnumerable<ModelError> allErrors = ModelState.Values.SelectMany(v => v.Errors);
                return new BadRequestObjectResult(allErrors);
            }
            else
            {
                var username = User.GetSpecificClaim("UserName");

                vblvVm.CreateBy = username;
                vblvVm.CreateDate = DateTime.Now;
                vblvVm.UpdateBy = username;
                vblvVm.UpdateDate = DateTime.Now;

                if (vblvVm.InsertVanBanLinhVucId == 1)
                {
                    var result = _authorizationService.AuthorizeAsync(User, "DANHMUCVANBANLINHVUC", Operations.Create); // nhap danh muc van ban 
                    if (result.Result.Succeeded == false)
                    {
                        return new ObjectResult(new GenericResult(false, "Bạn không đủ quyền thêm mới."));
                    }

                    var vanbanlinhvuc = _vanbanlinhvucService.VanBanLinhVucAUD(vblvVm, "InVanBanLinhVuc");
                    return new OkObjectResult(vanbanlinhvuc);
                }
                else
                {
                    var result = _authorizationService.AuthorizeAsync(User, "DANHMUCVANBANLINHVUC", Operations.Update); //  nhap danh muc van ban 
                    if (result.Result.Succeeded == false)
                    {
                        return new ObjectResult(new GenericResult(false, "Bạn không đủ quyền sửa."));
                    }

                    var vanbanlinhvuc = _vanbanlinhvucService.VanBanLinhVucAUD(vblvVm, "UpVanBanLinhVuc");
                    return new OkObjectResult(vanbanlinhvuc);
                }
            }
        }

        [HttpPost]
        public IActionResult DeleteVanBanLinhVuc(VanBanLinhVucViewModel vblvVm)
        {
            if (!ModelState.IsValid)
            {
                IEnumerable<ModelError> allErrors = ModelState.Values.SelectMany(v => v.Errors);
                return new BadRequestObjectResult(allErrors);
            }
            else
            {
                if (vblvVm.InsertVanBanLinhVucId == 3)
                {
                    var result = _authorizationService.AuthorizeAsync(User, "DANHMUCVANBANLINHVUC", Operations.Delete); // xoa 
                    if (result.Result.Succeeded == false)
                    {
                        return new ObjectResult(new GenericResult(false, "Bạn không đủ quyền xóa."));
                    }

                    vblvVm.CreateDate = DateTime.Now;
                    vblvVm.UpdateDate = DateTime.Now;

                    var vanbanlinhvuc = _vanbanlinhvucService.VanBanLinhVucAUD(vblvVm, "DelVanBanLinhVuc");

                    return new OkObjectResult(vanbanlinhvuc);
                }
                else
                {
                    return new OkObjectResult(vblvVm);
                }
            }
        }

        [HttpGet]
        public IActionResult GetVanBanLinhVucId(int vanbanlinhvucId)
        {
            var model = _vanbanlinhvucService.GetAllVanBanLinhVucPaging("", "", 1, 100, vanbanlinhvucId, "", "GetVanBanLinhVucId");

            return new OkObjectResult(model);
        }

        [HttpGet]
        public IActionResult GetListVanBanLinhVuc(string keyword, int page, int pageSize)
        {
            var ngayht = DateTime.Now;
            var namht = DateTime.Now.Year;
            //var makhuvuc = !string.IsNullOrEmpty(corporationId) ? corporationId : "%";
            var tukhoa = !string.IsNullOrEmpty(keyword) ? keyword : "%";

            var model = _vanbanlinhvucService.GetAllVanBanLinhVucPaging("", tukhoa, page, pageSize, 0, "", "GetAllVanBanLinhVuc");

            return new OkObjectResult(model);
        }

        [HttpGet]
        public IActionResult VanBanKhanGetList()
        {
            var model = _vanbanlinhvucService.VanBanLinhVucGetList("", "", "", "VanBanLinhVucGetList");
            return new OkObjectResult(model);
        }

        #endregion AJAX API
    }
}