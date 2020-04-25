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
    public class VBDDuyetController : BaseController
    {
        private readonly IHostingEnvironment _hostingEnvironment;
        private readonly NiTiErp.Application.Interfaces.IUserService _userService;
        private readonly IAuthorizationService _authorizationService;

        private readonly IVanBanDenDuyetFileService _vbdduyetfileService;
        private readonly IVBDQuaTrinhXuLyService _vbdquatrinhxulyService;
        private readonly IVanBanPHXLService _vanbanphxlService;
        private readonly IVanBanDenService _vanbandenService;
        private readonly IVanBanDenDuyetNVXLService _vanbandenduyetnvxlduyetService;
        private readonly IVanBanDenDuyetService _vanbandenduyetService;
        private readonly IVanBanDenXuLyService _vanbandenxulyService;

        public VBDDuyetController(IHostingEnvironment hostingEnvironment,
            NiTiErp.Application.Interfaces.IUserService userService,
            IAuthorizationService authorizationService,

            IVanBanDenDuyetFileService vbdduyetfileService,
            IVBDQuaTrinhXuLyService vbdquatrinhxulyService,
            IVanBanPHXLService vanbanphxlService,
            IVanBanDenService vanbandenService,
            IVanBanDenDuyetNVXLService vanbandenduyetnvxlduyetService,
            IVanBanDenDuyetService vanbandenduyetService,
            IVanBanDenXuLyService vanbandenxulyService
            )
        {
            _hostingEnvironment = hostingEnvironment;
            _userService = userService;
            _authorizationService = authorizationService;

            _vbdduyetfileService = vbdduyetfileService;
            _vbdquatrinhxulyService = vbdquatrinhxulyService;
            _vanbanphxlService = vanbanphxlService;
            _vanbandenService = vanbandenService;
            _vanbandenduyetnvxlduyetService = vanbandenduyetnvxlduyetService;
            _vanbandenduyetService = vanbandenduyetService;
            _vanbandenxulyService = vanbandenxulyService;
        }

        public IActionResult Index()
        {
            var username = User.GetSpecificClaim("UserName");
            var result = _authorizationService.AuthorizeAsync(User, "VANBANDENDUYET", Operations.Read);
            if (result.Result.Succeeded == false)
                return new RedirectResult("/homevanban/Index");

            return View();
        }

        #region AJAX API

        public IActionResult UpdateVanBanDenDuyet(VanBanDenDuyetViewModel vanbandenduyetVm)
        {
            if (!ModelState.IsValid)
            {
                IEnumerable<ModelError> allErrors = ModelState.Values.SelectMany(v => v.Errors);
                return new BadRequestObjectResult(allErrors);
            }
            else
            {
                var username = User.GetSpecificClaim("UserName");

                vanbandenduyetVm.CreateBy = username;
                vanbandenduyetVm.CreateDate = DateTime.Now;
                vanbandenduyetVm.UpdateBy = username;
                vanbandenduyetVm.UpdateDate = DateTime.Now;               

                if (vanbandenduyetVm.InsertVanBanDenDuyetId == 2)
                {
                    var result = _authorizationService.AuthorizeAsync(User, "VANBANDENDUYET", Operations.Create);
                    if (result.Result.Succeeded == false)
                    {
                        return new ObjectResult(new GenericResult(false, "Bạn không đủ quyền thêm mới."));
                    }

                    var vanbanden = _vanbandenduyetService.VanBanDenDuyetAUD(vanbandenduyetVm, "UpVanBanDenDuyet");

                    return new OkObjectResult(vanbanden);
                }
                else
                {                    
                    return new OkObjectResult(vanbandenduyetVm);
                }
            }
        }

        public IActionResult UpdateVanBanDenDuyetCCM(VanBanDenDuyetViewModel vanbandenduyetVm)
        {
            if (!ModelState.IsValid)
            {
                IEnumerable<ModelError> allErrors = ModelState.Values.SelectMany(v => v.Errors);
                return new BadRequestObjectResult(allErrors);
            }
            else
            {
                var username = User.GetSpecificClaim("UserName");

                vanbandenduyetVm.CreateBy = username;
                vanbandenduyetVm.CreateDate = DateTime.Now;
                vanbandenduyetVm.UpdateBy = username;
                vanbandenduyetVm.UpdateDate = DateTime.Now;

                if (vanbandenduyetVm.InsertVanBanDenDuyetId == 2)
                {
                    var result = _authorizationService.AuthorizeAsync(User, "VANBANDENDUYET", Operations.Create);
                    if (result.Result.Succeeded == false)
                    {
                        return new ObjectResult(new GenericResult(false, "Bạn không đủ quyền thêm mới."));
                    }

                    var vanbanden = _vanbandenduyetService.VanBanDenDuyetAUD(vanbandenduyetVm, "UpVanBanDenDuyetCCM");

                    return new OkObjectResult(vanbanden);
                }
                else
                {
                    return new OkObjectResult(vanbandenduyetVm);
                }
            }
        }

        public IActionResult UpdateVanBanDenDuyetVanThu(VanBanDenDuyetViewModel vanbandenduyetVm)
        {
            if (!ModelState.IsValid)
            {
                IEnumerable<ModelError> allErrors = ModelState.Values.SelectMany(v => v.Errors);
                return new BadRequestObjectResult(allErrors);
            }
            else
            {
                var username = User.GetSpecificClaim("UserName");

                vanbandenduyetVm.CreateBy = username;
                vanbandenduyetVm.CreateDate = DateTime.Now;
                vanbandenduyetVm.UpdateBy = username;
                vanbandenduyetVm.UpdateDate = DateTime.Now;

                if (vanbandenduyetVm.InsertVanBanDenDuyetId == 2)
                {
                    var result = _authorizationService.AuthorizeAsync(User, "VANBANDENDUYET", Operations.Create);
                    if (result.Result.Succeeded == false)
                    {
                        return new ObjectResult(new GenericResult(false, "Bạn không đủ quyền thêm mới."));
                    }

                    var vanbanden = _vanbandenduyetService.VanBanDenDuyetAUD(vanbandenduyetVm, "UpVanBanDenDuyetVanThu");

                    return new OkObjectResult(vanbanden);
                }
                else
                {
                    return new OkObjectResult(vanbandenduyetVm);
                }
            }
        }

        public IActionResult UpdateVBDDuyetXuLy(VanBanDenDuyetViewModel vanbandenduyetVm)
        {
            if (!ModelState.IsValid)
            {
                IEnumerable<ModelError> allErrors = ModelState.Values.SelectMany(v => v.Errors);
                return new BadRequestObjectResult(allErrors);
            }
            else
            {
                var username = User.GetSpecificClaim("UserName");

                vanbandenduyetVm.CreateBy = username;
                vanbandenduyetVm.CreateDate = DateTime.Now;
                vanbandenduyetVm.UpdateBy = username;
                vanbandenduyetVm.UpdateDate = DateTime.Now;

                if (vanbandenduyetVm.InsertVanBanDenDuyetId == 2)
                {
                    var result = _authorizationService.AuthorizeAsync(User, "VANBANDENDUYET", Operations.Create);
                    if (result.Result.Succeeded == false)
                    {
                        return new ObjectResult(new GenericResult(false, "Bạn không đủ quyền thêm mới."));
                    }

                    var vanbanden = _vanbandenduyetService.VanBanDenDuyetAUD(vanbandenduyetVm, "UpVBDDuyetXuLy");

                    return new OkObjectResult(vanbanden);
                }
                else
                {
                    return new OkObjectResult(vanbandenduyetVm);
                }
            }
        }

        [HttpGet]
        public IActionResult GetVanBanDenIdDuyet02(long vanbandenduyetId)
        {
            var newGuid = new Guid();

            var model = _vanbandenService.VanBanDennGetList("", 1, 1, 1, DateTime.Now, DateTime.Now, 1, 1,
                "", "", false, 1, false, DateTime.Now, "", newGuid, 1, 1, false, "", "", "",
                "", 1, 1000, vanbandenduyetId, "", "", "GetVanBanDenIdDuyet02");

            return new OkObjectResult(model);
        }

        [HttpGet]
        public IActionResult VanBanCoQuanGetList()
        {
            var model = _vanbanphxlService.VanBanPHXLGetList("", "", "", "VanBanPhoiHopXuLyGetList");
            return new OkObjectResult(model);
        }

        [HttpGet]
        public IActionResult GetListVBDQTXL(long vanbandenid)
        {
            var newGuid = new Guid();

            var model = _vbdquatrinhxulyService.GetListVBDQuaTrinhXuLy(newGuid, "", vanbandenid, "", 1, "", "GetVanBanDenQTXL");

            return new OkObjectResult(model);
        }

        #region Nhan vien xu ly van ban den 

        public IActionResult InsertUpdateVBDDNVXLPhong(VanBanDenDuyetNVXLViewModel vanbandenduyetnvxlVm)
        {
            if (!ModelState.IsValid)
            {
                IEnumerable<ModelError> allErrors = ModelState.Values.SelectMany(v => v.Errors);
                return new BadRequestObjectResult(allErrors);
            }
            else
            {
                var username = User.GetSpecificClaim("UserName");

                vanbandenduyetnvxlVm.CreateBy = username;
                vanbandenduyetnvxlVm.CreateDate = DateTime.Now;
                //vanbandenduyetnvxlVm.UpdateBy = username;
                vanbandenduyetnvxlVm.UpdateDate = DateTime.Now;

                if (vanbandenduyetnvxlVm.InsertVanBanDenDuyetNVXLId == 1)
                {
                    var result = _authorizationService.AuthorizeAsync(User, "VANBANDENDUYET", Operations.Create);
                    if (result.Result.Succeeded == false)
                    {
                        return new ObjectResult(new GenericResult(false, "Bạn không đủ quyền thêm mới."));
                    }

                    var vanbanden = _vanbandenduyetnvxlduyetService.VanBanDenDuyetNVXLAUDList(vanbandenduyetnvxlVm, "InVBDDuyetNhanVienXLPhong");

                    return new OkObjectResult(vanbanden);
                }
                else
                {
                    return new OkObjectResult(vanbandenduyetnvxlVm);
                }
            }
        }

        public IActionResult InsertUpdateVBDDNVXL(VanBanDenDuyetNVXLViewModel vanbandenduyetnvxlVm)
        {
            if (!ModelState.IsValid)
            {
                IEnumerable<ModelError> allErrors = ModelState.Values.SelectMany(v => v.Errors);
                return new BadRequestObjectResult(allErrors);
            }
            else
            {
                var username = User.GetSpecificClaim("UserName");

                vanbandenduyetnvxlVm.CreateBy = username;
                vanbandenduyetnvxlVm.CreateDate = DateTime.Now;
                vanbandenduyetnvxlVm.UpdateBy = username;
                vanbandenduyetnvxlVm.UpdateDate = DateTime.Now;               

                if (vanbandenduyetnvxlVm.InsertVanBanDenDuyetNVXLId == 1)
                {
                    var result = _authorizationService.AuthorizeAsync(User, "VANBANDENDUYET", Operations.Create); 
                    if (result.Result.Succeeded == false)
                    {
                        return new ObjectResult(new GenericResult(false, "Bạn không đủ quyền thêm mới."));
                    }

                    var vanbanden = _vanbandenduyetnvxlduyetService.VanBanDenDuyetNVXLAUDList(vanbandenduyetnvxlVm, "InVBDDuyetNhanVienXL");

                    return new OkObjectResult(vanbanden);
                }
                else
                {                    
                    return new OkObjectResult(vanbandenduyetnvxlVm);
                }
            }
        }

        public IActionResult InsertUpdateVBDDNVXL2(VanBanDenDuyetNVXLViewModel vanbandenduyetnvxlVm)
        {
            if (!ModelState.IsValid)
            {
                IEnumerable<ModelError> allErrors = ModelState.Values.SelectMany(v => v.Errors);
                return new BadRequestObjectResult(allErrors);
            }
            else
            {
                var username = User.GetSpecificClaim("UserName");

                vanbandenduyetnvxlVm.CreateBy = username;
                vanbandenduyetnvxlVm.CreateDate = DateTime.Now;
                vanbandenduyetnvxlVm.UpdateBy = username;
                vanbandenduyetnvxlVm.UpdateDate = DateTime.Now;

                if (vanbandenduyetnvxlVm.InsertVanBanDenDuyetNVXLId == 1)
                {
                    var result = _authorizationService.AuthorizeAsync(User, "VANBANDENDUYET", Operations.Create);
                    if (result.Result.Succeeded == false)
                    {
                        return new ObjectResult(new GenericResult(false, "Bạn không đủ quyền thêm mới."));
                    }

                    var vanbanden = _vanbandenduyetnvxlduyetService.VanBanDenDuyetNVXLAUDList(vanbandenduyetnvxlVm, "InVBDDuyetNhanVienXLStatus2");

                    return new OkObjectResult(vanbanden);
                }
                else
                {
                    return new OkObjectResult(vanbandenduyetnvxlVm);
                }
            }
        }

        public IActionResult UpdateVBDDNVXL(VanBanDenDuyetNVXLViewModel vanbandenduyetnvxlVm)
        {
            if (!ModelState.IsValid)
            {
                IEnumerable<ModelError> allErrors = ModelState.Values.SelectMany(v => v.Errors);
                return new BadRequestObjectResult(allErrors);
            }
            else
            {
                var username = User.GetSpecificClaim("UserName");

                vanbandenduyetnvxlVm.CreateBy = username;
                vanbandenduyetnvxlVm.CreateDate = DateTime.Now;
                vanbandenduyetnvxlVm.UpdateBy = username;
                vanbandenduyetnvxlVm.UpdateDate = DateTime.Now;

                if (vanbandenduyetnvxlVm.InsertVanBanDenDuyetNVXLId == 2)
                {
                    var result = _authorizationService.AuthorizeAsync(User, "VANBANDENDUYET", Operations.Update);
                    if (result.Result.Succeeded == false)
                    {
                        return new ObjectResult(new GenericResult(false, "Bạn không đủ quyền thêm mới."));
                    }

                    var vanbanden = _vanbandenduyetnvxlduyetService.VanBanDenDuyetNVXLAUDList(vanbandenduyetnvxlVm, "UpVBDDNVXLPHXL");

                    return new OkObjectResult(vanbanden);
                }
                else
                {
                    return new OkObjectResult(vanbandenduyetnvxlVm);
                }
            }
        }

        [HttpPost]
        public IActionResult DeleteVBDDNVXL(VanBanDenDuyetNVXLViewModel vbddnvxlVm)
        {
            if (!ModelState.IsValid)
            {
                IEnumerable<ModelError> allErrors = ModelState.Values.SelectMany(v => v.Errors);
                return new BadRequestObjectResult(allErrors);
            }
            else
            {
                if (vbddnvxlVm.InsertVanBanDenDuyetNVXLId == 3)
                {
                    var result = _authorizationService.AuthorizeAsync(User, "VANBANDENDUYET", Operations.Delete);
                    if (result.Result.Succeeded == false)
                    {
                        return new ObjectResult(new GenericResult(false, "Bạn không đủ quyền xóa."));
                    }

                    var username = User.GetSpecificClaim("UserName");

                    vbddnvxlVm.CreateBy = username;
                    vbddnvxlVm.CreateDate = DateTime.Now;
                    vbddnvxlVm.UpdateBy = username;
                    vbddnvxlVm.UpdateDate = DateTime.Now;

                    var vbddnvxl = _vanbandenduyetnvxlduyetService.VanBanDenDuyetNVXLAUD(vbddnvxlVm, "DelVBDDuyetNhanVienXL");

                    return new OkObjectResult(vbddnvxl);
                }
                else
                {
                    return new OkObjectResult(vbddnvxlVm);
                }
            }
        }

        [HttpPost]
        public IActionResult DeleteVBDDNVXLCCMXL(VanBanDenDuyetNVXLViewModel vbddnvxlVm)
        {
            if (!ModelState.IsValid)
            {
                IEnumerable<ModelError> allErrors = ModelState.Values.SelectMany(v => v.Errors);
                return new BadRequestObjectResult(allErrors);
            }
            else
            {
                if (vbddnvxlVm.InsertVanBanDenDuyetNVXLId == 3)
                {
                    var result = _authorizationService.AuthorizeAsync(User, "VANBANDENXEM", Operations.Delete);
                    if (result.Result.Succeeded == false)
                    {
                        return new ObjectResult(new GenericResult(false, "Bạn không đủ quyền xóa."));
                    }

                    var username = User.GetSpecificClaim("UserName");

                    vbddnvxlVm.CreateBy = username;
                    vbddnvxlVm.CreateDate = DateTime.Now;
                    vbddnvxlVm.UpdateBy = username;
                    vbddnvxlVm.UpdateDate = DateTime.Now;

                    var vbddnvxl = _vanbandenduyetnvxlduyetService.VanBanDenDuyetNVXLAUDList(vbddnvxlVm, "DelVBDDNhanVienXLCCMXL");

                    return new OkObjectResult(vbddnvxl);
                }
                else
                {
                    return new OkObjectResult(vbddnvxlVm);
                }
            }
        }

        [HttpGet]
        public IActionResult GetListVBDDNVXL(long vanbandenduyetid)
        {            
            var newGuid = new Guid();

            var model = _vanbandenduyetnvxlduyetService.VBDDNVXLGetList(1, vanbandenduyetid, newGuid,
            1, DateTime.Now, "", 1, "", "GetAllVBDDNVXLVBDIdList");

            return new OkObjectResult(model);
        }

        [HttpGet]
        public IActionResult GetVanBanDenXuLyId(long vanbandenduyetid)
        {
            var newGuid = new Guid();

            var model = _vanbandenxulyService.VanBanDenXuLyGetId(1, vanbandenduyetid, newGuid, "",
                DateTime.Now, DateTime.Now,DateTime.Now,DateTime.Now, "", true, true, true, true, true,
                "", "GetVanBanDenDuyetId");

            return new OkObjectResult(model);
        }



        #endregion

        #region VanBanDenFile

        public IActionResult AddUpdateVBDDuyetFile(VanBanDenDuyetFileViewModel vanbandenduyetfileVm)
        {
            if (!ModelState.IsValid)
            {
                IEnumerable<ModelError> allErrors = ModelState.Values.SelectMany(v => v.Errors);
                return new BadRequestObjectResult(allErrors);
            }
            else
            {
                var username = User.GetSpecificClaim("UserName");

                vanbandenduyetfileVm.CreateBy = username;
                vanbandenduyetfileVm.CreateDate = DateTime.Now;
                vanbandenduyetfileVm.UpdateBy = username;
                vanbandenduyetfileVm.UpdateDate = DateTime.Now;                

                if (vanbandenduyetfileVm.InsertVBDDuyetFileId == 1)
                {    
                    var result = _authorizationService.AuthorizeAsync(User, "VANBANDENDUYET", Operations.Create); 
                    if (result.Result.Succeeded == false)
                    {
                        return new ObjectResult(new GenericResult(false, "Bạn không đủ quyền thêm mới."));
                    }

                    var thongbao = _vbdduyetfileService.VanBanDenDuyetFileAUD(vanbandenduyetfileVm, "InVanBanDenDuyetFile");
                    return new OkObjectResult(thongbao);
                }
                else
                {
                    var result = _authorizationService.AuthorizeAsync(User, "VANBANDENDUYET", Operations.Update); //
                    if (result.Result.Succeeded == false)
                    {
                        return new ObjectResult(new GenericResult(false, "Bạn không đủ quyền sửa."));
                    }

                    var thongbao = _vbdduyetfileService.VanBanDenDuyetFileAUD(vanbandenduyetfileVm, "UpVanBanDenDuyetFile");
                    return new OkObjectResult(thongbao);
                }
            }
        }

        [HttpPost]
        public IActionResult DeleteVanBanDuyetFile(VanBanDenDuyetFileViewModel vanbandenduyetfileVm)
        {
            if (!ModelState.IsValid)
            {
                IEnumerable<ModelError> allErrors = ModelState.Values.SelectMany(v => v.Errors);
                return new BadRequestObjectResult(allErrors);
            }
            else
            {
                if (vanbandenduyetfileVm.InsertVBDDuyetFileId == 3)
                {
                    var result = _authorizationService.AuthorizeAsync(User, "VANBANDENDUYET", Operations.Delete); // xoa van ban den file
                    if (result.Result.Succeeded == false)
                    {
                        return new ObjectResult(new GenericResult(false, "Bạn không đủ quyền xóa."));
                    }

                    var username = User.GetSpecificClaim("UserName");

                    vanbandenduyetfileVm.CreateBy = username;
                    vanbandenduyetfileVm.CreateDate = DateTime.Now;
                    vanbandenduyetfileVm.UpdateBy = username;
                    vanbandenduyetfileVm.UpdateDate = DateTime.Now;

                    var vanbandenfile = _vbdduyetfileService.VanBanDenDuyetFileAUD(vanbandenduyetfileVm, "DelVanBanDenDuyetFile");

                    return new OkObjectResult(vanbandenfile);
                }
                else
                {
                    return new OkObjectResult(vanbandenduyetfileVm);
                }
            }
        }

        [HttpGet]
        public IActionResult GetListVanBanDenDuyetFilePaging(string CodeId)
        {
            var model = _vbdduyetfileService.GetAllVanBanDenDuyetFilePaging(1, CodeId, 1, "", "", 1, 1000, "GetAllVanBanDenDuyetFileCode");

            return new OkObjectResult(model);
        }

        [HttpGet]
        public IActionResult GetListVBDDuyetFileListIdPaging(long vanbandenduyetId)
        {
            var newGuid = new Guid();

            var model = _vbdduyetfileService.GetAllVanBanDenDuyetFilePaging(1, newGuid.ToString(), vanbandenduyetId, "", "", 1, 1000, "GetAllVBDVanBanDenDuyetId");

            return new OkObjectResult(model);
        }

        [HttpGet]
        public IActionResult GetListVBDDuyetFileVBDIdPaging(long vanbandenId)
        {
            var newGuid = new Guid();

            var model = _vbdduyetfileService.GetAllVanBanDenDuyetFilePaging(1, newGuid.ToString(), vanbandenId, "", "", 1, 1000, "GetAllVBDVBDDuyetVBDId");

            return new OkObjectResult(model);
        }

        [HttpGet]
        public IActionResult GetListVanBanDenDuyetFileIdPaging(long vanbandenduyetfileId)
        {
            var newGuid = new Guid();
            var model = _vbdduyetfileService.GetAllVanBanDenDuyetFilePaging(vanbandenduyetfileId, newGuid.ToString(), 1, "", "", 1, 1000, "GetVanBanDenDuyetFileId");

            return new OkObjectResult(model);
        }

        #endregion

        #endregion



    }
}