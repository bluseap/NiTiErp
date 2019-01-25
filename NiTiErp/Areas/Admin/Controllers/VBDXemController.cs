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
    public class VBDXemController : BaseController
    {
        private readonly IHostingEnvironment _hostingEnvironment;
        private readonly NiTiErp.Application.Interfaces.IUserService _userService;
        private readonly IAuthorizationService _authorizationService;

        private readonly IVanBanDenXuLyFileService _vanbandenxulyfileService;
        private readonly IVanBanDenXuLyService _vanbandenxulyService;

        public VBDXemController(IHostingEnvironment hostingEnvironment,
            NiTiErp.Application.Interfaces.IUserService userService,
            IAuthorizationService authorizationService,

            IVanBanDenXuLyFileService vanbandenxulyfileService,
            IVanBanDenXuLyService vanbandenxulyService
            )
        {
            _hostingEnvironment = hostingEnvironment;
            _userService = userService;
            _authorizationService = authorizationService;

            _vanbandenxulyfileService = vanbandenxulyfileService;
            _vanbandenxulyService = vanbandenxulyService;
        }

        public IActionResult Index()
        {
            return View();
        }

        #region API AJAX

        public IActionResult UpdateVanBanDenXuLy(VanBanDenXuLyViewModel vanbandenxulytVm)
        {
            if (!ModelState.IsValid)
            {
                IEnumerable<ModelError> allErrors = ModelState.Values.SelectMany(v => v.Errors);
                return new BadRequestObjectResult(allErrors);
            }
            else
            {
                var username = User.GetSpecificClaim("UserName");

                vanbandenxulytVm.CreateBy = username;
                vanbandenxulytVm.CreateDate = DateTime.Now;
                vanbandenxulytVm.UpdateBy = username;
                vanbandenxulytVm.UpdateDate = DateTime.Now;

                vanbandenxulytVm.NgayBatDauXuLy = DateTime.Now;
                vanbandenxulytVm.NgayXuLy = DateTime.Now;
                vanbandenxulytVm.NgayXemDeBiet = DateTime.Now;
                vanbandenxulytVm.NgayChuyenLanhDao = DateTime.Now;
                vanbandenxulytVm.NgaySaiXyLy = DateTime.Now;
                vanbandenxulytVm.NgaySaiChuyenLanhDao = DateTime.Now;
                vanbandenxulytVm.NgayLanhDaoXem = DateTime.Now;

                if (vanbandenxulytVm.InsertVBDXuLyLId == 2)
                {
                    var result = _authorizationService.AuthorizeAsync(User, "VANBANDENXEM", Operations.Create);
                    if (result.Result.Succeeded == false)
                    {
                        return new ObjectResult(new GenericResult(false, "Bạn không đủ quyền thêm mới."));
                    }

                    var vanbanden = _vanbandenxulyService.VanBanDenXuLyAUD(vanbandenxulytVm, "UpVanBanDenXuLy");

                    return new OkObjectResult(vanbanden);
                }
                else
                {
                    return new OkObjectResult(vanbandenxulytVm);
                }
            }
        }

        public IActionResult UpdateVanBanDenXuLyCLD(VanBanDenXuLyViewModel vanbandenxulytVm)
        {
            if (!ModelState.IsValid)
            {
                IEnumerable<ModelError> allErrors = ModelState.Values.SelectMany(v => v.Errors);
                return new BadRequestObjectResult(allErrors);
            }
            else
            {
                var username = User.GetSpecificClaim("UserName");

                vanbandenxulytVm.CreateBy = username;
                vanbandenxulytVm.CreateDate = DateTime.Now;
                vanbandenxulytVm.UpdateBy = username;
                vanbandenxulytVm.UpdateDate = DateTime.Now;

                vanbandenxulytVm.NgayBatDauXuLy = DateTime.Now;
                vanbandenxulytVm.NgayXuLy = DateTime.Now;
                vanbandenxulytVm.NgayXemDeBiet = DateTime.Now;
                vanbandenxulytVm.NgayChuyenLanhDao = DateTime.Now;
                vanbandenxulytVm.NgaySaiXyLy = DateTime.Now;
                vanbandenxulytVm.NgaySaiChuyenLanhDao = DateTime.Now;
                vanbandenxulytVm.NgayLanhDaoXem = DateTime.Now;

                if (vanbandenxulytVm.InsertVBDXuLyLId == 2)
                {
                    var result = _authorizationService.AuthorizeAsync(User, "VANBANDENXEM", Operations.Create);
                    if (result.Result.Succeeded == false)
                    {
                        return new ObjectResult(new GenericResult(false, "Bạn không đủ quyền thêm mới."));
                    }

                    var vanbanden = _vanbandenxulyService.VanBanDenXuLyAUD(vanbandenxulytVm, "UpVanBanDenXuLyCCMXL");

                    return new OkObjectResult(vanbanden);
                }
                else
                {
                    return new OkObjectResult(vanbandenxulytVm);
                }
            }
        }

        #region VanBanDenXuLyFile

        public IActionResult AddUpdateVanBanDenXuLyFile(VanBanDenXuLyFileViewModel vanbandenxulyfileVm)
        {
            if (!ModelState.IsValid)
            {
                IEnumerable<ModelError> allErrors = ModelState.Values.SelectMany(v => v.Errors);
                return new BadRequestObjectResult(allErrors);
            }
            else
            {
                var username = User.GetSpecificClaim("UserName");

                vanbandenxulyfileVm.CreateBy = username;
                vanbandenxulyfileVm.CreateDate = DateTime.Now;
                vanbandenxulyfileVm.UpdateBy = username;
                vanbandenxulyfileVm.UpdateDate = DateTime.Now;

                if (vanbandenxulyfileVm.InsertVBDXuLyFileId == 1)
                {
                    var result = _authorizationService.AuthorizeAsync(User, "VANBANDENXEM", Operations.Create); 
                    if (result.Result.Succeeded == false)
                    {
                        return new ObjectResult(new GenericResult(false, "Bạn không đủ quyền thêm mới."));
                    }

                    var thongbao = _vanbandenxulyfileService.VanBanDenXuLyFileAUD(vanbandenxulyfileVm, "InVanBanDenXuLyFile");
                    return new OkObjectResult(thongbao);
                }
                else
                {
                    var result = _authorizationService.AuthorizeAsync(User, "VANBANDENXEM", Operations.Update); //
                    if (result.Result.Succeeded == false)
                    {
                        return new ObjectResult(new GenericResult(false, "Bạn không đủ quyền sửa."));
                    }

                    var thongbao = _vanbandenxulyfileService.VanBanDenXuLyFileAUD(vanbandenxulyfileVm, "UpVanBanDenXuLyFile");
                    return new OkObjectResult(thongbao);
                }
            }
        }

        [HttpPost]
        public IActionResult DeleteVanBanDenXuLyFile(VanBanDenXuLyFileViewModel vanbandenfileVm)
        {
            if (!ModelState.IsValid)
            {
                IEnumerable<ModelError> allErrors = ModelState.Values.SelectMany(v => v.Errors);
                return new BadRequestObjectResult(allErrors);
            }
            else
            {
                if (vanbandenfileVm.InsertVBDXuLyFileId == 3)
                {
                    var result = _authorizationService.AuthorizeAsync(User, "VANBANDENXEM", Operations.Delete); // xoa van ban den xu ly file
                    if (result.Result.Succeeded == false)
                    {
                        return new ObjectResult(new GenericResult(false, "Bạn không đủ quyền xóa."));
                    }

                    var username = User.GetSpecificClaim("UserName");

                    vanbandenfileVm.CreateBy = username;
                    vanbandenfileVm.CreateDate = DateTime.Now;
                    vanbandenfileVm.UpdateBy = username;
                    vanbandenfileVm.UpdateDate = DateTime.Now;

                    var vanbandenfile = _vanbandenxulyfileService.VanBanDenXuLyFileAUD(vanbandenfileVm, "DelVanBanDenXuLyFile");

                    return new OkObjectResult(vanbandenfile);
                }
                else
                {
                    return new OkObjectResult(vanbandenfileVm);
                }
            }
        }

        [HttpGet]
        public IActionResult GetListVBDXuLyFileListIdPaging(long vanbandenduyetid)
        {     
            var model = _vanbandenxulyfileService.GetAllVanBanDenXuLyFilePaging(1, vanbandenduyetid, "", "", 
                1, 1000, "GetAllVBDDuyetIdXuLyFileId");

            return new OkObjectResult(model);
        }

        #endregion

        #endregion


    }
}