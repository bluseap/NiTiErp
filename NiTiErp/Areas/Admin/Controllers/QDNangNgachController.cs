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
    public class QDNangNgachController : BaseController
    {
        private readonly IHostingEnvironment _hostingEnvironment;
        private readonly NiTiErp.Application.Interfaces.IUserService _userService;
        private readonly IAuthorizationService _authorizationService;

        private readonly IQDNangNgachService _qdnangngachService;
        private readonly IHeSoNhanVienService _hesonhanvienService;
        private readonly IHeSoLuongService _hesoluongService;
        private readonly IBacLuongService _bacluongService;

        public QDNangNgachController(IHostingEnvironment hostingEnvironment,
           NiTiErp.Application.Interfaces.IUserService userService,
           IAuthorizationService authorizationService,

           IQDNangNgachService qdnangngachService,
           IHeSoNhanVienService hesonhanvienService,
           IHeSoLuongService hesoluongService,
           IBacLuongService bacluongService
           )
        {
            _hostingEnvironment = hostingEnvironment;
            _userService = userService;
            _authorizationService = authorizationService;

            _qdnangngachService = qdnangngachService;
            _hesonhanvienService = hesonhanvienService;
            _hesoluongService = hesoluongService;
            _bacluongService = bacluongService;
        }

        public IActionResult Index()
        {
            return View();
        }

        #region AJAX API

        [HttpPost]
        public IActionResult AddUpdateQDNangNgach(QDNangNgachViewModel qdnangngachVm)
        {
            if (!ModelState.IsValid)
            {
                IEnumerable<ModelError> allErrors = ModelState.Values.SelectMany(v => v.Errors);
                return new BadRequestObjectResult(allErrors);
            }
            else
            {
                var username = User.GetSpecificClaim("UserName");

                qdnangngachVm.CreateBy = username;
                qdnangngachVm.CreateDate = DateTime.Now;
                qdnangngachVm.UpdateBy = username;
                qdnangngachVm.UpdateDate = DateTime.Now;

                if (qdnangngachVm.InsertqdnnId == 1)
                {
                    var result = _authorizationService.AuthorizeAsync(User, "QDNVNN", Operations.Create); // nhap qd ky luat
                    if (result.Result.Succeeded == false)
                    {
                        return new ObjectResult(new GenericResult(false, "Bạn không đủ quyền thêm mới."));
                    }

                    var qdnangngach = _qdnangngachService.QDNangNgachAUD(qdnangngachVm, "InNangNgach");
                    return new OkObjectResult(qdnangngach);
                }
                else
                {
                    var result = _authorizationService.AuthorizeAsync(User, "QDNVNN", Operations.Update); // qd ky luat
                    if (result.Result.Succeeded == false)
                    {
                        return new ObjectResult(new GenericResult(false, "Bạn không đủ quyền sửa."));
                    }

                    var qdnangngach = _qdnangngachService.QDNangNgachAUD(qdnangngachVm, "UpNangNgach");
                    return new OkObjectResult(qdnangngach);
                }
            }
        }

        [HttpGet]
        public IActionResult GetListNangNgach(string corporationId, string phongId, string keyword, int page, int pageSize)
        {
            var khuvuc = !string.IsNullOrEmpty(corporationId) ? corporationId : "%";
            var phong = !string.IsNullOrEmpty(phongId) ? phongId : "%";
            var tukhoa = !string.IsNullOrEmpty(keyword) ? keyword : "%";

            var model = _qdnangngachService.GetAllNangNgachPaging(khuvuc, phong, tukhoa, page, pageSize, "", "", "", "", "GetAllNangNgachTim");

            return new OkObjectResult(model);
        }

        [HttpGet]
        public IActionResult GetListNangNgachId(string nangngachId)
        {   
            var model = _qdnangngachService.GetAllNangNgachPaging("", "", "", 1, 1000, "", "", "", nangngachId, "GetAllNangNgachId");

            return new OkObjectResult(model);
        }

        [HttpGet]
        public IActionResult GetHeSoNVChucVuBac(string hosoId)
        {
            var model = _hesonhanvienService.HeSoNhanVienGetList("", "", "", hosoId, "", "", "", "", "", "GetHeSoHoSoId");
            return new OkObjectResult(model);
        }

        [HttpGet]
        public IActionResult GetChucVuBac(string corporationId, string chucvuId, string bacluongId)
        {   
            var model = _hesoluongService.HeSoLuongGetList(corporationId, "", "", "", "", "", chucvuId, bacluongId, "", "GetHeSoLuongChucVuBac");
            return new OkObjectResult(model);
        }

        [HttpGet]
        public IActionResult BacLuongGetList()
        {
            var corporationId = User.GetSpecificClaim("CorporationId");

            var model = _bacluongService.BacLuongGetList(corporationId, "", "", "BacLuongGetList");
            return new OkObjectResult(model);
        }

        [HttpPost]
        public IActionResult ExportExcel(string corporationId, string phongId, string keyword)
        {
            string sWebRootFolder = _hostingEnvironment.WebRootPath;
            string sFileName = $"NangLuong.xlsx";
            // Template File
            string templateDocument = Path.Combine(sWebRootFolder, "templates", "NangLuongExcel.xlsx");

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
                    ExcelWorksheet worksheet = package.Workbook.Worksheets["NangLuong"];

                    var khuvuc = !string.IsNullOrEmpty(corporationId) ? corporationId : "%";
                    var phong = !string.IsNullOrEmpty(phongId) ? phongId : "%";
                    var tukhoa = !string.IsNullOrEmpty(keyword) ? keyword : "%";

                    var kyluatDetail = _qdnangngachService.GetListNangNgachPaging(khuvuc, phong, tukhoa, 1, 1000, "", "", "", "",
                        "GetAllNangNgachTim");

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

        #endregion

    }
}