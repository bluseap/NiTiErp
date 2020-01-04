using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using NiTiErp.Application.Dapper.Interfaces;
using NiTiErp.Application.Dapper.ViewModels;
using NiTiErp.Authorization;
using NiTiErp.Extensions;
using NiTiErp.Utilities.Dtos;
using OfficeOpenXml;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Globalization;
using System.IO;
using System.Linq;

namespace NiTiErp.Areas.Admin.Controllers
{
    public class HosoController : BaseController
    {
        private ILockService _lockService;
        private ICongViecService _congviecService;
        private IDangDoanService _dangdoanService;
        private IHopDongService _hopdongService;
        private ITrinhDoService _trinhdoService;
        private IHoSoNhanVienService _hosonhanvienService;
        private IChucVuNhanVienService _chucvunhanvienService;
        private ICapBacQuanDoiService _capbacquandoiService;
        private IChucVuQuanDoiService _chucvuquandoiService;
        private IChucVuCongDoanService _chucvucongdoanService;
        private IChucVuDoanService _chucvudoanService;
        private IChucVuDangService _chucvudangService;
        private ILoaiHopDongService _hopdongdanhmuc;
        private IXepLoaiService _xeploaidanhmucService;
        private ILoaiDaoTaoService _loaidaotaodanhmucService;
        private ILoaiBangService _loaibangdanhmucService;
        private IXuatThanService _xuatthandanhmucService;
        private ITonGiaoService _tongiaodanhmucService;
        private IDanTocService _dantocdanhmucService;
        private IHonNhanService _honnhandanhmucService;
        private IPhongDanhMucService _phongdanhmucService;
        private ICorporationService _corporationService;
        private IHoSoNghiViecService _hosonghiviecService;
        private IDieuKienTimService _dieukientimService;
        private IHoSoFileService _hosofileService;

        private IThanhPhoTinhService _thanhphotinhService;
        private IQuanHuyenService _quanhuyenService;
        private IPhuongXaService _phuongxaService;

        private readonly IHostingEnvironment _hostingEnvironment;
        private readonly NiTiErp.Application.Interfaces.IUserService _userService;
        private readonly IAuthorizationService _authorizationService;


