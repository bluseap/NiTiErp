using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.AspNetCore.SignalR;
using NiTiErp.Application.Dapper.Interfaces;
using NiTiErp.Application.Dapper.ViewModels;
using NiTiErp.Authorization;
using NiTiErp.Extensions;
using NiTiErp.Hubs;
using NiTiErp.Utilities.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;

namespace NiTiErp.Areas.Admin.Controllers
{
    public class VBDiThemController : BaseController
    {
        private readonly IHostingEnvironment _hostingEnvironment;
        private readonly NiTiErp.Application.Interfaces.IUserService _userService;
        private readonly IAuthorizationService _authorizationService;
        //private readonly IHubContext<VanBanHub> _hubContext;
        //private readonly IHubContext<TinNhanHub> _hubTinNhanContext;
        //private readonly IVanBanDienTuService _vanbandientuService;

        //private readonly IVanBanDenDuyetService _vanbandenduyetService;
        //private readonly IVanBanDenService _vanbandenService;
        private readonly IVanBanDiFileService _vanbandifileService;

        public VBDiThemController(IHostingEnvironment hostingEnvironment,
            NiTiErp.Application.Interfaces.IUserService userService,
            IAuthorizationService authorizationService,
            //IHubContext<VanBanHub> hubContext,
            //IHubContext<TinNhanHub> hubTinNhanContext,
            //IVanBanDienTuService vanbandientuService,

            //IVanBanDenDuyetService vanbandenduyetService,
            //IVanBanDenService vanbandenService,
            IVanBanDiFileService vanbandifileService
            )
        {
            _hostingEnvironment = hostingEnvironment;
            _userService = userService;
            _authorizationService = authorizationService;

            //_vanbandenduyetService = vanbandenduyetService;
            //_vanbandientuService = vanbandientuService;
            //_hubTinNhanContext = hubTinNhanContext;
            //_hubContext = hubContext;
            //_vanbandenService = vanbandenService;
            _vanbandifileService = vanbandifileService;
        }

        public IActionResult Index()
        {
            return View();
        }

        #region AJAX API

        #region VanBanDiFile
        public IActionResult AddUpdateVanBanDiFile(VanBanDiFileViewModel vanbandifileVm)
        {
            if (!ModelState.IsValid)
            {
                IEnumerable<ModelError> allErrors = ModelState.Values.SelectMany(v => v.Errors);
                return new BadRequestObjectResult(allErrors);
            }
            else
            {
                var username = User.GetSpecificClaim("UserName");

                vanbandifileVm.CreateBy = username;
                vanbandifileVm.CreateDate = DateTime.Now;
                vanbandifileVm.UpdateBy = username;
                vanbandifileVm.UpdateDate = DateTime.Now;

                if (vanbandifileVm.InsertVanBanDiFileId == 1)
                {
                    var result = _authorizationService.AuthorizeAsync(User, "VANBANDITHEM", Operations.Create); 
                    if (result.Result.Succeeded == false)
                    {
                        return new ObjectResult(new GenericResult(false, "Bạn không đủ quyền thêm mới."));
                    }

                    var thongbao = _vanbandifileService.VanBanDiFileAUD(vanbandifileVm, "InVanBanDiFile");
                    return new OkObjectResult(thongbao);
                }
                else
                {
                    var result = _authorizationService.AuthorizeAsync(User, "VANBANDITHEM", Operations.Update); //
                    if (result.Result.Succeeded == false)
                    {
                        return new ObjectResult(new GenericResult(false, "Bạn không đủ quyền sửa."));
                    }

                    var thongbao = _vanbandifileService.VanBanDiFileAUD(vanbandifileVm, "UpVanBanDiFile");
                    return new OkObjectResult(thongbao);
                }
            }
        }

        [HttpPost]
        public IActionResult DeleteVanBanFile(VanBanDiFileViewModel vanbandifileVm)
        {
            if (!ModelState.IsValid)
            {
                IEnumerable<ModelError> allErrors = ModelState.Values.SelectMany(v => v.Errors);
                return new BadRequestObjectResult(allErrors);
            }
            else
            {
                if (vanbandifileVm.InsertVanBanDiFileId == 3)
                {
                    var result = _authorizationService.AuthorizeAsync(User, "VANBANDITHEM", Operations.Delete); // xoa van ban di file
                    if (result.Result.Succeeded == false)
                    {
                        return new ObjectResult(new GenericResult(false, "Bạn không đủ quyền xóa."));
                    }

                    var username = User.GetSpecificClaim("UserName");

                    vanbandifileVm.CreateBy = username;
                    vanbandifileVm.CreateDate = DateTime.Now;
                    vanbandifileVm.UpdateBy = username;
                    vanbandifileVm.UpdateDate = DateTime.Now;

                    var vanbandifile = _vanbandifileService.VanBanDiFileAUD(vanbandifileVm, "DelVanBanDiFile");

                    return new OkObjectResult(vanbandifile);
                }
                else
                {
                    return new OkObjectResult(vanbandifileVm);
                }
            }
        }

        [HttpGet]
        public IActionResult GetListVanBanDiFilePaging(string CodeId)
        {
            var model = _vanbandifileService.GetAllVanBanDiFilePaging(1, CodeId, 1, "", "", 1, 1000, "GetAllVanBanDiFileCode");

            return new OkObjectResult(model);
        }

        [HttpGet]
        public IActionResult GetListVBDiListIdPaging(Int32 vanbandiId)
        {
            var newGuid = new Guid();

            var model = _vanbandifileService.GetAllVanBanDiFilePaging(1, newGuid.ToString(), vanbandiId, "", "", 1, 1000, "GetAllVBDVanBanDiId");

            return new OkObjectResult(model);
        }
        #endregion

        #endregion

    }
}