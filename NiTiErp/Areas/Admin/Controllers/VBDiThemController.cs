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
        private readonly IVanBanDiService _vanbandiService;
        private readonly IVanBanDiFileService _vanbandifileService;

        public VBDiThemController(IHostingEnvironment hostingEnvironment,
            NiTiErp.Application.Interfaces.IUserService userService,
            IAuthorizationService authorizationService,
            //IHubContext<VanBanHub> hubContext,
            //IHubContext<TinNhanHub> hubTinNhanContext,
            //IVanBanDienTuService vanbandientuService,

            //IVanBanDenDuyetService vanbandenduyetService,
            IVanBanDiService vanbandiService,
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
            _vanbandiService = vanbandiService;
            _vanbandifileService = vanbandifileService;
        }

        public IActionResult Index()
        {
            var username = User.GetSpecificClaim("UserName");
            var result = _authorizationService.AuthorizeAsync(User, "VANBANDITHEM", Operations.Read);
            if (result.Result.Succeeded == false)
                return new RedirectResult("/homevanban/Index");

            return View();
        }

        #region AJAX API

        public IActionResult AddUpdateVanBanDi(VanBanDiViewModel vanbandiVm)
        {
            if (!ModelState.IsValid)
            {
                IEnumerable<ModelError> allErrors = ModelState.Values.SelectMany(v => v.Errors);
                return new BadRequestObjectResult(allErrors);
            }
            else
            {
                var username = User.GetSpecificClaim("UserName");

                vanbandiVm.CreateBy = username;
                vanbandiVm.CreateDate = DateTime.Now;
                vanbandiVm.UpdateBy = username;
                vanbandiVm.UpdateDate = DateTime.Now;

                vanbandiVm.NgayPhatHanh = DateTime.Now;

                if (vanbandiVm.InsertVanBanDiId == 1)
                {
                    var result = _authorizationService.AuthorizeAsync(User, "VANBANDITHEM", Operations.Create); // nhap van ban di
                    if (result.Result.Succeeded == false)
                    {
                        return new ObjectResult(new GenericResult(false, "Bạn không đủ quyền thêm mới."));
                    }

                    var vanbandi = _vanbandiService.VanBanDiAUD(vanbandiVm, "InVanBanDiPhatHanh");

                    return new OkObjectResult(vanbandi);
                }
                else
                {
                    var result = _authorizationService.AuthorizeAsync(User, "VANBANDITHEM", Operations.Update); //
                    if (result.Result.Succeeded == false)
                    {
                        return new ObjectResult(new GenericResult(false, "Bạn không đủ quyền sửa."));
                    }

                    var vanbandi = _vanbandiService.VanBanDiAUD(vanbandiVm, "UpVanBanDi");
                    return new OkObjectResult(vanbandi);
                }
            }
        }

        [HttpGet]
        public IActionResult GetListVBDi(string corporationId, string sovanbandi, string keyword, int page, int pageSize)
        {
            var khuvuc = !string.IsNullOrEmpty(corporationId) ? corporationId : "%";
            var phong = !string.IsNullOrEmpty(sovanbandi) ? sovanbandi : "%";
            var tukhoa = !string.IsNullOrEmpty(keyword) ? keyword : "%";
            var newGuid = new Guid();

            var model = _vanbandiService.GetAllVanBanDiPaging(corporationId, 1, 1, 1, DateTime.Now, DateTime.Now, 1, 1,
                sovanbandi, "", false, 1, false, DateTime.Now, "", newGuid, 1, 1, false, "", "", "",
                tukhoa, page, pageSize, 1, "", "", "GetAllVanBanDi");

            return new OkObjectResult(model);
        }

        [HttpGet]
        public IActionResult GetListVBDiDienTu(string corporationId, string keyword, int NamVanBan, int SoVanBan, 
            string KyHieuVanBan, string TrichYeu, int CoQuanBanHanh, int page, int pageSize)
        {
            var khuvuc = !string.IsNullOrEmpty(corporationId) ? corporationId : "%";
            //var phong = !string.IsNullOrEmpty(sovanbandi) ? sovanbandi : "%";
            var tukhoa = !string.IsNullOrEmpty(keyword) ? keyword : "%";
            var trichyeu = !string.IsNullOrEmpty(TrichYeu) ? TrichYeu : "%";
            var kyhieu = !string.IsNullOrEmpty(KyHieuVanBan) ? KyHieuVanBan : "%";
            var newGuid = new Guid();

            var model = _vanbandiService.GetAllVanBanDiPaging(corporationId, 1, 1, CoQuanBanHanh, DateTime.Now, DateTime.Now,
                NamVanBan, SoVanBan,
                kyhieu, "", false, 1, false, DateTime.Now, "", newGuid, 1, 1, false, "", "", "",
                trichyeu, page, pageSize, 1, "", tukhoa, "GetListVBDiDienTu");

            return new OkObjectResult(model);
        }

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


        [HttpGet]
        public IActionResult GetVanBanDiId(Int32 vanbandiId)
        {
            var newGuid = new Guid();

            var model = _vanbandiService.VanBanDiGetList("", 1, 1, 1, DateTime.Now, DateTime.Now, 1, 1,
                "", "", false, 1, false, DateTime.Now, "", newGuid, 1, 1, false, "", "", "",
                "", 1, 1000, vanbandiId, "", "", "GetVanBanDiId");

            return new OkObjectResult(model);
        }

        [HttpGet]
        public IActionResult GetSoSttVBDiKV(string makv, int sovanbandiId)
        {
            var newGuid = new Guid();

            var model = _vanbandiService.VanBanDiGetList(makv, 1, 1, 1, DateTime.Now, DateTime.Now, sovanbandiId, 1,
                "", "", false, 1, false, DateTime.Now, "", newGuid, 1, 1, false, "", "", "",
                "", 1, 1000, 1, "", "", "GetSoSttSoVBDiKV");

            return new OkObjectResult(model);
        }

        [HttpGet]
        public IActionResult GetCountVBDenDiChuaPhatHanh(string corporationId)
        {
            var khuvuc = !string.IsNullOrEmpty(corporationId) ? corporationId : "%";
            var count = _vanbandiService.GetCountVanBanDi(corporationId, "GetCountVBDenDiChuaPhatHanh");
            //_hubContext.Clients.All.SendAsync("VanBanDenChuaPhatHanh", count.ToString());
            return new OkObjectResult(count);
        }

        [HttpGet]
        public IActionResult GetCountVBDiDienTuKV(string corporationId)
        {
            var khuvuc = !string.IsNullOrEmpty(corporationId) ? corporationId : "%";
            var count = _vanbandiService.GetCountVanBanDi(corporationId, "GetCountVBDiDienTuKV");
            //_hubContext.Clients.All.SendAsync("VanBanDenChuaPhatHanh", count.ToString());
            return new OkObjectResult(count);
        }

        #endregion

    }
}