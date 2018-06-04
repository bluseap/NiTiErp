using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

using NiTiErp.Authorization;
using NiTiErp.Extensions;
using NiTiErp.Application.Dapper;
using NiTiErp.Application.Dapper.Interfaces;
using NiTiErp.Application.Dapper.ViewModels;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace NiTiErp.Areas.Admin.Controllers
{
    public class HosoController : BaseController
    {
        IHoSoNhanVienService _hosonhanvienService;
        IChucVuNhanVienService _chucvunhanvienService;
        ICapBacQuanDoiService _capbacquandoiService;
        IChucVuQuanDoiService _chucvuquandoiService;
        IChucVuCongDoanService _chucvucongdoanService;
        IChucVuDoanService _chucvudoanService;
        IChucVuDangService _chucvudangService;
        ILoaiHopDongService _hopdongdanhmuc;
        IXepLoaiService _xeploaidanhmucService;
        ILoaiDaoTaoService _loaidaotaodanhmucService;
        ILoaiBangService _loaibangdanhmucService;
        IXuatThanService _xuatthandanhmucService;
        ITonGiaoService _tongiaodanhmucService;
        IDanTocService _dantocdanhmucService;
        IHonNhanService _honnhandanhmucService;
        IPhongDanhMucService _phongdanhmucService;
        ICorporationService _corporationService;

        public HosoController(ICorporationService corporationService, IPhongDanhMucService phongdanhmucService,
            IHoSoNhanVienService hosonhanvienService,
            IChucVuNhanVienService chucvunhanvienService, ICapBacQuanDoiService capbacquandoiService,
            IChucVuQuanDoiService chucvuquandoiService,
            IChucVuCongDoanService chucvucongdoanService, IChucVuDoanService chucvudoanService,
            IChucVuDangService chucvudangService, ILoaiHopDongService hopdongdanhmuc,
            IXepLoaiService xeploaidanhmucService, ILoaiDaoTaoService loaidaotaodanhmucService,
            ILoaiBangService loaibangdanhmucService,
            IXuatThanService xuatthandanhmucService, ITonGiaoService tongiaodanhmucService,
            IDanTocService dantocdanhmucService, IHonNhanService honnhandanhmucService)
        {            
            _phongdanhmucService = phongdanhmucService;
            _corporationService = corporationService;
            _hosonhanvienService = hosonhanvienService;
            _chucvunhanvienService = chucvunhanvienService;
            _capbacquandoiService = capbacquandoiService;
            _chucvuquandoiService = chucvuquandoiService;
            _chucvucongdoanService = chucvucongdoanService;
            _chucvudoanService = chucvudoanService;
            _hopdongdanhmuc = hopdongdanhmuc;
            _chucvudangService = chucvudangService;
            _xeploaidanhmucService = xeploaidanhmucService;
            _loaidaotaodanhmucService = loaidaotaodanhmucService;
            _loaibangdanhmucService = loaibangdanhmucService;
            _xuatthandanhmucService = xuatthandanhmucService;
            _tongiaodanhmucService = tongiaodanhmucService;
            _dantocdanhmucService = dantocdanhmucService;
            _honnhandanhmucService = honnhandanhmucService;
        }

        public IActionResult Index()
        {
            return View();
        }

        #region AJAX API

        [HttpPost]
        public IActionResult AddUpdateHosoNhanVien(HoSoNhanVienViewModel hosoVm)
        {
            if (!ModelState.IsValid)
            {
                IEnumerable<ModelError> allErrors = ModelState.Values.SelectMany(v => v.Errors);
                return new BadRequestObjectResult(allErrors);
            }
            else
            {
                var username = User.GetSpecificClaim("UserName");

                if (hosoVm.InsertUpdateId == 0)
                {
                    hosoVm.CreateBy = username;
                    hosoVm.CreateDate = DateTime.Now;                    

                    var hosonhanvien = _hosonhanvienService.HoSoNhanVienAUD(hosoVm, "InHoSoNhanVien");
                    return new OkObjectResult(hosonhanvien);
                }
                else
                {
                    hosoVm.UpdateBy = username;
                    hosoVm.UpdateDate = DateTime.Now;

                    var hosonhanvien = _hosonhanvienService.HoSoNhanVienAUD(hosoVm, "UpHoSoNhanVien");
                    return new OkObjectResult(hosonhanvien);
                }  
            }            
        }

        [HttpGet]
        public IActionResult GetHoSoNhanVienId()
        {
            var hosonhanvienId = Guid.NewGuid();
            return new OkObjectResult(hosonhanvienId);
        }

        [HttpGet]
        public IActionResult GetListCorNhanSu()
        {
            //var email = User.GetSpecificClaim("Email");
            //var id = User.GetSpecificClaim("UserId");
            //var username = User.GetSpecificClaim("UserName");
            var corporationId = User.GetSpecificClaim("CorporationId");

            if (corporationId != "PO")
            {
                // corporationServiceId = NT006 : Nhan su - Tien luong
                var model = _corporationService.CorporationGetList(corporationId, "", "", "GetListCorporation");
                return new OkObjectResult(model);
            }
            else
            {
                // corporationServiceId = NT006 : Nhan su - Tien luong
                var model = _corporationService.CorporationGetList("NT006", "", "", "GetListCorNhanSu");
                return new OkObjectResult(model);
            }
        }

        [HttpGet]
        public IActionResult GetListPhongKhuVuc(string makv)
        {            
            var model = _phongdanhmucService.PhongDanhMucGetList(makv, "", "", "GetListPhongMaKV");
            return new OkObjectResult(model);
        }

        #region Danh muc tab Ho so nhan vien

        [HttpGet]
        public IActionResult ChucVuNhanVienGetList()
        {
            var corporationId = User.GetSpecificClaim("CorporationId");

            var model = _chucvunhanvienService.ChucVuNhanVienGetList(corporationId, "", "", "ChucVuNhanVienGetList");
            return new OkObjectResult(model);
        }

        [HttpGet]
        public IActionResult CapBacQuanDoiGetList()
        {
            var model = _capbacquandoiService.CapBacQuanDoiGetList("", "", "", "CapBacQuanDoiGetList");
            return new OkObjectResult(model);
        }

        [HttpGet]
        public IActionResult ChucVuQuanDoiGetList()
        {
            var model = _chucvuquandoiService.ChucVuQuanDoiGetList("", "", "", "ChucVuQuanDoiGetList");
            return new OkObjectResult(model);
        }

        [HttpGet]
        public IActionResult ChucVuCongDoanGetList()
        {
            var model = _chucvucongdoanService.ChucVuCongDoanGetList("", "", "", "ChucVuCongDoanGetList");
            return new OkObjectResult(model);
        }

        [HttpGet]
        public IActionResult ChucVuDoanGetList()
        {
            var model = _chucvudoanService.ChucVuDoanGetList("", "", "", "ChucVuDoanGetList");
            return new OkObjectResult(model);
        }

        [HttpGet]
        public IActionResult ChucVuDangGetList()
        {
            var model = _chucvudangService.ChucVuDangGetList("", "", "", "ChucVuDangGetList");
            return new OkObjectResult(model);
        }

        [HttpGet]
        public IActionResult LoaiHopDongGetList()
        {
            var model = _hopdongdanhmuc.LoaiHopDongGetList("", "", "", "LoaiHopDongGetList");
            return new OkObjectResult(model);
        }

        [HttpGet]
        public IActionResult XepLoaiGetList()
        {
            var model = _xeploaidanhmucService.XepLoaiGetList("", "", "", "XepLoaiGetList");
            return new OkObjectResult(model);
        }        

        [HttpGet]
        public IActionResult LoaiDaoTaoGetList()
        {
            var model = _loaidaotaodanhmucService.LoaiDaoTaoGetList("", "", "", "LoaiDaoTaoGetList");
            return new OkObjectResult(model);
        }

        [HttpGet]
        public IActionResult LoaiBangGetList()
        {
            var model = _loaibangdanhmucService.LoaiBangGetList("", "", "", "LoaiBangGetList");
            return new OkObjectResult(model);
        }

        [HttpGet]
        public IActionResult XuatThanGetList()
        {
            var model = _xuatthandanhmucService.XuatThanGetList("", "", "", "XuatThanGetList");
            return new OkObjectResult(model);
        }

        [HttpGet]
        public IActionResult TonGiaoGetList()
        {
            var model = _tongiaodanhmucService.TonGiaoGetList("", "", "", "TonGiaoGetList");
            return new OkObjectResult(model);
        }

        [HttpGet]
        public IActionResult DanTocGetList()
        {
            var model = _dantocdanhmucService.DanTocGetList("", "", "", "DanTocGetList");
            return new OkObjectResult(model);
        }

        [HttpGet]
        public IActionResult HonNhanGetList()
        {
            var model = _honnhandanhmucService.HonNhanGetList("", "", "", "HonNhanGetList");
            return new OkObjectResult(model);
        }
        #endregion

        #endregion

    }
}