        public HosoController(IHostingEnvironment hostingEnvironment,
            NiTiErp.Application.Interfaces.IUserService userService,
            IAuthorizationService authorizationService,

            IThanhPhoTinhService thanhphotinhService,
            IQuanHuyenService quanhuyenService,
            IPhuongXaService phuongxaService,
            IHoSoNghiViecService hosonghiviecService,
            IDieuKienTimService dieukientimService,
            IHoSoFileService hosofileService,

            ILockService lockService,
            ICongViecService congviecService,
            IDangDoanService dangdoanService,
            IHopDongService hopdongService,
            ICorporationService corporationService, IPhongDanhMucService phongdanhmucService,
            ITrinhDoService trinhdoService,
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
            _hostingEnvironment = hostingEnvironment;
            _userService = userService;
            _authorizationService = authorizationService;

            _thanhphotinhService = thanhphotinhService;
            _quanhuyenService = quanhuyenService;
            _phuongxaService = phuongxaService;
            _hosonghiviecService = hosonghiviecService;
            _dieukientimService = dieukientimService;
            _hosofileService = hosofileService;

            _lockService = lockService;
            _congviecService = congviecService;
            _dangdoanService = dangdoanService;
            _hopdongService = hopdongService;
            _phongdanhmucService = phongdanhmucService;
            _corporationService = corporationService;
            _trinhdoService = trinhdoService;
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

        #region HoSoFile

        [HttpPost]
        public IActionResult AddUpdateHoSoFile(HoSoFileViewModel hosofileVm)
        {
            if (!ModelState.IsValid)
            {
                IEnumerable<ModelError> allErrors = ModelState.Values.SelectMany(v => v.Errors);
                return new BadRequestObjectResult(allErrors);
            }
            else
            {
                var username = User.GetSpecificClaim("UserName");

                hosofileVm.CreateBy = username;
                hosofileVm.CreateDate = DateTime.Now;
                hosofileVm.UpdateBy = username;
                hosofileVm.UpdateDate = DateTime.Now;
                hosofileVm.NgayNhap = DateTime.Now;                

                if (hosofileVm.InsertHoSoFileId == 1)
                {
                    var result = _authorizationService.AuthorizeAsync(User, "NLLNV", Operations.Create); // nhap nhan vien
                    if (result.Result.Succeeded == false)
                    {
                        return new ObjectResult(new GenericResult(false, "Bạn không đủ quyền thêm mới."));
                    }
                   
                    var hosofile = _hosofileService.HoSoFileAUD(hosofileVm, "InHoSoFile");

                    return new OkObjectResult(hosofile);
                }
                else
                {
                    return new OkObjectResult(hosofileVm);
                }
            }
        }

        [HttpGet]
        public IActionResult GetListHoSoFile(string hosonhanvienid)
        {           
            var model = _hosofileService.GetAllHoSoFilePaging("", "", "", 1, 1000, hosonhanvienid, "", "", "", "GetHoSoFileHoSoId");

            return new OkObjectResult(model);
        }

        [HttpGet]
        public IActionResult GetHoSoFileId(string hosofileId)
        {      
            var model = _hosofileService.GetAllHoSoFilePaging("", "", "", 1, 1000, "", "", "", hosofileId, "GetHoSoFileId");

            return new OkObjectResult(model);
        }

        [HttpPost]
        public IActionResult DeleteHoSoFile(HoSoFileViewModel hosofileVm)
        {
            if (!ModelState.IsValid)
            {
                IEnumerable<ModelError> allErrors = ModelState.Values.SelectMany(v => v.Errors);
                return new BadRequestObjectResult(allErrors);
            }
            else
            {
                if (hosofileVm.InsertHoSoFileId == 3)
                {
                    var result = _authorizationService.AuthorizeAsync(User, "NLLNV", Operations.Delete); // xoa ho so file
                    if (result.Result.Succeeded == false)
                    {
                        return new ObjectResult(new GenericResult(false, "Bạn không đủ quyền xóa."));
                    }

                    var username = User.GetSpecificClaim("UserName");

                    hosofileVm.CreateBy = username;
                    hosofileVm.CreateDate = DateTime.Now;
                    hosofileVm.UpdateBy = username;
                    hosofileVm.UpdateDate = DateTime.Now;
                    hosofileVm.NgayNhap = DateTime.Now;

                    var hosofile = _hosofileService.HoSoFileAUD(hosofileVm, "DelHoSoFile");

                    return new OkObjectResult(hosofile);
                }
                else
                {
                    return new OkObjectResult(hosofileVm);
                }
            }
        }

        #endregion

        #region HoSoNghiViec

        [HttpPost]
        public IActionResult AddUpdateNghiViec(HoSoNghiViecViewModel hosonghiviecVm)
        {
            if (!ModelState.IsValid)
            {
                IEnumerable<ModelError> allErrors = ModelState.Values.SelectMany(v => v.Errors);
                return new BadRequestObjectResult(allErrors);
            }
            else
            {
                var username = User.GetSpecificClaim("UserName");

                hosonghiviecVm.CreateBy = username;
                hosonghiviecVm.CreateDate = DateTime.Now;
                hosonghiviecVm.UpdateBy = username;
                hosonghiviecVm.UpdateDate = DateTime.Now;

                if (hosonghiviecVm.InsertHoSoNghiViecId == 1)
                {
                    var result = _authorizationService.AuthorizeAsync(User, "NLLNV", Operations.Create); // nhap nhan vien
                    if (result.Result.Succeeded == false)
                    {
                        return new ObjectResult(new GenericResult(false, "Bạn không đủ quyền thêm mới."));
                    }

                    hosonghiviecVm.Id = 1;
                    var congviec = _hosonghiviecService.HoSoNghiViecAUD(hosonghiviecVm, "InHoSoNghiViec");

                    return new OkObjectResult(congviec);
                }               
                else
                {
                    return new OkObjectResult(hosonghiviecVm);
                }
            }
        }

        [HttpGet]
        public IActionResult GetHoSoNghiViecId(string hosonhanvienid)
        {
            //var khuvuc = !string.IsNullOrEmpty(corporationId) ? corporationId : "%";
            //var phong = !string.IsNullOrEmpty(phongId) ? phongId : "%";
            //var tukhoa = !string.IsNullOrEmpty(keyword) ? keyword : "%";

            var model = _hosonghiviecService.GetAllHoSoNghiViecPaging("", "", "", 1, 1000, hosonhanvienid, "", "", "", "GetNghiViecId");

            return new OkObjectResult(model);
        }

        [HttpPost]
        public IActionResult DeleteNghiViec(HoSoNghiViecViewModel hosonghiviecVm)
        {
            if (!ModelState.IsValid)
            {
                IEnumerable<ModelError> allErrors = ModelState.Values.SelectMany(v => v.Errors);
                return new BadRequestObjectResult(allErrors);
            }
            else
            {
                var username = User.GetSpecificClaim("UserName");

                hosonghiviecVm.CreateBy = username;
                hosonghiviecVm.CreateDate = DateTime.Now;
                hosonghiviecVm.UpdateBy = username;
                hosonghiviecVm.UpdateDate = DateTime.Now;

                if (hosonghiviecVm.InsertHoSoNghiViecId == 5)
                {
                    var result = _authorizationService.AuthorizeAsync(User, "NLLNV", Operations.Create); // nhap nhan vien
                    if (result.Result.Succeeded == false)
                    {
                        return new ObjectResult(new GenericResult(false, "Bạn không đủ quyền thêm mới."));
                    }

                    hosonghiviecVm.Id = 1;
                    var congviec = _hosonghiviecService.HoSoNghiViecAUD(hosonghiviecVm, "DeleteHoSoNghiViec");

                    return new OkObjectResult(congviec);
                }
                else
                {
                    return new OkObjectResult(hosonghiviecVm);
                }
            }
        }

        #endregion

        #region Cong viec

        [HttpPost]
        public IActionResult AddUpdateCongViec(CongViecViewModel congviecVm)
        {
            if (!ModelState.IsValid)
            {
                IEnumerable<ModelError> allErrors = ModelState.Values.SelectMany(v => v.Errors);
                return new BadRequestObjectResult(allErrors);
            }
            else
            {
                var username = User.GetSpecificClaim("UserName");
                
                congviecVm.CreateBy = username;
                congviecVm.CreateDate = DateTime.Now;
                congviecVm.UpdateBy = username;
                congviecVm.UpdateDate = DateTime.Now;

                if ((congviecVm.InsertUpdateId == 0 && congviecVm.InsertUpdateCongViecId == 0) ||
                    (congviecVm.InsertUpdateId == 1 && congviecVm.InsertUpdateCongViecId == 0))
                {
                    var result = _authorizationService.AuthorizeAsync(User, "NLLNV", Operations.Create); // nhap nhan vien
                    if (result.Result.Succeeded == false)
                    {
                        return new ObjectResult(new GenericResult(false, "Bạn không đủ quyền thêm mới."));
                    }

                    congviecVm.Id = "1";

                    var congviec = _congviecService.CongViecAUD(congviecVm, "InCongViec");
                    return new OkObjectResult(congviec);
                }
                else if (congviecVm.InsertUpdateId == 1 && congviecVm.InsertUpdateCongViecId == 1)
                {
                    var result = _authorizationService.AuthorizeAsync(User, "NLLNV", Operations.Update);
                    if (result.Result.Succeeded == false)
                    {
                        return new ObjectResult(new GenericResult(false, "Bạn không đủ quyền sửa."));
                    }

                    var congviec = _congviecService.CongViecAUD(congviecVm, "UpCongViec");
                    return new OkObjectResult(congviec);
                }
                else
                {
                    return new OkObjectResult(congviecVm);
                }
            }
        }

        [HttpPost]
        public IActionResult DeleteCongViec(CongViecViewModel congviecVm)
        {
            if (!ModelState.IsValid)
            {
                IEnumerable<ModelError> allErrors = ModelState.Values.SelectMany(v => v.Errors);
                return new BadRequestObjectResult(allErrors);
            }
            else
            {
                if (congviecVm.InsertUpdateId == 1 && congviecVm.InsertUpdateCongViecId == 1)
                {
                    var result = _authorizationService.AuthorizeAsync(User, "NLLNV", Operations.Delete);
                    if (result.Result.Succeeded == false)
                    {
                        return new ObjectResult(new GenericResult(false, "Bạn không đủ quyền xóa."));
                    }

                    congviecVm.CreateDate = DateTime.Now;
                    congviecVm.UpdateDate = DateTime.Now;

                    var congviec = _congviecService.CongViecAUD(congviecVm, "DelCongViec");
                    return new OkObjectResult(congviec);
                }
                else
                {
                    return new OkObjectResult(congviecVm);
                }
            }
        }

        [HttpGet]
        public IActionResult GetCongViecId(string hosoId, string parameter)
        {
            var model = _congviecService.GetAllCongViecPaging("", "", "", 1, 10,
                hosoId, "", "", "", parameter);

            return new OkObjectResult(model);
        }

        #endregion Cong viec

        #region Dang doan

        [HttpPost]
        public IActionResult AddUpdateDangDoan(DangDoanViewModel dangdoanVm)
        {
            if (!ModelState.IsValid)
            {
                IEnumerable<ModelError> allErrors = ModelState.Values.SelectMany(v => v.Errors);
                return new BadRequestObjectResult(allErrors);
            }
            else
            {
                var username = User.GetSpecificClaim("UserName");

                dangdoanVm.CreateBy = username;
                dangdoanVm.CreateDate = DateTime.Now;
                dangdoanVm.UpdateBy = username;
                dangdoanVm.UpdateDate = DateTime.Now;

                if (dangdoanVm.InsertUpdateDangDoanId == 0 && dangdoanVm.InsertUpdateDangId == 0
                        && dangdoanVm.InsertUpdateDoanId == 0 && dangdoanVm.InsertUpdateCongDoanId == 0
                        && dangdoanVm.InsertUpdateCachMangId == 0 && dangdoanVm.InsertUpdateNhapNguId == 0)
                {
                    var result = _authorizationService.AuthorizeAsync(User, "NLLNV", Operations.Create); // nhap nhan vien
                    if (result.Result.Succeeded == false)
                    {
                        return new ObjectResult(new GenericResult(false, "Bạn không đủ quyền thêm mới."));
                    }

                    dangdoanVm.ThamGiaDangId = "1";
                    dangdoanVm.ThamGiaDoanId = "1";
                    dangdoanVm.ThamGiaCongDoanId = "1";
                    dangdoanVm.ThamGiaCachMangId = "1";
                    dangdoanVm.ThamGiaQuanDoiId = "1";

                    var dangdoan = _dangdoanService.DangDoanAUD(dangdoanVm, dangdoanVm.Parameters);
                    return new OkObjectResult(dangdoan);
                }
                else if (dangdoanVm.InsertUpdateDangDoanId == 1 && (dangdoanVm.InsertUpdateDangId == 1
                        || dangdoanVm.InsertUpdateDoanId == 1 || dangdoanVm.InsertUpdateCongDoanId == 1
                        || dangdoanVm.InsertUpdateCachMangId == 1 || dangdoanVm.InsertUpdateNhapNguId == 1))
                {
                    var result = _authorizationService.AuthorizeAsync(User, "NLLNV", Operations.Update); // nhap nhan vien
                    if (result.Result.Succeeded == false)
                    {
                        return new ObjectResult(new GenericResult(false, "Bạn không đủ quyền thêm mới."));
                    }

                    var dangdoan = _dangdoanService.DangDoanAUD(dangdoanVm, dangdoanVm.Parameters);
                    return new OkObjectResult(dangdoan);
                }
                else
                {
                    return new OkObjectResult(dangdoanVm);
                }
            }
        }

        [HttpGet]
        public IActionResult GetDangDoanId(string hosoId, string dangId, string doanId, string congdoanId,
            string cachmangId, string quandoiId, string parameter)
        {
            var model = _dangdoanService.GetAllDangDoanPaging("", "", "", 1, 10,
                hosoId, "", "", dangId, doanId, congdoanId, cachmangId, quandoiId, parameter);

            return new OkObjectResult(model);
        }

        #endregion Dang doan

        #region Hop Dong

        [HttpPost]
        public IActionResult AddUpdateHopDong(HopDongViewModel hopdongVm)
        {
            if (!ModelState.IsValid)
            {
                IEnumerable<ModelError> allErrors = ModelState.Values.SelectMany(v => v.Errors);
                return new BadRequestObjectResult(allErrors);
            }
            else
            {
                var username = User.GetSpecificClaim("UserName");

                hopdongVm.CreateBy = username;
                hopdongVm.CreateDate = DateTime.Now;
                hopdongVm.UpdateBy = username;
                hopdongVm.UpdateDate = DateTime.Now;

                if ((hopdongVm.InsertUpdateId == 0 && hopdongVm.InsertUpdateHopDongId == 0) ||
                    (hopdongVm.InsertUpdateId == 1 && hopdongVm.InsertUpdateHopDongId == 0))
                {
                    var result = _authorizationService.AuthorizeAsync(User, "NLLNV", Operations.Create); // nhap nhan vien
                    if (result.Result.Succeeded == false)
                    {
                        return new ObjectResult(new GenericResult(false, "Bạn không đủ quyền thêm mới."));
                    }

                    hopdongVm.Id = "1";

                    var hopdong = _hopdongService.HopDongAUD(hopdongVm, "InHopDong");
                    return new OkObjectResult(hopdong);
                } // khong co sua hop dong, nam trong muc Nhap Hop Dong Nhan Vien
                //else if (hopdongVm.InsertUpdateId == 1 && hopdongVm.InsertUpdateHopDongId == 1)
                //{
                //    var result = _authorizationService.AuthorizeAsync(User, "NLLNV", Operations.Update); // nhap nhan vien
                //    if (result.Result.Succeeded == false)
                //    {
                //        return new ObjectResult(new GenericResult(false, "Bạn không đủ quyền sửa."));
                //    }

                //    var trinhdo = _hopdongService.HopDongAUD(hopdongVm, "UpTrinhDo");
                //    return new OkObjectResult(trinhdo);
                //}
                else
                {
                    return new OkObjectResult(hopdongVm);
                }
            }
        }

        [HttpGet]
        public IActionResult GetAllHopDongPaging(string corporationId, string phongId, string keyword, int page,
            int pageSize, string hosoId, string hopdongId)
        {
            var khuvuc = !string.IsNullOrEmpty(corporationId) ? corporationId : "%";
            var phong = !string.IsNullOrEmpty(phongId) ? phongId : "%";
            var tukhoa = !string.IsNullOrEmpty(keyword) ? keyword : "%";

            var model = _trinhdoService.GetAllTrinhDoPaging(khuvuc, phong, tukhoa, page, pageSize,
                hosoId, "", "", hopdongId, "GetAllHopDong");

            return new OkObjectResult(model);
        }

        [HttpGet]
        public IActionResult GetHopDongId(string hopdongId)
        {
            var model = _hopdongService.GetAllHopDongPaging("", "", "", 1, 10,
                "", "", "", hopdongId, "GetAllHopDongId");

            return new OkObjectResult(model);
        }

        [HttpGet]
        public IActionResult GetMaxHopDongId(string hosoId)
        {
            var model = _hopdongService.GetAllHopDongPaging("", "", "", 1, 10,
                hosoId, "", "", "", "GetMaxHoSoHopDongId");

            return new OkObjectResult(model);
        }

        [HttpGet]
        public IActionResult GetHopDongChucVuLuongId(string corporationId, string chucvuId)
        {
            var model = _hopdongService.GetAllHopDongPaging(corporationId, "", "", 1, 10,
                "", "", chucvuId, "", "GetHopDongHeSoLuongBac1");

            return new OkObjectResult(model);
        }

        #endregion Hop Dong

        #region Trinh Do

        [HttpPost]
        public IActionResult AddUpdateTrinhDo(TrinhDoViewModel trinhdoVm)
        {
            if (!ModelState.IsValid)
            {
                IEnumerable<ModelError> allErrors = ModelState.Values.SelectMany(v => v.Errors);
                return new BadRequestObjectResult(allErrors);
            }
            else
            {
                var username = User.GetSpecificClaim("UserName");

                trinhdoVm.CreateBy = username;
                trinhdoVm.CreateDate = DateTime.Now;
                trinhdoVm.UpdateBy = username;
                trinhdoVm.UpdateDate = DateTime.Now;

                if ((trinhdoVm.InsertUpdateId == 0 && trinhdoVm.InsertUpdateTrinhDoId == 0) ||
                    (trinhdoVm.InsertUpdateId == 1 && trinhdoVm.InsertUpdateTrinhDoId == 0))
                {
                    var result = _authorizationService.AuthorizeAsync(User, "NLLNV", Operations.Create); // nhap nhan vien
                    if (result.Result.Succeeded == false)
                    {
                        return new ObjectResult(new GenericResult(false, "Bạn không đủ quyền thêm mới."));
                    }

                    trinhdoVm.Id = "1";

                    var trinhdo = _trinhdoService.TrinhDoAUD(trinhdoVm, "InTrinhDo");
                    return new OkObjectResult(trinhdo);
                }
                else if (trinhdoVm.InsertUpdateId == 1 && trinhdoVm.InsertUpdateTrinhDoId == 1)
                {
                    var result = _authorizationService.AuthorizeAsync(User, "NLLNV", Operations.Update); // nhap nhan vien
                    if (result.Result.Succeeded == false)
                    {
                        return new ObjectResult(new GenericResult(false, "Bạn không đủ quyền sửa."));
                    }

                    var trinhdo = _trinhdoService.TrinhDoAUD(trinhdoVm, "UpTrinhDo");
                    return new OkObjectResult(trinhdo);
                }
                else
                {
                    return new OkObjectResult(trinhdoVm);
                }
            }
        }

        [HttpPost]
        public IActionResult DeleteTrinhDo(TrinhDoViewModel trinhdoVm)
        {
            if (!ModelState.IsValid)
            {
                IEnumerable<ModelError> allErrors = ModelState.Values.SelectMany(v => v.Errors);
                return new BadRequestObjectResult(allErrors);
            }
            else
            {
                if (trinhdoVm.InsertUpdateId == 1 && trinhdoVm.InsertUpdateTrinhDoId == 1)
                {
                    var result = _authorizationService.AuthorizeAsync(User, "NLLNV", Operations.Delete); // nhap nhan vien
                    if (result.Result.Succeeded == false)
                    {
                        return new ObjectResult(new GenericResult(false, "Bạn không đủ quyền xóa."));
                    }

                    trinhdoVm.CreateDate = DateTime.Now;
                    trinhdoVm.UpdateDate = DateTime.Now;

                    var trinhdo = _trinhdoService.TrinhDoAUD(trinhdoVm, "DelTrinhDo");
                    return new OkObjectResult(trinhdo);
                }
                else
                {
                    return new OkObjectResult(trinhdoVm);
                }
            }
        }

        [HttpGet]
        public IActionResult GetAllTrinhDoPaging(string corporationId, string phongId, string keyword, int page, int pageSize, string hosoId, string trinhdoId)
        {
            var khuvuc = !string.IsNullOrEmpty(corporationId) ? corporationId : "%";
            var phong = !string.IsNullOrEmpty(phongId) ? phongId : "%";
            var tukhoa = !string.IsNullOrEmpty(keyword) ? keyword : "%";

            var model = _trinhdoService.GetAllTrinhDoPaging(khuvuc, phong, tukhoa, page, pageSize,
                hosoId, "", "", trinhdoId, "GetAllTrinhDo");

            return new OkObjectResult(model);
        }

        [HttpGet]
        public IActionResult GetTrinhDoId(string trinhdoId)
        {
            var model = _trinhdoService.GetAllTrinhDoPaging("", "", "", 1, 10,
                "", "", "", trinhdoId, "GetAllTrinhDoId");

            return new OkObjectResult(model);
        }

        #endregion Trinh Do

        #region HoSoNhanVien

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

                hosoVm.CreateBy = username;
                hosoVm.CreateDate = DateTime.Now;
                hosoVm.UpdateBy = username;
                hosoVm.UpdateDate = DateTime.Now;

                if (hosoVm.InsertUpdateId == 0)
                {
                    var result = _authorizationService.AuthorizeAsync(User, "NLLNV", Operations.Create); // nhap nhan vien
                    if (result.Result.Succeeded == false)
                    {
                        return new ObjectResult(new GenericResult(false, "Bạn không đủ quyền thêm mới."));
                    }

                    var hosonhanvien = _hosonhanvienService.HoSoNhanVienAUD(hosoVm, "InHoSoNhanVien");
                    return new OkObjectResult(hosonhanvien);
                }
                else
                {
                    var result = _authorizationService.AuthorizeAsync(User, "NLLNV", Operations.Update); // nhap nhan vien
                    if (result.Result.Succeeded == false)
                    {
                        return new ObjectResult(new GenericResult(false, "Bạn không đủ quyền sửa."));
                    }

                    var hosonhanvien = _hosonhanvienService.HoSoNhanVienAUD(hosoVm, "UpHoSoNhanVien");
                    return new OkObjectResult(hosonhanvien);
                }
            }
        }

