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
    public class QDKyLuatController : BaseController
    {
        private readonly IHostingEnvironment _hostingEnvironment;
        private readonly NiTiErp.Application.Interfaces.IUserService _userService;
        private readonly IAuthorizationService _authorizationService;

        private IQDKyLuatService _qdkyluatService;
        private IHinhThucKyLuatService _hinhthuckyluatService;
        private ILoaiQuyetDinhService _loaiquyetdinhService;

        public QDKyLuatController(IHostingEnvironment hostingEnvironment,
            NiTiErp.Application.Interfaces.IUserService userService,
            IAuthorizationService authorizationService,

            IQDKyLuatService qdkyluatService,
            IHinhThucKyLuatService hinhthuckyluatService,
            ILoaiQuyetDinhService loaiquyetdinhService
            )
        {
            _hostingEnvironment = hostingEnvironment;
            _userService = userService;
            _authorizationService = authorizationService;

            _qdkyluatService = qdkyluatService;
            _hinhthuckyluatService = hinhthuckyluatService;
            _loaiquyetdinhService = loaiquyetdinhService;
        }

        public IActionResult Index()
        {
            return View();
        }

        #region AJAX API

        [HttpPost]
        public IActionResult AddUpdateQDKyLuat(QDKyLuatViewModel qdkyluatVm)
        {
            if (!ModelState.IsValid)
            {
                IEnumerable<ModelError> allErrors = ModelState.Values.SelectMany(v => v.Errors);
                return new BadRequestObjectResult(allErrors);
            }
            else
            {
                var username = User.GetSpecificClaim("UserName");

                qdkyluatVm.CreateBy = username;
                qdkyluatVm.CreateDate = DateTime.Now;
                qdkyluatVm.UpdateBy = username;
                qdkyluatVm.UpdateDate = DateTime.Now;

                if (qdkyluatVm.InsertqdklId == 1)
                {
                    var result = _authorizationService.AuthorizeAsync(User, "QDNVKL", Operations.Create); // nhap qd ky luat
                    if (result.Result.Succeeded == false)
                    {
                        return new ObjectResult(new GenericResult(false, "Bạn không đủ quyền thêm mới."));
                    }

                    var qdkyluat = _qdkyluatService.QDKyLuatAUD(qdkyluatVm, "InKyLuat");
                    return new OkObjectResult(qdkyluat);
                }
                else
                {
                    var result = _authorizationService.AuthorizeAsync(User, "QDNVKL", Operations.Update); // qd ky luat
                    if (result.Result.Succeeded == false)
                    {
                        return new ObjectResult(new GenericResult(false, "Bạn không đủ quyền sửa."));
                    }

                    var qdkyluat = _qdkyluatService.QDKyLuatAUD(qdkyluatVm, "UpKyLuat");
                    return new OkObjectResult(qdkyluat);
                }
            }
        }

        [HttpGet]
        public IActionResult GetListKyLuat(string corporationId, string phongId, string keyword, int page, int pageSize)
        {
            var khuvuc = !string.IsNullOrEmpty(corporationId) ? corporationId : "%";
            var phong = !string.IsNullOrEmpty(phongId) ? phongId : "%";
            var tukhoa = !string.IsNullOrEmpty(keyword) ? keyword : "%";

            var model = _qdkyluatService.GetAllKyLuatPaging(khuvuc, phong, tukhoa, page, pageSize, "", "", "", "", "GetAllKyLuatTim");

            return new OkObjectResult(model);
        }

        [HttpGet]
        public IActionResult GetKyLuatId(string kyluatId)
        {
            var model = _qdkyluatService.GetAllKyLuatPaging("", "", "", 1, 10, "", "", "1", kyluatId, "GetKyLuatId");

            return new OkObjectResult(model);
        }

        [HttpPost]
        public IActionResult ExportExcel(string corporationId, string phongId, string keyword)
        {
            string sWebRootFolder = _hostingEnvironment.WebRootPath;
            string sFileName = $"KyLuat.xlsx";
            // Template File
            string templateDocument = Path.Combine(sWebRootFolder, "templates", "KyLuatExcel.xlsx");

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
                    ExcelWorksheet worksheet = package.Workbook.Worksheets["KyLuat"];

                    var khuvuc = !string.IsNullOrEmpty(corporationId) ? corporationId : "%";
                    var phong = !string.IsNullOrEmpty(phongId) ? phongId : "%";
                    var tukhoa = !string.IsNullOrEmpty(keyword) ? keyword : "%";

                    var kyluatDetail = _qdkyluatService.GetListKyLuatPaging(khuvuc, phong, tukhoa, 1, 1000, "", "", "", "",
                        "GetAllKyLuatTim");

                    int rowIndex = 4;
                    int count = 1;
                    foreach (var hdDetail in kyluatDetail.Result)
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
        public IActionResult HinhThucKyLuat()
        {
            var model = _hinhthuckyluatService.HinhThucKyLuatGetList("", "", "", "HinhThucKyLuatGetList");
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