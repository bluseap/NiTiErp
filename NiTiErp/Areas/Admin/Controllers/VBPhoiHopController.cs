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
    public class VBPhoiHopController : BaseController
    {
        private readonly IHostingEnvironment _hostingEnvironment;
        private readonly NiTiErp.Application.Interfaces.IUserService _userService;
        private readonly IAuthorizationService _authorizationService;

        private readonly IVanBanPHXLService _vanbanphxlService;

        public VBPhoiHopController(IHostingEnvironment hostingEnvironment,
            NiTiErp.Application.Interfaces.IUserService userService,
            IAuthorizationService authorizationService,

           IVanBanPHXLService vanbanphxlService
            )
        {
            _hostingEnvironment = hostingEnvironment;
            _userService = userService;
            _authorizationService = authorizationService;

            _vanbanphxlService = vanbanphxlService;
        }

        public IActionResult Index()
        {
            var username = User.GetSpecificClaim("UserName");
            var result = _authorizationService.AuthorizeAsync(User, "DANHMUCVANBANPHOIHOP", Operations.Read);
            if (result.Result.Succeeded == false)
                return new RedirectResult("/homevanban/Index");

            return View();
        }

        #region AJAX API

        [HttpPost]
        public IActionResult AddUpdateVBPhoiHop(VanBanPHXLViewModel vbphxlVm)
        {
            if (!ModelState.IsValid)
            {
                IEnumerable<ModelError> allErrors = ModelState.Values.SelectMany(v => v.Errors);
                return new BadRequestObjectResult(allErrors);
            }
            else
            {
                var username = User.GetSpecificClaim("UserName");

                vbphxlVm.CreateBy = username;
                vbphxlVm.CreateDate = DateTime.Now;
                vbphxlVm.UpdateBy = username;
                vbphxlVm.UpdateDate = DateTime.Now;

                if (vbphxlVm.InsertVBPHXLId == 1)
                {
                    var result = _authorizationService.AuthorizeAsync(User, "DANHMUCVANBANPHOIHOP", Operations.Create); // nhap danh muc van ban phoi hop
                    if (result.Result.Succeeded == false)
                    {
                        return new ObjectResult(new GenericResult(false, "Bạn không đủ quyền thêm mới."));
                    }

                    var vanbanphxl = _vanbanphxlService.VanBanPHXLAUD(vbphxlVm, "InVanBanPHXL");
                    return new OkObjectResult(vanbanphxl);
                }
                else
                {
                    var result = _authorizationService.AuthorizeAsync(User, "DANHMUCVANBANPHOIHOP", Operations.Update); //  nhap danh muc van ban phoi hop
                    if (result.Result.Succeeded == false)
                    {
                        return new ObjectResult(new GenericResult(false, "Bạn không đủ quyền sửa."));
                    }

                    var vanbanphxl = _vanbanphxlService.VanBanPHXLAUD(vbphxlVm, "UpVanBanPHXL");
                    return new OkObjectResult(vanbanphxl);
                }
            }
        }

        [HttpPost]
        public IActionResult DeleteVBPhoiHop(VanBanPHXLViewModel vbphxlVm)
        {
            if (!ModelState.IsValid)
            {
                IEnumerable<ModelError> allErrors = ModelState.Values.SelectMany(v => v.Errors);
                return new BadRequestObjectResult(allErrors);
            }
            else
            {
                if (vbphxlVm.InsertVBPHXLId == 3)
                {
                    var result = _authorizationService.AuthorizeAsync(User, "DANHMUCVANBANPHOIHOP", Operations.Delete); // xoa 
                    if (result.Result.Succeeded == false)
                    {
                        return new ObjectResult(new GenericResult(false, "Bạn không đủ quyền xóa."));
                    }

                    vbphxlVm.CreateDate = DateTime.Now;
                    vbphxlVm.UpdateDate = DateTime.Now;                  

                    var quanlyvanban = _vanbanphxlService.VanBanPHXLAUD(vbphxlVm, "DelVanBanPHXL");

                    return new OkObjectResult(quanlyvanban);
                }
                else
                {
                    return new OkObjectResult(vbphxlVm);
                }
            }
        }

        [HttpGet]
        public IActionResult GetVBPhoiHopId(int vanbanphoihopId)
        {            
            var model = _vanbanphxlService.GetAllVanBanPHXLPaging("", "", 1, 100, vanbanphoihopId, "", "GetVanBanPHXLId");

            return new OkObjectResult(model);
        }

        [HttpGet]
        public IActionResult GetListVBPhoiHop(string keyword, int page, int pageSize)
        {
            var ngayht = DateTime.Now;
            var namht = DateTime.Now.Year;
            //var makhuvuc = !string.IsNullOrEmpty(corporationId) ? corporationId : "%";
            var tukhoa = !string.IsNullOrEmpty(keyword) ? keyword : "%";

            var model = _vanbanphxlService.GetAllVanBanPHXLPaging("", tukhoa, page, pageSize, 0, "", "GetAllVanBanPHXL");

            return new OkObjectResult(model);
        }

        #endregion


    }
}