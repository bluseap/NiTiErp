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
    public class VBDDMSoController : BaseController
    {
        private readonly IHostingEnvironment _hostingEnvironment;
        private readonly NiTiErp.Application.Interfaces.IUserService _userService;
        private readonly IAuthorizationService _authorizationService;

        private readonly IVanBanDenSoService _vanbandensoService;

        public VBDDMSoController(IHostingEnvironment hostingEnvironment,
            NiTiErp.Application.Interfaces.IUserService userService,
            IAuthorizationService authorizationService,

           IVanBanDenSoService vanbandensoService
            )
        {
            _hostingEnvironment = hostingEnvironment;
            _userService = userService;
            _authorizationService = authorizationService;

            _vanbandensoService = vanbandensoService;
        }

        public IActionResult Index()
        {
            var username = User.GetSpecificClaim("UserName");
            var result = _authorizationService.AuthorizeAsync(User, "VANBANDENDMSO", Operations.Read);
            if (result.Result.Succeeded == false)
                return new RedirectResult("/homevanban/Index");

            return View();
        }

        #region AJAX API

        public IActionResult AddUpdateVanBanDenDMSo(VanBanDenSoViewModel vanbandensoVm)
        {
            if (!ModelState.IsValid)
            {
                IEnumerable<ModelError> allErrors = ModelState.Values.SelectMany(v => v.Errors);
                return new BadRequestObjectResult(allErrors);
            }
            else
            {
                var username = User.GetSpecificClaim("UserName");

                vanbandensoVm.CreateBy = username;
                vanbandensoVm.CreateDate = DateTime.Now;
                vanbandensoVm.UpdateBy = username;
                vanbandensoVm.UpdateDate = DateTime.Now;

                if (vanbandensoVm.InsertVanBanDenSoId == 1)
                {
                    var result = _authorizationService.AuthorizeAsync(User, "VANBANDENDMSO", Operations.Create); // nhap van ban den
                    if (result.Result.Succeeded == false)
                    {
                        return new ObjectResult(new GenericResult(false, "Bạn không đủ quyền thêm mới."));
                    }

                    var vanbandenso = _vanbandensoService.VanBanDenSoAUD(vanbandensoVm, "InVanBanDenSo");

                    return new OkObjectResult(vanbandenso);
                }
                else
                {
                    var result = _authorizationService.AuthorizeAsync(User, "VANBANDENDMSO", Operations.Update); //
                    if (result.Result.Succeeded == false)
                    {
                        return new ObjectResult(new GenericResult(false, "Bạn không đủ quyền sửa."));
                    }

                    var vanbandenso = _vanbandensoService.VanBanDenSoAUD(vanbandensoVm, "UpVanBanDenSo");
                    return new OkObjectResult(vanbandenso);
                }
            }
        }

        [HttpPost]
        public IActionResult DeleteVBDDMSo(VanBanDenSoViewModel vbddmsoVm)
        {
            if (!ModelState.IsValid)
            {
                IEnumerable<ModelError> allErrors = ModelState.Values.SelectMany(v => v.Errors);
                return new BadRequestObjectResult(allErrors);
            }
            else
            {
                if (vbddmsoVm.InsertVanBanDenSoId == 3)
                {
                    var result = _authorizationService.AuthorizeAsync(User, "VANBANDENDMSO", Operations.Delete); // xoa suc khoe nhan vien
                    if (result.Result.Succeeded == false)
                    {
                        return new ObjectResult(new GenericResult(false, "Bạn không đủ quyền xóa."));
                    }

                    vbddmsoVm.CreateDate = DateTime.Now;
                    vbddmsoVm.UpdateDate = DateTime.Now;

                    var vanbandendmso = _vanbandensoService.VanBanDenSoAUD(vbddmsoVm, "DelVanBanDenSo");

                    return new OkObjectResult(vanbandendmso);
                }
                else
                {
                    return new OkObjectResult(vbddmsoVm);
                }
            }
        }

        [HttpGet]
        public IActionResult VanBanCoQuanGetList(string corporationid, int nam)
        {
            var model = _vanbandensoService.VanBanDenSoGetList(corporationid, nam, "", 1, "", "GetAllVanBanDenSoNamKV");
            return new OkObjectResult(model);
        }

        [HttpGet]
        public IActionResult VanBanCoQuanGetListKV(string corporationid)
        {
            var model = _vanbandensoService.VanBanDenSoGetList(corporationid, 1, "", 1, "", "GetAllVanBanDenSoKV");
            return new OkObjectResult(model);
        }

        [HttpGet]
        public IActionResult GetVBDDMSoId(int vbddmsoId)
        {
            var model = _vanbandensoService.VanBanDenSoGetList("", 1, "", vbddmsoId, "", "GetAllVanBanDenSoId");
            return new OkObjectResult(model);
        }

        [HttpGet]
        public IActionResult GetAllVBDDMSoPaging(int nam, string corporationId, string keyword, int page, int pageSize)
        {
            var khuvuc = !string.IsNullOrEmpty(corporationId) ? corporationId : "%";
            var tukhoa = !string.IsNullOrEmpty(keyword) ? keyword : "%";

            var model = _vanbandensoService.GetAllVanBanDenSoPaging(nam, khuvuc, 0,
                tukhoa, page, pageSize, "", "GetAllVBDSoDM");

            return new OkObjectResult(model);
        }

        #endregion AJAX API


    }
}