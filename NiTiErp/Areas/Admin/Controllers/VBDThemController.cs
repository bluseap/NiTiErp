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
        private readonly IVanBanDienTuService _vanbandientuService;

        private readonly IVanBanDenDuyetService _vanbandenduyetService;
        private readonly IVanBanDenService _vanbandenService;
        private readonly IVanBanDenFileService _vanbandenfileService;

        public VBDThemController(IHostingEnvironment hostingEnvironment,
            NiTiErp.Application.Interfaces.IUserService userService,
            IAuthorizationService authorizationService,
            IHubContext<VanBanHub> hubContext,
            IHubContext<TinNhanHub> hubTinNhanContext,
            IVanBanDienTuService vanbandientuService,

            IVanBanDenDuyetService vanbandenduyetService,
            IVanBanDenService vanbandenService,
            IVanBanDenFileService vanbandenfileService
            )
        {
            _hostingEnvironment = hostingEnvironment;
            _userService = userService;
            _authorizationService = authorizationService;

            _vanbandenduyetService = vanbandenduyetService;
            _vanbandientuService = vanbandientuService;
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

        public IActionResult AddVanBanDenChuyen(VanBanDenViewModel vanbandenVm)
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
                    vanbandenVm.Id = 1;

                    var vanbanden = _vanbandenService.VanBanDenAUD(vanbandenVm, "InVanBanDenChuyen");

                    return new OkObjectResult(vanbanden);
                }
                else
                {                   
                    return new OkObjectResult(vanbandenVm);
                }
            }
        }

        public IActionResult InsertVanBanDenDuyet(VanBanDenDuyetViewModel vanbandenduyetVm)
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

                vanbandenduyetVm.HoSoNhanVienDuyetId = new Guid();
                vanbandenduyetVm.NgayNhanVanBan = DateTime.Now;
                vanbandenduyetVm.NgaySaiNhanVanBan = DateTime.Now;
                vanbandenduyetVm.NgayDuyet = DateTime.Now;
                vanbandenduyetVm.HanXuLy = DateTime.Now;
                vanbandenduyetVm.NgayChuyenChuyenMon = DateTime.Now;
                vanbandenduyetVm.NgaySaiChuyenMon = DateTime.Now;
                vanbandenduyetVm.NgayDuyetPhatHanh = DateTime.Now;
                vanbandenduyetVm.NgayDangXuLyXem = DateTime.Now; 

                if (vanbandenduyetVm.InsertVanBanDenDuyetId == 2)
                {
                    var result = _authorizationService.AuthorizeAsync(User, "VANBANDENTHEM", Operations.Create); // nhap van ban den
                    if (result.Result.Succeeded == false)
                    {
                        return new ObjectResult(new GenericResult(false, "Bạn không đủ quyền thêm mới."));
                    }

                    var vanbanden = _vanbandenduyetService.VanBanDenDuyetAUD(vanbandenduyetVm, "InVanBanDenDuyet");

                    return new OkObjectResult(vanbanden);
                }
                else
                {
                    return new OkObjectResult(vanbandenduyetVm);
                }
            }
        }

        #region Sum Van Ban Den
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
        public IActionResult GetCountVBDenDangXL(string corporationId)
        {
            var khuvuc = !string.IsNullOrEmpty(corporationId) ? corporationId : "%";
            var count = _vanbandenService.GetCountVanBan(corporationId, "GetCountVBDenTTDangXL");
            _hubContext.Clients.All.SendAsync("VanBanDenDangXuLy", count.ToString()); 
            return new OkObjectResult(count);
        }

        [HttpGet]
        public IActionResult GetCountVBDenDuyetChuaCCM(string corporationId)
        {
            var khuvuc = !string.IsNullOrEmpty(corporationId) ? corporationId : "%";
            var count = _vanbandenService.GetCountVanBan(corporationId, "GetCountVBDenDuyetChuaCCM");
            //_hubContext.Clients.All.SendAsync("VanBanDenDangXuLy", count.ToString());
            return new OkObjectResult(count);
        }

        [HttpGet]
        public IActionResult GetCountVBDenDuyetCCM(string corporationId)
        {
            var username = User.GetSpecificClaim("UserName");

            var khuvuc = !string.IsNullOrEmpty(corporationId) ? corporationId : "%";
            var count = _vanbandenService.GetCountVanBan(corporationId, "GetCountVBDenDuyetCCM");
            //_hubContext.Clients.All.SendAsync("VanBanDenDangXuLy", count.ToString());
            return new OkObjectResult(count);
        }

        [HttpGet]
        public IActionResult GetCountVBDChoDuyet(string corporationId)
        {
            var username = User.GetSpecificClaim("UserName");

            var khuvuc = !string.IsNullOrEmpty(corporationId) ? corporationId : "%";
            var count = _vanbandenService.GetCountVanBan(corporationId, "GetCountVBDChoDuyet");
            //_hubContext.Clients.All.SendAsync("VanBanDenDangXuLy", count.ToString());
            return new OkObjectResult(count);
        }

        [HttpGet]
        public IActionResult GetCountVBDDaDuyet(string corporationId)
        {
            var username = User.GetSpecificClaim("UserName");

            var khuvuc = !string.IsNullOrEmpty(corporationId) ? corporationId : "%";
            var count = _vanbandenService.GetCountVanBan(corporationId, "GetCountVBDDaDuyet");
            //_hubContext.Clients.All.SendAsync("VanBanDenDangXuLy", count.ToString());
            return new OkObjectResult(count);
        }


        [HttpGet]
        public IActionResult GetCountVBDChuaPhatHanh(string corporationId)
        {
            var username = User.GetSpecificClaim("UserName");

            var khuvuc = !string.IsNullOrEmpty(corporationId) ? corporationId : "%";
            var count = _vanbandenService.GetCountVanBan(corporationId, "GetCountVBDChuaPhatHanh");
            //_hubContext.Clients.All.SendAsync("VanBanDenDangXuLy", count.ToString());
            return new OkObjectResult(count);
        }

        [HttpGet]
        public IActionResult GetCountVBDSoLuuTam(string corporationId)
        {
            var username = User.GetSpecificClaim("UserName");

            var khuvuc = !string.IsNullOrEmpty(corporationId) ? corporationId : "%";
            var count = _vanbandenService.GetCountVanBan(corporationId, "GetCountVBDSoLuuTam");
            //_hubContext.Clients.All.SendAsync("VanBanDenDangXuLy", count.ToString());
            return new OkObjectResult(count);
        }

        [HttpGet]
        public IActionResult GetCountVBDSoChuaChuyen(string corporationId)
        {
            var username = User.GetSpecificClaim("UserName");

            var khuvuc = !string.IsNullOrEmpty(corporationId) ? corporationId : "%";
            var count = _vanbandenService.GetCountVanBan(corporationId, "GetCountVBDSoChuaChuyen");
            //_hubContext.Clients.All.SendAsync("VanBanDenDangXuLy", count.ToString());
            return new OkObjectResult(count);
        }

        [HttpGet]
        public IActionResult GetCountVBDSoChuaXuLy(string corporationId)
        {
            var username = User.GetSpecificClaim("UserName");

            var khuvuc = !string.IsNullOrEmpty(corporationId) ? corporationId : "%";
            var count = _vanbandenService.GetCountVanBan(corporationId, "GetCountVBDSoChuaXuLy");
            //_hubContext.Clients.All.SendAsync("VanBanDenDangXuLy", count.ToString());
            return new OkObjectResult(count);
        }

        [HttpGet]
        public IActionResult GetCountVBDChuaDuyet(string corporationId)
        {
            var username = User.GetSpecificClaim("UserName");

            var khuvuc = !string.IsNullOrEmpty(corporationId) ? corporationId : "%";
            var count = _vanbandenService.GetCountVanBan(corporationId, "GetCountVBDChuaDuyet");
            //_hubContext.Clients.All.SendAsync("VanBanDenDangXuLy", count.ToString());
            return new OkObjectResult(count);
        }

        [HttpGet]
        public IActionResult GetCountVBDSoTatCa(string corporationId)
        {
            var username = User.GetSpecificClaim("UserName");

            var khuvuc = !string.IsNullOrEmpty(corporationId) ? corporationId : "%";
            var count = _vanbandenService.GetCountVanBan(corporationId, "GetCountVBDSoTatCa");
            //_hubContext.Clients.All.SendAsync("VanBanDenDangXuLy", count.ToString());
            return new OkObjectResult(count);
        }

        [HttpGet]
        public IActionResult GetCountVBDenDuyetCCMUser(string corporationId)
        {
            var username = User.GetSpecificClaim("UserName");

            var khuvuc = !string.IsNullOrEmpty(corporationId) ? corporationId : "%";
            var count = _vanbandenService.GetCountVanBanUser(corporationId, username, "GetCountVBDenDuyetCCMUser");
            //_hubContext.Clients.All.SendAsync("VanBanDenDangXuLy", count.ToString());
            return new OkObjectResult(count);
        }

        [HttpGet]
        public IActionResult GetCountVBDenDuyetDangXuLyUser(string corporationId)
        {
            var username = User.GetSpecificClaim("UserName");

            var khuvuc = !string.IsNullOrEmpty(corporationId) ? corporationId : "%";
            var count = _vanbandenService.GetCountVanBanUser(corporationId, username, "GetCountVBDenDuyetDangXuLyUser");
            //_hubContext.Clients.All.SendAsync("VanBanDenDangXuLy", count.ToString());
            return new OkObjectResult(count);
        }

        [HttpGet]
        public IActionResult GetCountVBDenDaXuLyCLDUser(string corporationId)
        {
            var username = User.GetSpecificClaim("UserName");

            var khuvuc = !string.IsNullOrEmpty(corporationId) ? corporationId : "%";
            var count = _vanbandenService.GetCountVanBanUser(corporationId, username, "GetCountVBDenDaXuLyCLDUser");
            //_hubContext.Clients.All.SendAsync("VanBanDenDangXuLy", count.ToString());
            return new OkObjectResult(count);
        }

        [HttpGet]
        public IActionResult GetCountVBDenTatCaXuLyUser(string corporationId)
        {
            var username = User.GetSpecificClaim("UserName");

            var khuvuc = !string.IsNullOrEmpty(corporationId) ? corporationId : "%";
            var count = _vanbandenService.GetCountVanBanUser(corporationId, username, "GetCountVBDenTatCaXuLyUser");
            //_hubContext.Clients.All.SendAsync("VanBanDenDangXuLy", count.ToString());
            return new OkObjectResult(count);
        }

        [HttpGet]
        public IActionResult GetCountVBDenChoDuyet(string corporationId)
        {
            var khuvuc = !string.IsNullOrEmpty(corporationId) ? corporationId : "%";
            var count = _vanbandenService.GetCountVanBan(corporationId, "GetCountVBDenChoDuyet");
            _hubContext.Clients.All.SendAsync("VanBanDenChoDuyet", count.ToString());
            return new OkObjectResult(count);
        }

        [HttpGet]
        public IActionResult GetCountVBDenChuaPhatHanh(string corporationId)
        {
            var khuvuc = !string.IsNullOrEmpty(corporationId) ? corporationId : "%";
            var count = _vanbandenService.GetCountVanBan(corporationId, "GetCountVBDenChuaPhatHanh");
            _hubContext.Clients.All.SendAsync("VanBanDenChuaPhatHanh", count.ToString());
            return new OkObjectResult(count);
        }

        [HttpGet]
        public IActionResult GetCountVBDenDienTu(string corporationId)
        {
            var khuvuc = !string.IsNullOrEmpty(corporationId) ? corporationId : "%";
            var count = _vanbandenService.GetCountVanBan(corporationId, "GetCountVBDenDienTu");
            _hubContext.Clients.All.SendAsync("VanBanDenDienTu", count.ToString());
            return new OkObjectResult(count);
        }

        #endregion

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
        public IActionResult GetListVBDenTTDuyet(string corporationId, string keyword, int NamVanBan, int SoVanBan, string KyHieuVanBan,
            string TrichYeu, string CoQuanBanHanh, int page, int pageSize)
        {
            var khuvuc = !string.IsNullOrEmpty(corporationId) ? corporationId : "%";            
            var tukhoa = !string.IsNullOrEmpty(keyword) ? keyword : "%";
            var newGuid = new Guid();

            var kyhieuvanban = !string.IsNullOrEmpty(KyHieuVanBan) ? KyHieuVanBan : "%";
            var trichyeu = !string.IsNullOrEmpty(TrichYeu) ? TrichYeu : "%";
            var coquanbanhanh = CoQuanBanHanh == "%" ? 0 : Convert.ToInt32(CoQuanBanHanh);

            var model = _vanbandenService.GetAllVanBanDenPaging(corporationId, 1, 1
                , coquanbanhanh
                , DateTime.Now, DateTime.Now
                , NamVanBan, SoVanBan, kyhieuvanban
                , "", false, 1, false, DateTime.Now, "", newGuid, 1, 1, false, "", "1", "",
                trichyeu, page, pageSize, 1, "", "", "GetAllVBDTTDuyet01");

            return new OkObjectResult(model);
        }

        [HttpGet]
        public IActionResult GetListVBDChoDuyet(string corporationId, string keyword, int NamVanBan, int SoVanBan, string KyHieuVanBan,
            string TrichYeu, string CoQuanBanHanh, int page, int pageSize)
        {
            var khuvuc = !string.IsNullOrEmpty(corporationId) ? corporationId : "%";
            var tukhoa = !string.IsNullOrEmpty(keyword) ? keyword : "%";
            var newGuid = new Guid();

            var kyhieuvanban = !string.IsNullOrEmpty(KyHieuVanBan) ? KyHieuVanBan : "%";
            var trichyeu = !string.IsNullOrEmpty(TrichYeu) ? TrichYeu : "%";
            var coquanbanhanh = CoQuanBanHanh == "%" ? 0 : Convert.ToInt32(CoQuanBanHanh);

            var model = _vanbandenService.GetAllVanBanDenPaging(corporationId, 1, 1
                , coquanbanhanh
                , DateTime.Now, DateTime.Now
                , NamVanBan, SoVanBan, kyhieuvanban
                , "", false, 1, false, DateTime.Now, "", newGuid, 1, 1, false, "", "1", "",
                trichyeu, page, pageSize, 1, "", "", "GetAllVBDTTDuyet0302");

            return new OkObjectResult(model);
        }

        [HttpGet]
        public IActionResult GetListVBDDaDuyet(string corporationId, string keyword, int NamVanBan, int SoVanBan, string KyHieuVanBan,
            string TrichYeu, string CoQuanBanHanh, int page, int pageSize)
        {
            var khuvuc = !string.IsNullOrEmpty(corporationId) ? corporationId : "%";
            var tukhoa = !string.IsNullOrEmpty(keyword) ? keyword : "%";
            var newGuid = new Guid();

            var kyhieuvanban = !string.IsNullOrEmpty(KyHieuVanBan) ? KyHieuVanBan : "%";
            var trichyeu = !string.IsNullOrEmpty(TrichYeu) ? TrichYeu : "%";
            var coquanbanhanh = CoQuanBanHanh == "%" ? 0 : Convert.ToInt32(CoQuanBanHanh);

            var model = _vanbandenService.GetAllVanBanDenPaging(corporationId, 1, 1
                , coquanbanhanh
                , DateTime.Now, DateTime.Now
                , NamVanBan, SoVanBan, kyhieuvanban
                , "", false, 1, false, DateTime.Now, "", newGuid, 1, 1, false, "", "1", "",
                trichyeu, page, pageSize, 1, "", "", "GetAllVBDTTDuyet0403");

            return new OkObjectResult(model);
        }

        [HttpGet]
        public IActionResult GetListVBDenTTDuyetCCM(string corporationId, string keyword, int NamVanBan, int SoVanBan, string KyHieuVanBan,
            string TrichYeu, string CoQuanBanHanh, int page, int pageSize)
        {
            var khuvuc = !string.IsNullOrEmpty(corporationId) ? corporationId : "%";
            var tukhoa = !string.IsNullOrEmpty(keyword) ? keyword : "%";
            var newGuid = new Guid();

            var kyhieuvanban = !string.IsNullOrEmpty(KyHieuVanBan) ? KyHieuVanBan : "%";
            var trichyeu = !string.IsNullOrEmpty(TrichYeu) ? TrichYeu : "%";
            var coquanbanhanh = CoQuanBanHanh == "%" ? 0 : Convert.ToInt32(CoQuanBanHanh);

            var model = _vanbandenService.GetAllVanBanDenPaging(corporationId, 1, 1
                , coquanbanhanh
                , DateTime.Now, DateTime.Now
                , NamVanBan, SoVanBan, kyhieuvanban
                , "", false, 1, false, DateTime.Now, "", newGuid, 1, 1, false, "", "1", "",
                trichyeu, page, pageSize, 1, "", "", "GetAllVBDTTDuyet03");

            return new OkObjectResult(model);
        }

        [HttpGet]
        public IActionResult GetListVBDenChuaXuLy(string corporationId, string keyword, int NamVanBan, int SoVanBan, string KyHieuVanBan,
            string TrichYeu, string CoQuanBanHanh, int page, int pageSize)
        {
            var username = User.GetSpecificClaim("UserName");

            var khuvuc = !string.IsNullOrEmpty(corporationId) ? corporationId : "%";
            var tukhoa = !string.IsNullOrEmpty(keyword) ? keyword : "%";
            var newGuid = new Guid();

            var kyhieuvanban = !string.IsNullOrEmpty(KyHieuVanBan) ? KyHieuVanBan : "%";
            var trichyeu = !string.IsNullOrEmpty(TrichYeu) ? TrichYeu : "%";
            var coquanbanhanh = CoQuanBanHanh == "%" ? 0 : Convert.ToInt32(CoQuanBanHanh);

            var model = _vanbandenService.GetAllVanBanDenPaging(corporationId, 1, 1
                , coquanbanhanh
                , DateTime.Now, DateTime.Now
                , NamVanBan, SoVanBan, kyhieuvanban
                , "", false, 1, false, DateTime.Now, "", newGuid, 1, 1, false, "", "1", "",
                trichyeu, page, pageSize, 1, "", username, "GetAllVBDChuaXuLy01");

            return new OkObjectResult(model);
        }

        [HttpGet]
        public IActionResult GetListVBDenDangXuLy(string corporationId, string keyword, int NamVanBan, int SoVanBan, string KyHieuVanBan,
            string TrichYeu, string CoQuanBanHanh, int page, int pageSize)
        {
            var username = User.GetSpecificClaim("UserName");

            var khuvuc = !string.IsNullOrEmpty(corporationId) ? corporationId : "%";
            var tukhoa = !string.IsNullOrEmpty(keyword) ? keyword : "%";
            var newGuid = new Guid();

            var kyhieuvanban = !string.IsNullOrEmpty(KyHieuVanBan) ? KyHieuVanBan : "%";
            var trichyeu = !string.IsNullOrEmpty(TrichYeu) ? TrichYeu : "%";
            var coquanbanhanh = CoQuanBanHanh == "%" ? 0 : Convert.ToInt32(CoQuanBanHanh);

            var model = _vanbandenService.GetAllVanBanDenPaging(corporationId, 1, 1
                , coquanbanhanh
                , DateTime.Now, DateTime.Now
                , NamVanBan, SoVanBan, kyhieuvanban
                , "", false, 1, false, DateTime.Now, "", newGuid, 1, 1, false, "", "1", "",
                trichyeu, page, pageSize, 1, "", username, "GetAllVBDDangXuLy06");

            return new OkObjectResult(model);
        }

        [HttpGet]
        public IActionResult GetListVBDenDaXuLyCLD(string corporationId, string keyword, int NamVanBan, int SoVanBan, string KyHieuVanBan,
            string TrichYeu, string CoQuanBanHanh, int page, int pageSize)
        {
            var username = User.GetSpecificClaim("UserName");

            var khuvuc = !string.IsNullOrEmpty(corporationId) ? corporationId : "%";
            var tukhoa = !string.IsNullOrEmpty(keyword) ? keyword : "%";
            var newGuid = new Guid();

            var kyhieuvanban = !string.IsNullOrEmpty(KyHieuVanBan) ? KyHieuVanBan : "%";
            var trichyeu = !string.IsNullOrEmpty(TrichYeu) ? TrichYeu : "%";
            var coquanbanhanh = CoQuanBanHanh == "%" ? 0 : Convert.ToInt32(CoQuanBanHanh);

            var model = _vanbandenService.GetAllVanBanDenPaging(corporationId, 1, 1
                , coquanbanhanh
                , DateTime.Now, DateTime.Now
                , NamVanBan, SoVanBan, kyhieuvanban
                , "", false, 1, false, DateTime.Now, "", newGuid, 1, 1, false, "", "1", "",
                trichyeu, page, pageSize, 1, "", username, "GetAllVBDDaXuLyCLD02");

            return new OkObjectResult(model);
        }

        [HttpGet]
        public IActionResult GetListVBDTatCaXuLy(string corporationId, string keyword, int NamVanBan, int SoVanBan, string KyHieuVanBan,
           string TrichYeu, string CoQuanBanHanh, int page, int pageSize)
        {
            var username = User.GetSpecificClaim("UserName");

            var khuvuc = !string.IsNullOrEmpty(corporationId) ? corporationId : "%";
            var tukhoa = !string.IsNullOrEmpty(keyword) ? keyword : "%";
            var newGuid = new Guid();

            var kyhieuvanban = !string.IsNullOrEmpty(KyHieuVanBan) ? KyHieuVanBan : "%";
            var trichyeu = !string.IsNullOrEmpty(TrichYeu) ? TrichYeu : "%";
            var coquanbanhanh = CoQuanBanHanh == "%" ? 0 : Convert.ToInt32(CoQuanBanHanh);

            var model = _vanbandenService.GetAllVanBanDenPaging(corporationId, 1, 1
                , coquanbanhanh
                , DateTime.Now, DateTime.Now
                , NamVanBan, SoVanBan, kyhieuvanban
                , "", false, 1, false, DateTime.Now, "", newGuid, 1, 1, false, "", "1", "",
                trichyeu, page, pageSize, 1, "", username, "GetAllVBDXuLyTatXa0106");

            return new OkObjectResult(model);
        }

        [HttpGet]
        public IActionResult GetListVBDChuaPhatHanh(string corporationId, string keyword, int NamVanBan, int SoVanBan, string KyHieuVanBan,
           string TrichYeu, string CoQuanBanHanh, int page, int pageSize)
        {
            var username = User.GetSpecificClaim("UserName");

            var khuvuc = !string.IsNullOrEmpty(corporationId) ? corporationId : "%";
            var tukhoa = !string.IsNullOrEmpty(keyword) ? keyword : "%";
            var newGuid = new Guid();

            var kyhieuvanban = !string.IsNullOrEmpty(KyHieuVanBan) ? KyHieuVanBan : "%";
            var trichyeu = !string.IsNullOrEmpty(TrichYeu) ? TrichYeu : "%";
            var coquanbanhanh = CoQuanBanHanh == "%" ? 0 : Convert.ToInt32(CoQuanBanHanh);

            var model = _vanbandenService.GetAllVanBanDenPaging(corporationId, 1, 1
                , coquanbanhanh
                , DateTime.Now, DateTime.Now
                , NamVanBan, SoVanBan, kyhieuvanban
                , "", false, 1, false, DateTime.Now, "", newGuid, 1, 1, false, "", "1", "",
                trichyeu, page, pageSize, 1, "", username, "GetAllVBDChuaPhatHanh03");

            return new OkObjectResult(model);
        }

        [HttpGet]
        public IActionResult GetListVBDSoLuuTam(string corporationId, string keyword, int NamVanBan, int SoVanBan, string KyHieuVanBan,
           string TrichYeu, string CoQuanBanHanh, int page, int pageSize)
        {
            var username = User.GetSpecificClaim("UserName");

            var khuvuc = !string.IsNullOrEmpty(corporationId) ? corporationId : "%";
            var tukhoa = !string.IsNullOrEmpty(keyword) ? keyword : "%";
            var newGuid = new Guid();

            var kyhieuvanban = !string.IsNullOrEmpty(KyHieuVanBan) ? KyHieuVanBan : "%";
            var trichyeu = !string.IsNullOrEmpty(TrichYeu) ? TrichYeu : "%";
            var coquanbanhanh = CoQuanBanHanh == "%" ? 0 : Convert.ToInt32(CoQuanBanHanh);

            var model = _vanbandenService.GetAllVanBanDenPaging(corporationId, 1, 1
                , coquanbanhanh
                , DateTime.Now, DateTime.Now
                , NamVanBan, SoVanBan, kyhieuvanban
                , "", false, 1, false, DateTime.Now, "", newGuid, 1, 1, false, "", "1", "",
                trichyeu, page, pageSize, 1, "", username, "GetAllVBDSoLuuTam01");

            return new OkObjectResult(model);
        }

        [HttpGet]
        public IActionResult GetListVBDSoChuaChuyen(string corporationId, string keyword, int NamVanBan, int SoVanBan, string KyHieuVanBan,
           string TrichYeu, string CoQuanBanHanh, int page, int pageSize)
        {
            var username = User.GetSpecificClaim("UserName");

            var khuvuc = !string.IsNullOrEmpty(corporationId) ? corporationId : "%";
            var tukhoa = !string.IsNullOrEmpty(keyword) ? keyword : "%";
            var newGuid = new Guid();

            var kyhieuvanban = !string.IsNullOrEmpty(KyHieuVanBan) ? KyHieuVanBan : "%";
            var trichyeu = !string.IsNullOrEmpty(TrichYeu) ? TrichYeu : "%";
            var coquanbanhanh = CoQuanBanHanh == "%" ? 0 : Convert.ToInt32(CoQuanBanHanh);

            var model = _vanbandenService.GetAllVanBanDenPaging(corporationId, 1, 1
                , coquanbanhanh
                , DateTime.Now, DateTime.Now
                , NamVanBan, SoVanBan, kyhieuvanban
                , "", false, 1, false, DateTime.Now, "", newGuid, 1, 1, false, "", "1", "",
                trichyeu, page, pageSize, 1, "", username, "GetAllVBDSoChuaChuyen0202");

            return new OkObjectResult(model);
        }

        [HttpGet]
        public IActionResult GetListVBDSoChuaXuLy(string corporationId, string keyword, int NamVanBan, int SoVanBan, string KyHieuVanBan,
           string TrichYeu, string CoQuanBanHanh, int page, int pageSize)
        {
            var username = User.GetSpecificClaim("UserName");

            var khuvuc = !string.IsNullOrEmpty(corporationId) ? corporationId : "%";
            var tukhoa = !string.IsNullOrEmpty(keyword) ? keyword : "%";
            var newGuid = new Guid();

            var kyhieuvanban = !string.IsNullOrEmpty(KyHieuVanBan) ? KyHieuVanBan : "%";
            var trichyeu = !string.IsNullOrEmpty(TrichYeu) ? TrichYeu : "%";
            var coquanbanhanh = CoQuanBanHanh == "%" ? 0 : Convert.ToInt32(CoQuanBanHanh);

            var model = _vanbandenService.GetAllVanBanDenPaging(corporationId, 1, 1
                , coquanbanhanh
                , DateTime.Now, DateTime.Now
                , NamVanBan, SoVanBan, kyhieuvanban
                , "", false, 1, false, DateTime.Now, "", newGuid, 1, 1, false, "", "1", "",
                trichyeu, page, pageSize, 1, "", username, "GetAllVBDSoChuaXuLy0301");

            return new OkObjectResult(model);
        }

        [HttpGet]
        public IActionResult GetListVBDSoChuaDuyet(string corporationId, string keyword, int NamVanBan, int SoVanBan, string KyHieuVanBan,
           string TrichYeu, string CoQuanBanHanh, int page, int pageSize)
        {
            var username = User.GetSpecificClaim("UserName");

            var khuvuc = !string.IsNullOrEmpty(corporationId) ? corporationId : "%";
            var tukhoa = !string.IsNullOrEmpty(keyword) ? keyword : "%";
            var newGuid = new Guid();

            var kyhieuvanban = !string.IsNullOrEmpty(KyHieuVanBan) ? KyHieuVanBan : "%";
            var trichyeu = !string.IsNullOrEmpty(TrichYeu) ? TrichYeu : "%";
            var coquanbanhanh = CoQuanBanHanh == "%" ? 0 : Convert.ToInt32(CoQuanBanHanh);

            var model = _vanbandenService.GetAllVanBanDenPaging(corporationId, 1, 1
                , coquanbanhanh
                , DateTime.Now, DateTime.Now
                , NamVanBan, SoVanBan, kyhieuvanban
                , "", false, 1, false, DateTime.Now, "", newGuid, 1, 1, false, "", "1", "",
                trichyeu, page, pageSize, 1, "", username, "GetAllVBDSoChuaDuyet0302");

            return new OkObjectResult(model);
        }

        [HttpGet]
        public IActionResult GetListVBDSoTatCa(string corporationId, string keyword, int NamVanBan, int SoVanBan, string KyHieuVanBan,
           string TrichYeu, string CoQuanBanHanh, int page, int pageSize)
        {
            var username = User.GetSpecificClaim("UserName");

            var khuvuc = !string.IsNullOrEmpty(corporationId) ? corporationId : "%";
            var tukhoa = !string.IsNullOrEmpty(keyword) ? keyword : "%";
            var newGuid = new Guid();

            var kyhieuvanban = !string.IsNullOrEmpty(KyHieuVanBan) ? KyHieuVanBan : "%";
            var trichyeu = !string.IsNullOrEmpty(TrichYeu) ? TrichYeu : "%";
            var coquanbanhanh = CoQuanBanHanh == "%" ? 0 : Convert.ToInt32(CoQuanBanHanh);

            var model = _vanbandenService.GetAllVanBanDenPaging(corporationId, 1, 1
                , coquanbanhanh
                , DateTime.Now, DateTime.Now
                , NamVanBan, SoVanBan, kyhieuvanban
                , "", false, 1, false, DateTime.Now, "", newGuid, 1, 1, false, "", "1", "",
                trichyeu, page, pageSize, 1, "", username, "GetAllVBDSoTatCa");

            return new OkObjectResult(model);
        }

        [HttpGet]
        public IActionResult GetVanBanDenId(Int32 vanbandenId)
        {            
            var newGuid = new Guid();

            var model = _vanbandenService.VanBanDennGetList("", 1, 1, 1, DateTime.Now, DateTime.Now, 1, 1,
                "", "", false, 1, false, DateTime.Now, "", newGuid, 1, 1, false, "", "", "",
                "", 1, 1000, vanbandenId, "", "", "GetVanBanDenId");

            return new OkObjectResult(model);
        }

        [HttpGet]
        public IActionResult GetVanBanDenXuLyId(Int32 vanbandenId)
        {
            var newGuid = new Guid();

            var model = _vanbandenService.VanBanDennGetList("", 1, 1, 1, DateTime.Now, DateTime.Now, 1, 1,
                "", "", false, 1, false, DateTime.Now, "", newGuid, 1, 1, false, "", "", "",
                "", 1, 1000, vanbandenId, "", "", "GetVanBanDenXuLyFileId");

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

        #region VanBanDienTu

        [HttpGet]
        public IActionResult GetListVanBanDienTu(string makhuvuc)
        {
            var model = _vanbandientuService.VanBanDienTuGetList(makhuvuc, 1, DateTime.Now, DateTime.Now, 1
                , "", "", "", "GetCountVBDTKVNo");

            return new OkObjectResult(model);
        }

        #endregion

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

        [HttpPost]
        public IActionResult DeleteVanBanFile(VanBanDenFileViewModel vanbandenfileVm)
        {
            if (!ModelState.IsValid)
            {
                IEnumerable<ModelError> allErrors = ModelState.Values.SelectMany(v => v.Errors);
                return new BadRequestObjectResult(allErrors);
            }
            else
            {
                if (vanbandenfileVm.InsertVanBanDenFileId == 3)
                {
                    var result = _authorizationService.AuthorizeAsync(User, "VANBANDENTHEM", Operations.Delete); // xoa van ban den file
                    if (result.Result.Succeeded == false)
                    {
                        return new ObjectResult(new GenericResult(false, "Bạn không đủ quyền xóa."));
                    }

                    var username = User.GetSpecificClaim("UserName");

                    vanbandenfileVm.CreateBy = username;
                    vanbandenfileVm.CreateDate = DateTime.Now;
                    vanbandenfileVm.UpdateBy = username;
                    vanbandenfileVm.UpdateDate = DateTime.Now;

                    var vanbandenfile = _vanbandenfileService.VanBanDenFileAUD(vanbandenfileVm, "DelVanBanDenFile");

                    return new OkObjectResult(vanbandenfile);
                }
                else
                {
                    return new OkObjectResult(vanbandenfileVm);
                }
            }
        }

        [HttpGet]
        public IActionResult GetListVanBanDenFilePaging(string CodeId)
        {           
            var model = _vanbandenfileService.GetAllVanBanDenFilePaging(1, CodeId, 1, "", "", 1, 1000, "GetAllVanBanDenFileCode");

            return new OkObjectResult(model);
        }

        [HttpGet]
        public IActionResult GetListVBDListIdPaging(Int32 vanbandenId)
        {
            var newGuid = new Guid();

            var model = _vanbandenfileService.GetAllVanBanDenFilePaging(1, newGuid.ToString(), vanbandenId, "", "", 1, 1000, "GetAllVBDVanBanDenId");

            return new OkObjectResult(model);
        }
        #endregion

        #endregion

    }
}