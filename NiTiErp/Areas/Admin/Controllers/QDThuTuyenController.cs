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
    public class QDThuTuyenController : BaseController
    {
        private readonly IHostingEnvironment _hostingEnvironment;
        private readonly NiTiErp.Application.Interfaces.IUserService _userService;
        private readonly IAuthorizationService _authorizationService;

        private readonly IQDThuTuyenService _qdthutuyenService;
        private readonly IChucVuNhanVienService _chucvunhanvienService;
        private readonly IPhongDanhMucService _phongdanhmucService;

        public QDThuTuyenController(IHostingEnvironment hostingEnvironment,
            NiTiErp.Application.Interfaces.IUserService userService,
            IAuthorizationService authorizationService,

            IQDThuTuyenService qdthutuyenService,
            IChucVuNhanVienService chucvunhanvienService,
            IPhongDanhMucService phongdanhmucService
            )
        {
            _hostingEnvironment = hostingEnvironment;
            _userService = userService;
            _authorizationService = authorizationService;

            _qdthutuyenService = qdthutuyenService;
            _chucvunhanvienService = chucvunhanvienService;
            _phongdanhmucService = phongdanhmucService;

        }

        public IActionResult Index()
        {
            return View();
        }

        #region AJAX API

        public IActionResult AddUpdateQDThuTuyen(QDThuTuyenViewModel qdthutuyenVm)
        {
            if (!ModelState.IsValid)
            {
                IEnumerable<ModelError> allErrors = ModelState.Values.SelectMany(v => v.Errors);
                return new BadRequestObjectResult(allErrors);
            }
            else
            {
                var username = User.GetSpecificClaim("UserName");

                qdthutuyenVm.CreateBy = username;
                qdthutuyenVm.CreateDate = DateTime.Now;
                qdthutuyenVm.UpdateBy = username;
                qdthutuyenVm.UpdateDate = DateTime.Now;

                if (qdthutuyenVm.InsertqdttId == 1)
                {
                    var result = _authorizationService.AuthorizeAsync(User, "QDNVTT", Operations.Create); // nhap qd thu tuyen
                    if (result.Result.Succeeded == false)
                    {
                        return new ObjectResult(new GenericResult(false, "Bạn không đủ quyền thêm mới."));
                    }

                    var qdthutuyen = _qdthutuyenService.QDThuTuyenAUD(qdthutuyenVm, "InThuTuyen");
                    return new OkObjectResult(qdthutuyen);
                }
                else
                {
                    var result = _authorizationService.AuthorizeAsync(User, "QDNVTT", Operations.Update); // qd thu tuyen
                    if (result.Result.Succeeded == false)
                    {
                        return new ObjectResult(new GenericResult(false, "Bạn không đủ quyền sửa."));
                    }

                    var qdthutuyen = _qdthutuyenService.QDThuTuyenAUD(qdthutuyenVm, "UpThuTuyen");
                    return new OkObjectResult(qdthutuyen);
                }
            }
        }

        [HttpGet]
        public IActionResult GetListThuTuyen(string corporationId, string phongId, string keyword, int page, int pageSize)
        {
            var khuvuc = !string.IsNullOrEmpty(corporationId) ? corporationId : "%";
            var phong = !string.IsNullOrEmpty(phongId) ? phongId : "%";
            var tukhoa = !string.IsNullOrEmpty(keyword) ? keyword : "%";

            var model = _qdthutuyenService.GetAllThuTuyenPaging(khuvuc, phong, tukhoa, page, pageSize, "", "", "", "", "GetAllThuTuyenTim");

            return new OkObjectResult(model);
        }

        [HttpGet]
        public IActionResult GetThuTuyenId(string thutuyenId)
        {
            var model = _qdthutuyenService.GetAllThuTuyenPaging("", "", "", 1, 1000, "", "", "", thutuyenId, "GetAllThuTuyenId");

            return new OkObjectResult(model);
        }

        public IActionResult ExportExcel(string corporationId, string phongId, string keyword)
        {
            string sWebRootFolder = _hostingEnvironment.WebRootPath;
            string sFileName = $"ThuTuyen.xlsx";
            // Template File
            string templateDocument = Path.Combine(sWebRootFolder, "templates", "ThuTuyenExcel.xlsx");

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
                    ExcelWorksheet worksheet = package.Workbook.Worksheets["ThuTuyen"];

                    var khuvuc = !string.IsNullOrEmpty(corporationId) ? corporationId : "%";
                    var phong = !string.IsNullOrEmpty(phongId) ? phongId : "%";
                    var tukhoa = !string.IsNullOrEmpty(keyword) ? keyword : "%";

                    var thutuyenDetail = _qdthutuyenService.GetListThuTuyenPaging(khuvuc, phong, tukhoa, 1, 1000, "", "", "", "",
                        "GetAllThuTuyenTim");

                    int rowIndex = 4;
                    int count = 1;
                    foreach (var hdDetail in thutuyenDetail.Result)
                    {
                        // Cell 1, Carton Count
                        worksheet.Cells[rowIndex, 1].Value = count.ToString();
                        worksheet.Cells[rowIndex, 2].Value = hdDetail.Ten != null ? hdDetail.Ten.ToString() : "";
                        worksheet.Cells[rowIndex, 3].Value = hdDetail.TenPhong != null ? hdDetail.TenPhong.ToString() : "";
                        // worksheet.Cells[rowIndex, 4].Value = hdDetail.TenLoaiHopDong != null ? hdDetail.TenLoaiHopDong.ToString() : "";
                        worksheet.Cells[rowIndex, 4].Value = hdDetail.NgayHieuLuc != null ? hdDetail.NgayHieuLuc.Date.ToString("dd/M/yyyy", CultureInfo.InvariantCulture) : "";
                        worksheet.Cells[rowIndex, 5].Value = hdDetail.NgayKetThuc != null ? hdDetail.NgayKetThuc.Date.ToString("dd/M/yyyy", CultureInfo.InvariantCulture) : "";

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