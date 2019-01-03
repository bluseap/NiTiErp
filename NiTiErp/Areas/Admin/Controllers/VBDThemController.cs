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
    public class VBDThemController : BaseController
    {
        private readonly IHostingEnvironment _hostingEnvironment;
        private readonly NiTiErp.Application.Interfaces.IUserService _userService;
        private readonly IAuthorizationService _authorizationService;

        private readonly IVanBanDenService _vanbandenService;
        private readonly IVanBanDenFileService _vanbandenfileService;

        public VBDThemController(IHostingEnvironment hostingEnvironment,
            NiTiErp.Application.Interfaces.IUserService userService,
            IAuthorizationService authorizationService,

            IVanBanDenService vanbandenService,
            IVanBanDenFileService vanbandenfileService
            )
        {
            _hostingEnvironment = hostingEnvironment;
            _userService = userService;
            _authorizationService = authorizationService;

            _vanbandenService = vanbandenService;
            _vanbandenfileService = vanbandenfileService;
        }

        public IActionResult Index()
        {
            return View();
        }

        #region AJAX API

        public IActionResult AddUpdateVanBanDen(VanBanDenViewModel vanbandenVm)
        {
            if (!ModelState.IsValid)
            {
                IEnumerable<ModelError> allErrors = ModelState.Values.SelectMany(v => v.Errors);
                return new BadRequestObjectResult(allErrors);
            }
            else
            {
                var username = User.GetSpecificClaim("UserName");

                vanbandenVm.CreateBy = username;
                vanbandenVm.CreateDate = DateTime.Now;
                vanbandenVm.UpdateBy = username;
                vanbandenVm.UpdateDate = DateTime.Now;

                vanbandenVm.NgayPhatHanh = DateTime.Now; 

                if (vanbandenVm.InsertVanBanDenId == 1)
                {
                    var result = _authorizationService.AuthorizeAsync(User, "VANBANDENTHEM", Operations.Create); // nhap van ban den
                    if (result.Result.Succeeded == false)
                    {
                        return new ObjectResult(new GenericResult(false, "Bạn không đủ quyền thêm mới."));
                    }                                       

                    var vanbanden = _vanbandenService.VanBanDenAUD(vanbandenVm, "InVanBanDen");
                    return new OkObjectResult(vanbanden);
                }
                else
                {
                    var result = _authorizationService.AuthorizeAsync(User, "VANBANDENTHEM", Operations.Update); //
                    if (result.Result.Succeeded == false)
                    {
                        return new ObjectResult(new GenericResult(false, "Bạn không đủ quyền sửa."));
                    }

                    var vanbanden = _vanbandenService.VanBanDenAUD(vanbandenVm, "UpVanBanDen");
                    return new OkObjectResult(vanbanden);
                }
            }
        }


        #region VanBanDenFile
        public IActionResult AddUpdateVanBanDenFile(VanBanDenFileViewModel vanbandenfileVm)
        {
            if (!ModelState.IsValid)
            {
                IEnumerable<ModelError> allErrors = ModelState.Values.SelectMany(v => v.Errors);
                return new BadRequestObjectResult(allErrors);
            }
            else
            {
                var username = User.GetSpecificClaim("UserName");

                vanbandenfileVm.CreateBy = username;
                vanbandenfileVm.CreateDate = DateTime.Now;
                vanbandenfileVm.UpdateBy = username;
                vanbandenfileVm.UpdateDate = DateTime.Now;

                if (vanbandenfileVm.InsertVanBanDenFileId == 1)
                {
                    var result = _authorizationService.AuthorizeAsync(User, "VANBANDENTHEM", Operations.Create); // nhap thong bao
                    if (result.Result.Succeeded == false)
                    {
                        return new ObjectResult(new GenericResult(false, "Bạn không đủ quyền thêm mới."));
                    }

                    var thongbao = _vanbandenfileService.VanBanDenFileAUD(vanbandenfileVm, "InVanBanDenFile");
                    return new OkObjectResult(thongbao);
                }
                else
                {
                    var result = _authorizationService.AuthorizeAsync(User, "VANBANDENTHEM", Operations.Update); //
                    if (result.Result.Succeeded == false)
                    {
                        return new ObjectResult(new GenericResult(false, "Bạn không đủ quyền sửa."));
                    }

                    var thongbao = _vanbandenfileService.VanBanDenFileAUD(vanbandenfileVm, "UpVanBanDenFile");
                    return new OkObjectResult(thongbao);
                }
            }
        }

        [HttpGet]
        public IActionResult GetListVanBanDenFilePaging(string CodeId)
        {           
            var model = _vanbandenfileService.GetAllVanBanDenFilePaging(1, CodeId, 1, "", "", 1, 1000, "GetAllVanBanDenFileCode");

            return new OkObjectResult(model);
        }
        #endregion

        #endregion

    }
}