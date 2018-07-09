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
    public class QDKhenThuong : BaseController
    {
        private readonly IHostingEnvironment _hostingEnvironment;
        private readonly NiTiErp.Application.Interfaces.IUserService _userService;
        private readonly IAuthorizationService _authorizationService;

        private IQDKhenThuongService _qdkhenthuongService;
        private IHinhThucKhenThuongService _hinhthuckhenthuongService;
        private ILoaiQuyetDinhService _loaiquyetdinhService;

        public QDKhenThuong(IHostingEnvironment hostingEnvironment,
            NiTiErp.Application.Interfaces.IUserService userService,
            IAuthorizationService authorizationService,

            IQDKhenThuongService qdkhenthuongService,
            IHinhThucKhenThuongService hinhthuckhenthuongService,
            ILoaiQuyetDinhService loaiquyetdinhService
            )
        {
            _hostingEnvironment = hostingEnvironment;
            _userService = userService;
            _authorizationService = authorizationService;

            _qdkhenthuongService = qdkhenthuongService;
            _hinhthuckhenthuongService = hinhthuckhenthuongService;
            _loaiquyetdinhService = loaiquyetdinhService;
        }

        public IActionResult Index()
        {
            return View();
        }

        #region AJAX API

        [HttpPost]
        public IActionResult AddUpdateQDKhenThuong(QDKhenThuongViewModel qdkhenthuongVm)
        {
            if (!ModelState.IsValid)
            {
                IEnumerable<ModelError> allErrors = ModelState.Values.SelectMany(v => v.Errors);
                return new BadRequestObjectResult(allErrors);
            }
            else
            {
                var username = User.GetSpecificClaim("UserName");

                qdkhenthuongVm.CreateBy = username;
                qdkhenthuongVm.CreateDate = DateTime.Now;
                qdkhenthuongVm.UpdateBy = username;
                qdkhenthuongVm.UpdateDate = DateTime.Now;

                if (qdkhenthuongVm.InsertqdktId == 1)
                {
                    var result = _authorizationService.AuthorizeAsync(User, "QDNVKT", Operations.Create); // nhap qd khen thuong
                    if (result.Result.Succeeded == false)
                    {
                        return new ObjectResult(new GenericResult(false, "Bạn không đủ quyền thêm mới."));
                    }

                    var qdkhenthuong = _qdkhenthuongService.QDKhenThuongAUD(qdkhenthuongVm, "InKhenThuong");
                    return new OkObjectResult(qdkhenthuong);
                }
                else
                {
                    var result = _authorizationService.AuthorizeAsync(User, "QDNVKT", Operations.Update); // qd khen thuong
                    if (result.Result.Succeeded == false)
                    {
                        return new ObjectResult(new GenericResult(false, "Bạn không đủ quyền sửa."));
                    }

                    var qdkhenthuong = _qdkhenthuongService.QDKhenThuongAUD(qdkhenthuongVm, "UpKhenThuong");
                    return new OkObjectResult(qdkhenthuong);
                }
            }
        }

        [HttpGet]
        public IActionResult GetListKhenThuong(string corporationId, string phongId, string keyword, int page,  int pageSize)
        {
            var khuvuc = !string.IsNullOrEmpty(corporationId) ? corporationId : "%";
            var phong = !string.IsNullOrEmpty(phongId) ? phongId : "%";
            var tukhoa = !string.IsNullOrEmpty(keyword) ? keyword : "%";

            var model = _qdkhenthuongService.GetAllKhenThuongPaging(khuvuc, phong, tukhoa, page, pageSize, "", "", "", "", "GetAllKhenThuongTim");

            return new OkObjectResult(model);
        }

        [HttpGet]
        public IActionResult GetKhenThuongId(string khenthuongId)
        {
            var model = _qdkhenthuongService.GetAllKhenThuongPaging("", "", "", 1, 10, "", "", "1", khenthuongId, "GetKhenThuongId");

            return new OkObjectResult(model);
        }

        [HttpPost]
        public IActionResult ExportExcel(string corporationId, string phongId, string keyword)
        {
            string sWebRootFolder = _hostingEnvironment.WebRootPath;
            string sFileName = $"KhenThuong.xlsx";
            // Template File
            string templateDocument = Path.Combine(sWebRootFolder, "templates", "KhenThuongExcel.xlsx");

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
                    ExcelWorksheet worksheet = package.Workbook.Worksheets["KhenThuong"];

                    var khuvuc = !string.IsNullOrEmpty(corporationId) ? corporationId : "%";
                    var phong = !string.IsNullOrEmpty(phongId) ? phongId : "%";
                    var tukhoa = !string.IsNullOrEmpty(keyword) ? keyword : "%";

                    var khenthuongDetail = _qdkhenthuongService.GetListKhenThuongPaging(khuvuc, phong, tukhoa, 1, 1000, "", "", "", "", 
                        "GetAllKhenThuongTim");

                    int rowIndex = 4;
                    int count = 1;
                    foreach (var hdDetail in khenthuongDetail.Result)
                    {
                        // Cell 1, Carton Count
                        worksheet.Cells[rowIndex, 1].Value = count.ToString();
                        worksheet.Cells[rowIndex, 2].Value = hdDetail.Ten != null ? hdDetail.Ten.ToString() : "";
                        worksheet.Cells[rowIndex, 3].Value = hdDetail.TenPhong != null ? hdDetail.TenPhong.ToString() : "";
                        worksheet.Cells[rowIndex, 4].Value = hdDetail.TenLoaiHopDong != null ? hdDetail.TenLoaiHopDong.ToString() : "";
                        worksheet.Cells[rowIndex, 5].Value = hdDetail.NgayHieuLuc != null ? hdDetail.NgayHieuLuc.Date.ToString("dd/M/yyyy", CultureInfo.InvariantCulture) : "";
                        worksheet.Cells[rowIndex, 6].Value = hdDetail.NgayKetThuc != null ? hdDetail.NgayKetThuc.Date.ToString("dd/M/yyyy", CultureInfo.InvariantCulture) : "";

                        //worksheet.Cells[rowIndex, 5].Value = hdDetail.NgaySinh != null ? hdDetail.NgaySinh.Date.ToString("dd/M/yyyy", CultureInfo.InvariantCulture) : "";

                        rowIndex++;
                        count++;
                    }

                    package.SaveAs(file); //Save the workbook.                    
                }
            }
            return new OkObjectResult(url);
        }


        #region Danh muc quyet dinh khen thuong

        [HttpGet]
        public IActionResult HinhThucKhenThuong()
        {
            var model = _hinhthuckhenthuongService.HinhThucKhenThuongGetList("", "", "", "HinhThucKhenThuongGetList");
            return new OkObjectResult(model);
        }

        [HttpGet]
        public IActionResult LoaiQuyetDinh()
        {
            var model = _loaiquyetdinhService.LoaiQuyetDinhGetList("", "PO", "", "LoaiQuyetDinhKhuVucGetList");
            return new OkObjectResult(model);
        }

        #endregion

        #endregion

    }
}