        [HttpPost]
        public IActionResult ExportExcel(int billId, string corporationId, string phongId, string keyword)
        {
            string sWebRootFolder = _hostingEnvironment.WebRootPath;
            string sFileName = $"HoSo.xlsx";
            // Template File
            string templateDocument = Path.Combine(sWebRootFolder, "templates", "HoSoExcel.xlsx");

            string url = $"{Request.Scheme}://{Request.Host}/{"export-files"}/{sFileName}";

            FileInfo file = new FileInfo(Path.Combine(sWebRootFolder, "export-files", sFileName));

            if (file.Exists)
            {
                file.Delete();
                file = new FileInfo(Path.Combine(sWebRootFolder, "export-files", sFileName));
            }

            using (FileStream templateDocumentStream = System.IO.File.OpenRead(templateDocument))
            {
                using (ExcelPackage package = new ExcelPackage(templateDocumentStream))
                {
                    // add a new worksheet to the empty workbook
                    ExcelWorksheet worksheet = package.Workbook.Worksheets["HoSo"];

                    // Data Acces, load order header data.
                    var hosoDetail = _hosonhanvienService.HoSoNhanVienGetList(corporationId, phongId, "%", "", "", "", 
                        "GetAllHoSoNhanVien");

                    //worksheet.Cells[2, 1].Value = "";

                    int rowIndex = 4;
                    int count = 1;
                    foreach (var orderDetail in hosoDetail.Result)
                    {
                        // Cell 1, Carton Count
                        worksheet.Cells[rowIndex, 1].Value = count.ToString();
                        
                        worksheet.Cells[rowIndex, 2].Value = orderDetail.Ten != null ? orderDetail.Ten.ToString() : "";

                        worksheet.Cells[rowIndex, 3].Value = orderDetail.CorporationName != null ? orderDetail.CorporationName.ToString() : "";

                        worksheet.Cells[rowIndex, 4].Value = orderDetail.TenPhong != null ? orderDetail.TenPhong.ToString() : "";                        
                        
                        worksheet.Cells[rowIndex, 5].Value = orderDetail.NgaySinh != null ? orderDetail.NgaySinh.Date.ToString("dd/M/yyyy", CultureInfo.InvariantCulture) : "";

                        worksheet.Cells[rowIndex, 6].Value = orderDetail.SoDienThoai != null ? orderDetail.SoDienThoai.ToString() : "";

                        worksheet.Cells[rowIndex, 7].Value = orderDetail.Id != null ? orderDetail.Id.ToString() : "";

                        rowIndex++;
                        count++;
                    }

                    package.SaveAs(file); //Save the workbook.

                    //DataTable dt = TextHelper.ToDataTable2(hosoDetail.Result);
                    //worksheet.Cells[1, 1].LoadFromDataTable(dt, true);

                    //var hosoDetail3 = _hosonhanvienService.HoSoDataTable("%", "%", "%", "", "", "", "GetAllHoSoNhanVien");
                    //DataTable dt = TextHelper.ListToDataTable(hosoDetail3.Result.ToList());
                    //worksheet.Cells[1, 1].LoadFromDataTable(dt, true);

                    //var hosoDetail3 = _hosonhanvienService.HoSoDataTable("%", "%", "%", "", "", "", "GetAllHoSoNhanVien");

                    //worksheet.Cells[1, 1].LoadFromDataTable(hosoDetail3.Result.ToList(), true);


                    //var hosoDetail = _hosonhanvienService.HoSoNhanVienGetList("%", "%", "%", "", "", "", "GetAllHoSoNhanVien");

                    //DataTable dt1;
                    //dt1 = hosoDetail.Result.ToDataTable();
                    //List<HoSoNhanVienViewModel> list = new List<HoSoNhanVienViewModel>();
                    //var hoso = hosoDetail.Result.ToList();

                    //DataTable dt = TextHelper.ToDataTable(hosoDetail.Result.ToList());

                    //DataTable dt3 = TextHelper.ToDataTable3(hosoDetail.Result.ToList());

                    //int colend2 =  dt.Columns.Count;

                    //foreach (var dt2 in hosoDetail.Result)
                    //{
                    //    ExcelWorksheet ws = package.Workbook.Worksheets.Add("hoso");

                    //    int rowstart = 2;
                    //    int colstart = 2;
                    //    int rowend = rowstart;
                    //    int colend = colstart + dt.Columns.Count;

                    //    ws.Cells[rowstart, colstart, rowend, colend].Merge = true;
                    //    ws.Cells[rowstart, colstart, rowend, colend].Value = "DANH SÁCH HỒ SƠ NHÂN VIÊN";
                    //    ws.Cells[rowstart, colstart, rowend, colend].Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Center;
                    //    ws.Cells[rowstart, colstart, rowend, colend].Style.Font.Bold = true;
                    //    ws.Cells[rowstart, colstart, rowend, colend].Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid;
                    //    ws.Cells[rowstart, colstart, rowend, colend].Style.Fill.BackgroundColor.SetColor(System.Drawing.Color.LightGray);

                    //    rowstart += 2;
                    //    rowend = rowstart + dt.Columns.Count;
                    //    ws.Cells[rowstart, colstart].LoadFromDataTable(dt, true);
                    //    int i = 1;

                    //    ws.Cells[ws.Dimension.Address].AutoFitColumns();

                    //    ws.Cells[rowstart, colstart, rowend, colend].Style.Border.Top.Style =
                    //       ws.Cells[rowstart, colstart, rowend, colend].Style.Border.Bottom.Style =
                    //       ws.Cells[rowstart, colstart, rowend, colend].Style.Border.Left.Style =
                    //       ws.Cells[rowstart, colstart, rowend, colend].Style.Border.Right.Style = OfficeOpenXml.Style.ExcelBorderStyle.Thin;

                    //}

                    //DataTable dt3 = TextHelper.ToDataTable2(hosoDetail3.Result.ElementAt(1).ToList());
                    //worksheet.Cells[1, 1].LoadFromDataTable(dt3, true);

                    // Insert customer data into template
                    //worksheet.Cells[4, 1].Value = "Customer Name: ";// + billDetail.CustomerName;
                    //worksheet.Cells[5, 1].Value = "Address: ";// + billDetail.CustomerAddress;
                    //worksheet.Cells[6, 1].Value = "Phone: ";// + billDetail.CustomerMobile;

                    //worksheet.Cells[2, 1].Value = "DANH SÁCH HỒ SƠ NHÂN VIÊN ";// + billDetail.CustomerName;

                    // Start Row for Detail Rows
                    //int rowIndex = 9;

                    //int rowIndex = 4;

                    // load order details
                    //var orderDetails = _hosonhanvienService.HoSoNhanVienGetList("%", "%", "%", "", "", "", "GetAllHoSoNhanVien");

                    ////var orderDetails = _billService.GetBillDetails(billId);
                    //int count = 1;
                    //foreach (var orderDetail in orderDetails.Result)
                    //{
                    //    // Cell 1, Carton Count
                    //    worksheet.Cells[rowIndex, 1].Value = count.ToString();
                    //    // Cell 2, Order Number (Outline around columns 2-7 make it look like 1 column)
                    //    worksheet.Cells[rowIndex, 2].Value = orderDetail.Ten.ToString();
                    //    // Cell 8, Weight in LBS (convert KG to LBS, and rounding to whole number)
                    //    worksheet.Cells[rowIndex, 3].Value = orderDetail.NgaySinh.ToString();

                    //    worksheet.Cells[rowIndex, 4].Value = orderDetail.SoDienThoai.ToString();

                    //    // Increment Row Counter
                    //    rowIndex++;
                    //    count++;
                    //}

                    //decimal total = (decimal)(orderDetails.Sum(x => x.Quantity * x.Price));
                    //worksheet.Cells[24, 5].Value = total.ToString("N0");

                    //var numberWord = "Total amount (by word): " + TextHelper.ToString(total);
                    //worksheet.Cells[26, 1].Value = numberWord;
                    //var billDate = billDetail.DateCreated;
                    //worksheet.Cells[28, 3].Value = billDate.Day + ", " + billDate.Month + ", " + billDate.Year;

                    //package.SaveAs(file); //Save the workbook.
                }
            }
            return new OkObjectResult(url);
        }

