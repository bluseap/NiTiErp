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
    public class VBDThemController : BaseController
    {
        private readonly IHostingEnvironment _hostingEnvironment;
        private readonly NiTiErp.Application.Interfaces.IUserService _userService;
        private readonly IAuthorizationService _authorizationService;
        private readonly IHubContext<VanBanHub> _hubContext;
        private readonly IHubContext<TinNhanHub> _hubTinNhanContext;

        private readonly IVanBanDenService _vanbandenService;
        private readonly IVanBanDenFileService _vanbandenfileService;

        public VBDThemController(IHostingEnvironment hostingEnvironment,
            NiTiErp.Application.Interfaces.IUserService userService,
            IAuthorizationService authorizationService,
            IHubContext<VanBanHub> hubContext,
            IHubContext<TinNhanHub> hubTinNhanContext,

            IVanBanDenService vanbandenService,
            IVanBanDenFileService vanbandenfileService
            )
        {
            _hostingEnvironment = hostingEnvironment;
            _userService = userService;
            _authorizationService = authorizationService;

            _hubTinNhanContext = hubTinNhanContext;
            _hubContext = hubContext;
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

        [HttpGet]
        public IActionResult GetCountVBDen(string corporationId)
        {
            var khuvuc = !string.IsNullOrEmpty(corporationId) ? corporationId : "%";

            var count = _vanbandenService.GetCountVanBan(corporationId, "GetCountVBDenTTXL");

            _hubContext.Clients.All.SendAsync("VanBanDenChuaXuLy", count.ToString());
            //_hubContext.Clients.All.SendAsync("VanBanDenChuaXuLy", "999");

            return new OkObjectResult(count);
        }

        [HttpGet]
        public IActionResult TinNhanVBDen()
        {   
            _hubTinNhanContext.Clients.All.SendAsync("ThongBaoMauXanh", "fff");          

            return new OkObjectResult(200);
        }

        [HttpGet]
        public IActionResult GetListVBDen(string corporationId, string sovanbanden, string keyword, int page, int pageSize)
        {
            var khuvuc = !string.IsNullOrEmpty(corporationId) ? corporationId : "%";
            var phong = !string.IsNullOrEmpty(sovanbanden) ? sovanbanden : "%";
            var tukhoa = !string.IsNullOrEmpty(keyword) ? keyword : "%";
            var newGuid = new Guid();

            var model = _vanbandenService.GetAllVanBanDenPaging(corporationId, 1, 1, 1, DateTime.Now, DateTime.Now, 1, 1, 
                sovanbanden, "", false, 1, false, DateTime.Now,  "", newGuid, 1, 1, false, "", "", "",
                keyword, page, pageSize, 1, "", ""  , "GetAllVanBanDen");

            return new OkObjectResult(model);
        }

        [HttpGet]
        public IActionResult GetListVBDenTTXL(string corporationId, string sovanbanden, string keyword, int page, int pageSize)
        {
            var khuvuc = !string.IsNullOrEmpty(corporationId) ? corporationId : "%";
            var phong = !string.IsNullOrEmpty(sovanbanden) ? sovanbanden : "%";
            var tukhoa = !string.IsNullOrEmpty(keyword) ? keyword : "%";
            var newGuid = new Guid();

            var model = _vanbandenService.VanBanDennGetList(corporationId, 1, 1, 1, DateTime.Now, DateTime.Now, 1, 1,
                sovanbanden, "", false, 1, false, DateTime.Now, "", newGuid, 1, 1, false, "", "", "",
                keyword, page, pageSize, 1, "", "", "GetAllVanBanDenTTXuLy");

            return new OkObjectResult(model);
        }

        [HttpGet]
        public IActionResult GetCountVBDenTTXL(string corporationId)
        {
            var newGuid = new Guid();
            var model = _vanbandenService.VanBanDennGetList(corporationId, 1, 1, 1, DateTime.Now, DateTime.Now, 1, 1,""
                , "", false, 1, false, DateTime.Now, "", newGuid, 1, 1, false, "", "", "",
                "", 1, 1, 1, "", "", "GetCountVBDenTTXL");

            return new OkObjectResult(model);
        }

        //[HttpGet]
        //public IActionResult GetVeHuuId(string vehuuId)
        //{
        //    var model = _qdnghihuuService.GetAllNghiHuuPaging("", "", "", 1, 1000, "", "", "", vehuuId, "GetAllNghiHuuId");

        //    return new OkObjectResult(model);
        //}

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