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
    public class VBDiDMSoController : BaseController
    {
        private readonly IHostingEnvironment _hostingEnvironment;
        private readonly NiTiErp.Application.Interfaces.IUserService _userService;
        private readonly IAuthorizationService _authorizationService;

        private readonly IVanBanDiSoService _vanbandisoService;

        public VBDiDMSoController(IHostingEnvironment hostingEnvironment,
            NiTiErp.Application.Interfaces.IUserService userService,
            IAuthorizationService authorizationService,

           IVanBanDiSoService vanbandisoService
            )
        {
            _hostingEnvironment = hostingEnvironment;
            _userService = userService;
            _authorizationService = authorizationService;

            _vanbandisoService = vanbandisoService;
        }

        public IActionResult Index()
        {
            var username = User.GetSpecificClaim("UserName");
            var result = _authorizationService.AuthorizeAsync(User, "VANBANDISO", Operations.Read);
            if (result.Result.Succeeded == false)
                return new RedirectResult("/homevanban/Index");

            return View();
        }

        #region AJAX API

        public IActionResult AddUpdateVanBanDiDMSo(VanBanDiSoViewModel vanbandisoVm)
        {
            if (!ModelState.IsValid)
            {
                IEnumerable<ModelError> allErrors = ModelState.Values.SelectMany(v => v.Errors);
                return new BadRequestObjectResult(allErrors);
            }
            else
            {
                var username = User.GetSpecificClaim("UserName");

                vanbandisoVm.CreateBy = username;
                vanbandisoVm.CreateDate = DateTime.Now;
                vanbandisoVm.UpdateBy = username;
                vanbandisoVm.UpdateDate = DateTime.Now;               

                if (vanbandisoVm.InsertVanBanDiSoId == 1)
                {
                    var result = _authorizationService.AuthorizeAsync(User, "VANBANDISO", Operations.Create); // nhap van ban den
                    if (result.Result.Succeeded == false)
                    {
                        return new ObjectResult(new GenericResult(false, "Bạn không đủ quyền thêm mới."));
                    }

                    var vanbandiso = _vanbandisoService.VanBanDiSoAUD(vanbandisoVm, "InVanBanDiSo");

                    return new OkObjectResult(vanbandiso);
                }
                else
                {
                    var result = _authorizationService.AuthorizeAsync(User, "VANBANDISO", Operations.Update); //
                    if (result.Result.Succeeded == false)
                    {
                        return new ObjectResult(new GenericResult(false, "Bạn không đủ quyền sửa."));
                    }

                    var vanbandiso = _vanbandisoService.VanBanDiSoAUD(vanbandisoVm, "UpVanBanDiSo");
                    return new OkObjectResult(vanbandiso);
                }
            }
        }

        [HttpPost]
        public IActionResult DeleteVBDiDMSo(VanBanDiSoViewModel vbdidmsoVm)
        {
            if (!ModelState.IsValid)
            {
                IEnumerable<ModelError> allErrors = ModelState.Values.SelectMany(v => v.Errors);
                return new BadRequestObjectResult(allErrors);
            }
            else
            {
                if (vbdidmsoVm.InsertVanBanDiSoId == 3)
                {
                    var result = _authorizationService.AuthorizeAsync(User, "VANBANDISO", Operations.Delete); // xoa suc khoe nhan vien
                    if (result.Result.Succeeded == false)
                    {
                        return new ObjectResult(new GenericResult(false, "Bạn không đủ quyền xóa."));
                    }

                    vbdidmsoVm.CreateDate = DateTime.Now;
                    vbdidmsoVm.UpdateDate = DateTime.Now;

                    var suckhoe = _vanbandisoService.VanBanDiSoAUD(vbdidmsoVm, "DelVanBanDiSo");

                    return new OkObjectResult(suckhoe);
                }
                else
                {
                    return new OkObjectResult(vbdidmsoVm);
                }
            }
        }

        [HttpGet]
        public IActionResult VanBanCoQuanGetList(string corporationid, int nam)
        {
            var model = _vanbandisoService.VanBanDiSoGetList(corporationid, nam, "", 1, "", "GetAllVanBanDiSoNamKV");
            return new OkObjectResult(model);
        }

        [HttpGet]
        public IActionResult VanBanCoQuanGetListKV(string corporationid)
        {
            var model = _vanbandisoService.VanBanDiSoGetList(corporationid, 1, "", 1, "", "GetAllVanBanDiSoKV");
            return new OkObjectResult(model);
        }

        [HttpGet]
        public IActionResult GetVBDiDMSoId(int vbdidmsoId)
        {
            var model = _vanbandisoService.VanBanDiSoGetList("", 1, "", vbdidmsoId, "", "GetAllVanBanDiSoId");
            return new OkObjectResult(model);
        }

        [HttpGet]
        public IActionResult GetAllVBDiDMSoPaging(int nam, string corporationId, string keyword, int page, int pageSize)
        {
            var khuvuc = !string.IsNullOrEmpty(corporationId) ? corporationId : "%";            
            var tukhoa = !string.IsNullOrEmpty(keyword) ? keyword : "%";

            var model = _vanbandisoService.GetAllVanBanDiSoPaging(nam, khuvuc, 0,
                tukhoa, page, pageSize, "", "GetAllVBDiSoDM");

            return new OkObjectResult(model);
        }

        #endregion AJAX API

    }
}