        [HttpGet]
        public IActionResult GetAllPaging(string corporationId, string phongId, string keyword, int page, int pageSize)
        {
            var phong = !string.IsNullOrEmpty(phongId) ? phongId : "%";
            var tukhoa = !string.IsNullOrEmpty(keyword) ? keyword : "%";

            var model = _hosonhanvienService.GetAllHoSoNhanVienPaging(corporationId, phong, tukhoa, page, pageSize,
                "", "1", "", "GetAllHoSoNhanVien"); // tim nhung nhan vien dang lam viec

            return new OkObjectResult(model);
        }

        [HttpGet]
        public IActionResult GetAllPagingHoSoNguoiDung(string corporationId, string phongId, string keyword, int page, int pageSize)
        {
            var phong = !string.IsNullOrEmpty(phongId) ? phongId : "%";
            var tukhoa = !string.IsNullOrEmpty(keyword) ? keyword : "%";

            var model = _hosonhanvienService.GetAllHoSoNhanVienPaging(corporationId, phong, tukhoa, page, pageSize,
                "", "1", "", "GetAllHoSoNguoiDung"); // tim nhung nhan vien dang lam viec

            return new OkObjectResult(model);
        }

        [HttpGet]
        public IActionResult GetAllHoSoNghiViecPaging(string corporationId, string phongId, string keyword, int page, int pageSize)
        {
            var phong = !string.IsNullOrEmpty(phongId) ? phongId : "%";
            var tukhoa = !string.IsNullOrEmpty(keyword) ? keyword : "%";

            var model = _hosonhanvienService.GetAllHoSoNhanVienPaging(corporationId, phong, tukhoa, page, pageSize,
                "", "1", "", "GetAllHoSoNhanVienNghiViec"); // tim nhung nhan vien nghi viec

            return new OkObjectResult(model);
        }

