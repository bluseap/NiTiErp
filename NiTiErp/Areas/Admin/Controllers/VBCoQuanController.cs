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
using System.Threading.Tasks;

namespace NiTiErp.Areas.Admin.Controllers
{
    public class VBCoQuanController : BaseController
    {
        private readonly IHostingEnvironment _hostingEnvironment;
        private readonly NiTiErp.Application.Interfaces.IUserService _userService;
        private readonly IAuthorizationService _authorizationService;

        private readonly IVanBanCoQuanService _vanbancoquanService;

        public VBCoQuanController(IHostingEnvironment hostingEnvironment,
            NiTiErp.Application.Interfaces.IUserService userService,
            IAuthorizationService authorizationService,

            IVanBanCoQuanService vanbancoquanService
            )
        {
            _hostingEnvironment = hostingEnvironment;
            _userService = userService;
            _authorizationService = authorizationService;

            _vanbancoquanService = vanbancoquanService;
        }

        public IActionResult Index()
        {
            var username = User.GetSpecificClaim("UserName");
            var result = _authorizationService.AuthorizeAsync(User, "DANHMUCVANBANCOQUAN", Operations.Read);
            if (result.Result.Succeeded == false)
                return new RedirectResult("/homevanban/Index");

            return View();
        }

        #region AJAX API

        [HttpPost]
        public IActionResult AddUpdateVBCoQuan(VanBanCoQuanViewModel vanbancoquanVm)
        {
            if (!ModelState.IsValid)
            {
                IEnumerable<ModelError> allErrors = ModelState.Values.SelectMany(v => v.Errors);
                return new BadRequestObjectResult(allErrors);
            }
            else
            {
                var username = User.GetSpecificClaim("UserName");

                vanbancoquanVm.CreateBy = username;
                vanbancoquanVm.CreateDate = DateTime.Now;
                vanbancoquanVm.UpdateBy = username;
                vanbancoquanVm.UpdateDate = DateTime.Now;

                if (vanbancoquanVm.InsertVanBanCoQuanId == 1)
                {
                    var result = _authorizationService.AuthorizeAsync(User, "DANHMUCVANBANCOQUAN", Operations.Create); // nhap danh muc chi phi luong
                    if (result.Result.Succeeded == false)
                    {
                        return new ObjectResult(new GenericResult(false, "Bạn không đủ quyền thêm mới."));
                    }

                    var chiphi = _vanbancoquanService.VanBanCoQuanAUD(vanbancoquanVm, "InVanBanCoQuan");
                    return new OkObjectResult(chiphi);
                }
                else
                {
                    var result = _authorizationService.AuthorizeAsync(User, "DANHMUCVANBANCOQUAN", Operations.Update); //  nhap danh muc chi phi luong
                    if (result.Result.Succeeded == false)
                    {
                        return new ObjectResult(new GenericResult(false, "Bạn không đủ quyền sửa."));
                    }

                    var chiphi = _vanbancoquanService.VanBanCoQuanAUD(vanbancoquanVm, "UpVanBanCoQuan");
                    return new OkObjectResult(chiphi);
                }
            }
        }

        [HttpGet]
        public IActionResult VanBanCoQuanGetList()
        {
            var model = _vanbancoquanService.VanBanCoQuanGetList("", "", "", "VanBanCoQuanGetList");
            return new OkObjectResult(model);
        }

        [HttpGet]
        public IActionResult VanBanDienTuGetList()
        {
            var model = _vanbancoquanService.VanBanCoQuanGetList("", "", "", "VanBanDienTuGetList");
            return new OkObjectResult(model);
        }

        [HttpGet]
        public IActionResult GetListVBCoQuan(string keyword, int page, int pageSize)
        {
            
            var tukhoa = !string.IsNullOrEmpty(keyword) ? keyword : "%";

            var model = _vanbancoquanService.GetAllVanBanCoQuanPaging(tukhoa, "", tukhoa, 
                page, pageSize, 1, "", "GetAllVanBanCoQuan");

            return new OkObjectResult(model);
        }

        [HttpGet]
        public IActionResult GetVanBanCoQuanId(int vanbancoquanid)
        {           
            var model = _vanbancoquanService.GetAllVanBanCoQuanPaging("", "", "",
                1, 1000, vanbancoquanid, "", "GetVanBanCoQuanId");

            return new OkObjectResult(model);
        }

        #endregion AJAX API
    }
}