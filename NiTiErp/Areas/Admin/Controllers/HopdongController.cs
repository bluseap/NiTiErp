using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using NiTiErp.Application.Dapper.Interfaces;
using NiTiErp.Application.Dapper.ViewModels;
using NiTiErp.Authorization;
using NiTiErp.Extensions;
using NiTiErp.Utilities.Dtos;
using NiTiErp.Utilities.Helpers;
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
    public class HopdongController : BaseController
    {
        private readonly IHostingEnvironment _hostingEnvironment;
        private readonly NiTiErp.Application.Interfaces.IUserService _userService;
        private readonly IAuthorizationService _authorizationService;

        private IDieuKienTimService _dieukientimService;
        private IHopDongService _hopdongService;

        public HopdongController(IHostingEnvironment hostingEnvironment,
            NiTiErp.Application.Interfaces.IUserService userService,
            IAuthorizationService authorizationService,

            IHopDongService hopdongService,
            IDieuKienTimService dieukientimService        )
        {
            _hostingEnvironment = hostingEnvironment;
            _userService = userService;
            _authorizationService = authorizationService;

            _hopdongService = hopdongService;
            _dieukientimService = dieukientimService;
        }

        public IActionResult Index()
        {
            return View();
        }

        #region AJAX API

        #region Hop dong

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
                else if (hopdongVm.InsertUpdateId == 1 && hopdongVm.InsertUpdateHopDongId == 1)
                {
                    var result = _authorizationService.AuthorizeAsync(User, "NLLNV", Operations.Update); // nhap nhan vien
                    if (result.Result.Succeeded == false)
                    {
                        return new ObjectResult(new GenericResult(false, "Bạn không đủ quyền sửa."));
                    }

                    var hopdong = _hopdongService.HopDongAUD(hopdongVm, "UpHopDong");
                    return new OkObjectResult(hopdong);
                }
                else
                {
                    return new OkObjectResult(hopdongVm);
                }
            }
        }

        [HttpGet]
        public IActionResult GetListHopDong(string corporationId, string phongId, string keyword, int page,
            int pageSize, string hosoId, string hopdongId)
        {
            var khuvuc = !string.IsNullOrEmpty(corporationId) ? corporationId : "%";
            var phong = !string.IsNullOrEmpty(phongId) ? phongId : "%";
            var tukhoa = !string.IsNullOrEmpty(keyword) ? keyword : "%";

            var model = _hopdongService.GetAllHopDongPaging(khuvuc, phong, tukhoa, page, pageSize,
                hosoId, "", "", hopdongId, "GetAllHopDongTim");

            return new OkObjectResult(model);
        }

        [HttpGet]
        public IActionResult GetListHopDongDieuKien(string corporationId, string phongId, string keyword, int page,
            int pageSize, string hosoId, string hopdongId)
        {
            var khuvuc = !string.IsNullOrEmpty(corporationId) ? corporationId : "%";
            var phong = !string.IsNullOrEmpty(phongId) ? phongId : "%";
            var tukhoa = !string.IsNullOrEmpty(keyword) ? keyword : "%";

            var model = _hopdongService.GetAllHopDongPaging(khuvuc, phong, tukhoa, 1, 1000,
                hosoId, "", "", hopdongId, "GetAllHopDongDieuKien");

            return new OkObjectResult(model);
        }

        [HttpGet]
        public IActionResult GetAllHopDongId(string hopdongId)
        {
            var model = _hopdongService.GetAllHopDongPaging("", "", "", 1, 10,
                "", "", "", hopdongId, "GetAllHopDongId");

            return new OkObjectResult(model);
        }

        [HttpGet]
        public IActionResult GetAllHoSoHopDongId(string hosoId)
        {
            var model = _hopdongService.GetAllHopDongPaging("", "", "", 1, 10,
                hosoId, "", "", "", "GetAllHoSoHopDongId");

            return new OkObjectResult(model);
        }

        [HttpGet]
        public IActionResult GetAllHopDongDate(string corporationId, DateTime tungay, DateTime denngay)
        {
            var model = _hopdongService.GetAllHopDongDatePaging(corporationId, "", "", 1, 10000, "", "", "", 
                tungay, denngay, denngay, "", "", "GetListHopDongHetHan");

            return new OkObjectResult(model);
        }

        [HttpGet]
        public IActionResult GetAllHopDongGanDate(string corporationId, DateTime tungay, DateTime denngay)
        {
            var model = _hopdongService.GetAllHopDongDatePaging(corporationId, "", "", 1, 10000, "", "", "",
                tungay, denngay, denngay, "", "", "GetListGanHopDongHetHan");

            return new OkObjectResult(model);
        }

        [HttpGet]
        public IActionResult GetListHopDongDieuKienDate(string corporationId, string phongId, string keyword, int page,
            int pageSize, string hosoId, DateTime tungay, DateTime denngay, string dieukien, string hopdongId)
        {
            var khuvuc = !string.IsNullOrEmpty(corporationId) ? corporationId : "%";
            var phong = !string.IsNullOrEmpty(phongId) ? phongId : "%";
            var tukhoa = !string.IsNullOrEmpty(keyword) ? keyword : "%";

            if (dieukien == "4") // Het han hop dong theo ngay
            {
                var model = _hopdongService.GetAllHopDongDatePaging(khuvuc, phong, tukhoa, 1, 1000, "", "", "",
                    tungay, denngay, denngay, dieukien, "", "GetListDieuKienDate");

                return new OkObjectResult(model);
            }
            else if (hopdongId != "%")
            {
                var model = _hopdongService.GetAllHopDongDatePaging(khuvuc, phong, tukhoa, 1, 1000, "", "", "",
                    tungay, denngay, denngay, dieukien, hopdongId, "GetListLoaiHopDong");

                return new OkObjectResult(model);
            }
            else 
            {
                var model = _hopdongService.GetAllHopDongDatePaging(khuvuc, phong, tukhoa, 1, 1000, "", "", "",
                    tungay, denngay, denngay, dieukien, "", "GetListDieuKienDate");

                return new OkObjectResult(model);
            }
        }       

        [HttpPost]
        public IActionResult ExportExcelHopDong(string corporationId, string phongId, string keyword, int page,
            int pageSize, string hosoId, string hopdongId)
        {           
            string sWebRootFolder = _hostingEnvironment.WebRootPath;
            string sFileName = $"HopDong.xlsx";
            // Template File
            string templateDocument = Path.Combine(sWebRootFolder, "templates", "HopDongExcel.xlsx");

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
                    ExcelWorksheet worksheet = package.Workbook.Worksheets["HopDong"];

                    var khuvuc = !string.IsNullOrEmpty(corporationId) ? corporationId : "%";
                    var phong = !string.IsNullOrEmpty(phongId) ? phongId : "%";
                    var tukhoa = !string.IsNullOrEmpty(keyword) ? keyword : "%";

                    var hopdongDetail = _hopdongService.GetAllHopDongPagingExcel(khuvuc, phong, tukhoa, page, pageSize,
                        hosoId, "", "", hopdongId, "GetAllHopDongTim");                    

                    int rowIndex = 4;
                    int count = 1;
                    foreach (var hdDetail in hopdongDetail.Result)
                    {
                        // Cell 1, Carton Count
                        worksheet.Cells[rowIndex, 1].Value = count.ToString();
                        worksheet.Cells[rowIndex, 2].Value = hdDetail.Ten != null ? hdDetail.Ten.ToString() : "";
                        worksheet.Cells[rowIndex, 3].Value = hdDetail.TenPhong != null ? hdDetail.TenPhong.ToString() : "";
                        worksheet.Cells[rowIndex, 4].Value = hdDetail.TenLoaiHopDong != null ? hdDetail.TenLoaiHopDong.ToString() : "";
                        worksheet.Cells[rowIndex, 5].Value = hdDetail.NgayHieuLuc != null ? hdDetail.NgayHieuLuc.Date.ToString("dd/M/yyyy", CultureInfo.InvariantCulture) : "";
                        worksheet.Cells[rowIndex, 6].Value = hdDetail.NgayHetHan != null ? hdDetail.NgayHetHan.Date.ToString("dd/M/yyyy", CultureInfo.InvariantCulture) : "";

                        //worksheet.Cells[rowIndex, 5].Value = hdDetail.NgaySinh != null ? hdDetail.NgaySinh.Date.ToString("dd/M/yyyy", CultureInfo.InvariantCulture) : "";

                        rowIndex++;
                        count++;
                    }

                    package.SaveAs(file); //Save the workbook.                    
                }
            }
            return new OkObjectResult(url);
        }       

        [HttpPost]
        public IActionResult ExportExcelHetHanHopDong(string hosoId, DateTime tungay, DateTime denngay)
        {
            string sWebRootFolder = _hostingEnvironment.WebRootPath;
            string sFileName = $"HopDongHH.xlsx";
            // Template File
            string templateDocument = Path.Combine(sWebRootFolder, "templates", "HopDongHHExcel.xlsx");

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
                    ExcelWorksheet worksheet = package.Workbook.Worksheets["HopDongHH"];                    

                    var hopdongDetail = _hopdongService.GetAllHopDongDatePagingExcel("", "", "", 1, 10000, "", "", "",
                        tungay, denngay, denngay, "", "", "GetListHopDongHetHan");                   

                    int rowIndex = 4;
                    int count = 1;
                    foreach (var hdDetail in hopdongDetail.Result)
                    {
                        // Cell 1, Carton Count
                        worksheet.Cells[rowIndex, 1].Value = count.ToString();
                        worksheet.Cells[rowIndex, 2].Value = hdDetail.Ten != null ? hdDetail.Ten.ToString() : "";
                        worksheet.Cells[rowIndex, 3].Value = hdDetail.TenPhong != null ? hdDetail.TenPhong.ToString() : "";
                        worksheet.Cells[rowIndex, 4].Value = hdDetail.TenLoaiHopDong != null ? hdDetail.TenLoaiHopDong.ToString() : "";
                        worksheet.Cells[rowIndex, 5].Value = hdDetail.NgayHieuLuc != null ? hdDetail.NgayHieuLuc.Date.ToString("dd/M/yyyy", CultureInfo.InvariantCulture) : "";
                        worksheet.Cells[rowIndex, 6].Value = hdDetail.NgayHetHan != null ? hdDetail.NgayHetHan.Date.ToString("dd/M/yyyy", CultureInfo.InvariantCulture) : "";

                        rowIndex++;
                        count++;
                    }

                    package.SaveAs(file); //Save the workbook.                    
                }
            }
            return new OkObjectResult(url);
        }

        [HttpPost]
        public IActionResult ExportExcelGanHetHanHopDong(string hosoId, DateTime tungay, DateTime denngay)
        {
            string sWebRootFolder = _hostingEnvironment.WebRootPath;
            string sFileName = $"HopDongHH.xlsx";
            // Template File
            string templateDocument = Path.Combine(sWebRootFolder, "templates", "HopDongHHExcel.xlsx");

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
                    ExcelWorksheet worksheet = package.Workbook.Worksheets["HopDongHH"];

                    var hopdongDetail = _hopdongService.GetAllHopDongDatePagingExcel("", "", "", 1, 10000, "", "", "",
                        tungay, denngay, denngay, "", "", "GetListGanHopDongHetHan");

                    int rowIndex = 4;
                    int count = 1;
                    foreach (var hdDetail in hopdongDetail.Result)
                    {
                        // Cell 1, Carton Count
                        worksheet.Cells[rowIndex, 1].Value = count.ToString();
                        worksheet.Cells[rowIndex, 2].Value = hdDetail.Ten != null ? hdDetail.Ten.ToString() : "";
                        worksheet.Cells[rowIndex, 3].Value = hdDetail.TenPhong != null ? hdDetail.TenPhong.ToString() : "";
                        worksheet.Cells[rowIndex, 4].Value = hdDetail.TenLoaiHopDong != null ? hdDetail.TenLoaiHopDong.ToString() : "";
                        worksheet.Cells[rowIndex, 5].Value = hdDetail.NgayHieuLuc != null ? hdDetail.NgayHieuLuc.Date.ToString("dd/M/yyyy", CultureInfo.InvariantCulture) : "";
                        worksheet.Cells[rowIndex, 6].Value = hdDetail.NgayHetHan != null ? hdDetail.NgayHetHan.Date.ToString("dd/M/yyyy", CultureInfo.InvariantCulture) : "";

                        rowIndex++;
                        count++;
                    }

                    package.SaveAs(file); //Save the workbook.                    
                }
            }
            return new OkObjectResult(url);
        }        

        [HttpPost]
        public IActionResult ExportExcelHopDongDieuKien(string corporationId, string phongId, string keyword, int page,
            int pageSize, string hosoId, string hopdongId)
        {
            string sWebRootFolder = _hostingEnvironment.WebRootPath;
            string sFileName = $"HopDong.xlsx";
            // Template File
            string templateDocument = Path.Combine(sWebRootFolder, "templates", "HopDongExcel.xlsx");

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
                    ExcelWorksheet worksheet = package.Workbook.Worksheets["HopDong"];

                    var khuvuc = !string.IsNullOrEmpty(corporationId) ? corporationId : "%";
                    var phong = !string.IsNullOrEmpty(phongId) ? phongId : "%";
                    var tukhoa = !string.IsNullOrEmpty(keyword) ? keyword : "%";

                    var hopdongDetail = _hopdongService.GetAllHopDongPagingExcel(khuvuc, phong, tukhoa, 1, 1000,
                        hosoId, "", "", hopdongId, "GetAllHopDongDieuKien");

                    if (keyword == "3")
                    {
                        worksheet.Cells[2, 1].Value = "(Nhân viên nghĩ hưu)";
                    }
                    if (keyword == "2")
                    {
                        worksheet.Cells[2, 1].Value = "(Nhân viên thôi việc)";
                    }

                    int rowIndex = 4;
                    int count = 1;
                    foreach (var hdDetail in hopdongDetail.Result)
                    {
                        // Cell 1, Carton Count
                        worksheet.Cells[rowIndex, 1].Value = count.ToString();
                        worksheet.Cells[rowIndex, 2].Value = hdDetail.Ten != null ? hdDetail.Ten.ToString() : "";
                        worksheet.Cells[rowIndex, 3].Value = hdDetail.TenPhong != null ? hdDetail.TenPhong.ToString() : "";
                        worksheet.Cells[rowIndex, 4].Value = hdDetail.TenLoaiHopDong != null ? hdDetail.TenLoaiHopDong.ToString() : "";
                        worksheet.Cells[rowIndex, 5].Value = hdDetail.NgayHieuLuc != null ? hdDetail.NgayHieuLuc.Date.ToString("dd/M/yyyy", CultureInfo.InvariantCulture) : "";
                        worksheet.Cells[rowIndex, 6].Value = hdDetail.NgayHetHan != null ? hdDetail.NgayHetHan.Date.ToString("dd/M/yyyy", CultureInfo.InvariantCulture) : "";

                        rowIndex++;
                        count++;
                    }

                    package.SaveAs(file); //Save the workbook.                    
                }
            }
            return new OkObjectResult(url);
        }        

        [HttpPost]
        public IActionResult ExportExcelHopDongDieuKienDate(string corporationId, string phongId, string keyword, int page,
            int pageSize, string hosoId, DateTime tungay, DateTime denngay, string dieukien, string hopdongId)
        {
            string sWebRootFolder = _hostingEnvironment.WebRootPath;
            string sFileName = $"HopDong.xlsx";
            // Template File
            string templateDocument = Path.Combine(sWebRootFolder, "templates", "HopDongExcel.xlsx");

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
                    ExcelWorksheet worksheet = package.Workbook.Worksheets["HopDong"];

                    var khuvuc = !string.IsNullOrEmpty(corporationId) ? corporationId : "%";
                    var phong = !string.IsNullOrEmpty(phongId) ? phongId : "%";
                    var tukhoa = !string.IsNullOrEmpty(keyword) ? keyword : "%";
                    

                    if (dieukien == "4") // Het han hop dong theo ngay
                    {
                        var hopdongDetail = _hopdongService.GetAllHopDongDatePagingExcel(khuvuc, phong, tukhoa, 1, 1000, "", "", "",
                            tungay, denngay, denngay, dieukien, "", "GetListDieuKienDate");

                        int rowIndex = 4;
                        int count = 1;
                        foreach (var hdDetail in hopdongDetail.Result)
                        {
                            // Cell 1, Carton Count
                            worksheet.Cells[rowIndex, 1].Value = count.ToString();
                            worksheet.Cells[rowIndex, 2].Value = hdDetail.Ten != null ? hdDetail.Ten.ToString() : "";
                            worksheet.Cells[rowIndex, 3].Value = hdDetail.TenPhong != null ? hdDetail.TenPhong.ToString() : "";
                            worksheet.Cells[rowIndex, 4].Value = hdDetail.TenLoaiHopDong != null ? hdDetail.TenLoaiHopDong.ToString() : "";
                            worksheet.Cells[rowIndex, 5].Value = hdDetail.NgayHieuLuc != null ? hdDetail.NgayHieuLuc.Date.ToString("dd/M/yyyy", CultureInfo.InvariantCulture) : "";
                            worksheet.Cells[rowIndex, 6].Value = hdDetail.NgayHetHan != null ? hdDetail.NgayHetHan.Date.ToString("dd/M/yyyy", CultureInfo.InvariantCulture) : "";

                            rowIndex++;
                            count++;
                        }

                        package.SaveAs(file); //Save the workbook.       
                    }
                    else if (hopdongId != "%")
                    {
                        var hopdongDetail = _hopdongService.GetAllHopDongDatePagingExcel(khuvuc, phong, tukhoa, 1, 1000, "", "", "",
                            tungay, denngay, denngay, dieukien, hopdongId, "GetListLoaiHopDong");

                        int rowIndex = 4;
                        int count = 1;
                        foreach (var hdDetail in hopdongDetail.Result)
                        {
                            // Cell 1, Carton Count
                            worksheet.Cells[rowIndex, 1].Value = count.ToString();
                            worksheet.Cells[rowIndex, 2].Value = hdDetail.Ten != null ? hdDetail.Ten.ToString() : "";
                            worksheet.Cells[rowIndex, 3].Value = hdDetail.TenPhong != null ? hdDetail.TenPhong.ToString() : "";
                            worksheet.Cells[rowIndex, 4].Value = hdDetail.TenLoaiHopDong != null ? hdDetail.TenLoaiHopDong.ToString() : "";
                            worksheet.Cells[rowIndex, 5].Value = hdDetail.NgayHieuLuc != null ? hdDetail.NgayHieuLuc.Date.ToString("dd/M/yyyy", CultureInfo.InvariantCulture) : "";
                            worksheet.Cells[rowIndex, 6].Value = hdDetail.NgayHetHan != null ? hdDetail.NgayHetHan.Date.ToString("dd/M/yyyy", CultureInfo.InvariantCulture) : "";

                            rowIndex++;
                            count++;
                        }

                        package.SaveAs(file); //Save the workbook.       
                    }
                    else
                    {
                        var hopdongDetail = _hopdongService.GetAllHopDongDatePagingExcel(khuvuc, phong, tukhoa, 1, 1000, "", "", "",
                            tungay, denngay, denngay, dieukien, "", "GetListDieuKienDate");

                        int rowIndex = 4;
                        int count = 1;
                        foreach (var hdDetail in hopdongDetail.Result)
                        {
                            // Cell 1, Carton Count
                            worksheet.Cells[rowIndex, 1].Value = count.ToString();
                            worksheet.Cells[rowIndex, 2].Value = hdDetail.Ten != null ? hdDetail.Ten.ToString() : "";
                            worksheet.Cells[rowIndex, 3].Value = hdDetail.TenPhong != null ? hdDetail.TenPhong.ToString() : "";
                            worksheet.Cells[rowIndex, 4].Value = hdDetail.TenLoaiHopDong != null ? hdDetail.TenLoaiHopDong.ToString() : "";
                            worksheet.Cells[rowIndex, 5].Value = hdDetail.NgayHieuLuc != null ? hdDetail.NgayHieuLuc.Date.ToString("dd/M/yyyy", CultureInfo.InvariantCulture) : "";
                            worksheet.Cells[rowIndex, 6].Value = hdDetail.NgayHetHan != null ? hdDetail.NgayHetHan.Date.ToString("dd/M/yyyy", CultureInfo.InvariantCulture) : "";

                            rowIndex++;
                            count++;
                        }

                        package.SaveAs(file); //Save the workbook.       
                    }                                    
                }
            }
            return new OkObjectResult(url);
        }

        [HttpPost]
        public IActionResult ExportExcelHopDongChiTiet(string hopdongId, string hosoId, string corporationId, string phongId, string timdieukien)
        {
            string sWebRootFolder = _hostingEnvironment.WebRootPath;
            string sFileName = $"HopDongCT.xlsx";
            // Template File
            string templateDocument = Path.Combine(sWebRootFolder, "templates", "HopDongCTExcel.xlsx");

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
                    ExcelWorksheet worksheet = package.Workbook.Worksheets["HopDongCT"];                  

                    var hopdongDetail = _hopdongService.GetAllHopDongPagingExcel("", "", "", 1, 1000,
                        hosoId, "", "", hopdongId, "GetHopDongChiTiet");
                    


                    int rowIndex = 9;
                    int count = 1;
                    foreach (var hdDetail in hopdongDetail.Result)
                    {
                        worksheet.Cells[4, 3].Value = hdDetail.Ten != null ? hdDetail.Ten.ToString() : "";
                        worksheet.Cells[5, 3].Value = hdDetail.TenKhuVuc != null ? hdDetail.TenKhuVuc.ToString() : "";
                        worksheet.Cells[6, 3].Value = hdDetail.TenPhong != null ? hdDetail.TenPhong.ToString() : "";

                        // Cell 1, Carton Count
                        worksheet.Cells[rowIndex, 1].Value = count.ToString();
                        //worksheet.Cells[rowIndex, 2].Value = hdDetail.Ten != null ? hdDetail.Ten.ToString() : "";
                        //worksheet.Cells[rowIndex, 3].Value = hdDetail.TenPhong != null ? hdDetail.TenPhong.ToString() : "";
                        worksheet.Cells[rowIndex, 2].Value = hdDetail.TenLoaiHopDong != null ? hdDetail.TenLoaiHopDong.ToString() : "";
                        worksheet.Cells[rowIndex, 3].Value = hdDetail.NgayHieuLuc != null ? hdDetail.NgayHieuLuc.Date.ToString("dd/M/yyyy", CultureInfo.InvariantCulture) : "";
                        worksheet.Cells[rowIndex, 4].Value = hdDetail.NgayHetHan != null ? hdDetail.NgayHetHan.Date.ToString("dd/M/yyyy", CultureInfo.InvariantCulture) : "";

                        rowIndex++;
                        count++;
                    }
                    package.SaveAs(file); //Save the workbook.                    
                }
            }
            return new OkObjectResult(url);
        }

        #endregion

        #region Danh muc Hop dong nhan vien
        [HttpGet]
        public IActionResult DieuKienGetList()
        {          
            var model = _dieukientimService.DieuKienTimGetList("HopDongNhanVien", "", "", "BangDieuKienTimGetList");
            return new OkObjectResult(model);
        }

        #endregion

        #endregion

    }
}