        [HttpGet]
        public IActionResult GetAllHoSoVeHuuPaging(string corporationId, string phongId, string keyword, int page, int pageSize)
        {
            var phong = !string.IsNullOrEmpty(phongId) ? phongId : "%";
            var tukhoa = !string.IsNullOrEmpty(keyword) ? keyword : "%";

            var model = _hosonhanvienService.GetAllHoSoNhanVienPaging(corporationId, phong, tukhoa, page, pageSize,
                "", "1", "", "GetAllHoSoNhanVienVeHuu"); // tim nhung nhan vien ve huu

            return new OkObjectResult(model);
        }

        [HttpGet]
        public IActionResult GetAllHoSoAllPaging(string corporationId, string phongId, string keyword, int page, int pageSize)
        {
            var phong = !string.IsNullOrEmpty(phongId) ? phongId : "%";
            var tukhoa = !string.IsNullOrEmpty(keyword) ? keyword : "%";

            var model = _hosonhanvienService.GetAllHoSoNhanVienPaging(corporationId, phong, tukhoa, page, pageSize,
                "", "1", "", "GetAllHoSoNhanVienAll"); // tim tat ca nhan vien

            return new OkObjectResult(model);
        }

        [HttpGet]
        public IActionResult GetHoSoNoHopDong(string corporationId, string phongId, string keyword, int page, int pageSize)
        {
            var phong = !string.IsNullOrEmpty(phongId) ? phongId : "%";
            var tukhoa = !string.IsNullOrEmpty(keyword) ? keyword : "%";

            var model = _hosonhanvienService.GetAllHoSoNhanVienPaging(corporationId, phong, tukhoa, page, pageSize,
                "", "1", "", "GetAllHoSoNoHopDong");

            return new OkObjectResult(model);
        }

