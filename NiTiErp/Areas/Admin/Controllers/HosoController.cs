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
using NiTiErp.Utilities.Dtos;

using System.IO;
using OfficeOpenXml;
using NiTiErp.Utilities.Helpers;
using Microsoft.AspNetCore.Hosting;

namespace NiTiErp.Areas.Admin.Controllers
{
    public class HosoController : BaseController
    {
        ICongViecService _congviecService;
        IDangDoanService _dangdoanService;
        IHopDongService _hopdongService;
        ITrinhDoService _trinhdoService;
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

        private readonly IHostingEnvironment _hostingEnvironment;
        private readonly NiTiErp.Application.Interfaces.IUserService _userService;
        private readonly IAuthorizationService _authorizationService;

        public HosoController(IHostingEnvironment hostingEnvironment,
            NiTiErp.Application.Interfaces.IUserService userService, 
            IAuthorizationService authorizationService,

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

        #endregion

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
        #endregion

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

        #endregion

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

        #endregion

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
        public IActionResult ExportExcel(int billId)
        {
            string sWebRootFolder = _hostingEnvironment.WebRootPath;
            string sFileName = $"Bill_{billId}.xlsx";
            // Template File
            string templateDocument = Path.Combine(sWebRootFolder, "templates", "BillTemplate.xlsx");

            string url = $"{Request.Scheme}://{Request.Host}/{"export-files"}/{sFileName}";
            FileInfo file = new FileInfo(Path.Combine(sWebRootFolder, "export-files", sFileName));
            if (file.Exists)
            {
                file.Delete();
                file = new FileInfo(Path.Combine(sWebRootFolder, sFileName));
            }
            using (FileStream templateDocumentStream = System.IO.File.OpenRead(templateDocument))
            {
                using (ExcelPackage package = new ExcelPackage(templateDocumentStream))
                {
                    // add a new worksheet to the empty workbook
                    ExcelWorksheet worksheet = package.Workbook.Worksheets["TEDUOrder"];
                    // Data Acces, load order header data.                    
                    
                    var billDetail = _hosonhanvienService.GetAllHoSoNhanVienPaging("%", "%", "%",  1, 1,
                        "", "1", "", "GetAllHoSoNhanVien");
                    //var billDetail = _billService.GetDetail(billId);

                    // Insert customer data into template
                    worksheet.Cells[4, 1].Value = "Customer Name: ";// + billDetail.CustomerName;
                    worksheet.Cells[5, 1].Value = "Address: ";// + billDetail.CustomerAddress;
                    worksheet.Cells[6, 1].Value = "Phone: ";// + billDetail.CustomerMobile;

                    // Start Row for Detail Rows
                    int rowIndex = 9;

                    // load order details
                    var orderDetails = _hosonhanvienService.GetAllHoSoNhanVienPaging("%", "%", "%", 1, 1,
                        "", "1", "", "GetAllHoSoNhanVien");

                    //var orderDetails = _billService.GetBillDetails(billId);
                    int count = 1;
                    foreach (var orderDetail in orderDetails.Result.Results)
                    {
                        // Cell 1, Carton Count
                        worksheet.Cells[rowIndex, 1].Value = count.ToString();
                        // Cell 2, Order Number (Outline around columns 2-7 make it look like 1 column)
                        worksheet.Cells[rowIndex, 2].Value = orderDetail.Ten.ToString();
                        // Cell 8, Weight in LBS (convert KG to LBS, and rounding to whole number)
                        worksheet.Cells[rowIndex, 3].Value = orderDetail.NgaySinh.ToString();

                        worksheet.Cells[rowIndex, 4].Value = orderDetail.SoDienThoai.ToString();

                        // Increment Row Counter
                        rowIndex++;
                        count++;
                    }
                    //decimal total = (decimal)(orderDetails.Sum(x => x.Quantity * x.Price));
                    //worksheet.Cells[24, 5].Value = total.ToString("N0");

                    //var numberWord = "Total amount (by word): " + TextHelper.ToString(total);
                    //worksheet.Cells[26, 1].Value = numberWord;
                    //var billDate = billDetail.DateCreated;
                    //worksheet.Cells[28, 3].Value = billDate.Day + ", " + billDate.Month + ", " + billDate.Year;


                    package.SaveAs(file); //Save the workbook.
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
        #endregion

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