        [HttpGet]
        public IActionResult GetAllHoSoIn(string corporationId, string phongId, string keyword, int page, int pageSize)
        {
            var phong = !string.IsNullOrEmpty(phongId) ? phongId : "%";
            var tukhoa = !string.IsNullOrEmpty(keyword) ? keyword : "%";

            var model = _hosonhanvienService.HoSoNhanVienGetList(corporationId, phong, tukhoa, 
                "", "1", "", "GetAllHoSoNhanVien");

            return new OkObjectResult(model);
        }

        [HttpGet]
        public IActionResult GetHoSoId(string hosoId)
        {
            var model = _hosonhanvienService.GetAllHoSoNhanVienPaging("", "", "", 1, 10,
                hosoId, "1", "", "GetHoSoNhanVienId");

            return new OkObjectResult(model);
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
        public IActionResult IsLockHoSo(string hosoId)
        {
            var corporationId = User.GetSpecificClaim("CorporationId");

            var model = _lockService.LockGetList(corporationId, hosoId, "", "IsLockHoSo");

            return new OkObjectResult(model);        
        }

        #endregion HoSoNhanVien

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
        public IActionResult ChucVuNhanVienKhuVuc(string makv)
        {           
            var model = _chucvunhanvienService.ChucVuNhanVienGetList(makv, "", "", "ChucVuNhanVienGetListMaKV");
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

        [HttpGet]
        public IActionResult ThanhPhoTinhGetList()
        {
            var model = _thanhphotinhService.ThanhPhoTinhGetList("", "", "", "ThanhPhoGetList");
            return new OkObjectResult(model);
        }

        [HttpGet]
        public IActionResult QuanHuyenGetListMaTinh(string tinhId)
        {
            var model = _quanhuyenService.QuanHuyenGetList("", tinhId, "", "QuanHuyenGetListMaTP");
            return new OkObjectResult(model);
        }

        [HttpGet]
        public IActionResult PhuongXaGetListMaHuyen(string huyenId)
        {
            var model = _phuongxaService.PhuongXaGetList("", huyenId, "", "PhuongXaGetListMaQuanHuyen");
            return new OkObjectResult(model);
        }

        [HttpGet]
        public IActionResult DieuKienGetList()
        {
            var model = _dieukientimService.DieuKienTimGetList("HoSoNhanVien", "", "", "BangDieuKienTimGetList");
            return new OkObjectResult(model);
        }

        #endregion Danh muc tab Ho so nhan vien

        #endregion AJAX API
    }
}