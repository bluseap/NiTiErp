﻿using Microsoft.AspNetCore.Authorization;
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
    public class QDBoNhiemController : BaseController
    {
        private readonly IHostingEnvironment _hostingEnvironment;
        private readonly NiTiErp.Application.Interfaces.IUserService _userService;
        private readonly IAuthorizationService _authorizationService;

        private readonly IQDBoNhiemService _qdbonhiemService;
        private readonly IChucVuNhanVienService _chucvunhanvienService;
        private readonly IPhongDanhMucService _phongdanhmucService;

        public QDBoNhiemController(IHostingEnvironment hostingEnvironment,
            NiTiErp.Application.Interfaces.IUserService userService,
            IAuthorizationService authorizationService,

            IQDBoNhiemService qdbonhiemService,
            IChucVuNhanVienService chucvunhanvienService,
            IPhongDanhMucService phongdanhmucService            
            )
        {
            _hostingEnvironment = hostingEnvironment;
            _userService = userService;
            _authorizationService = authorizationService;

            _qdbonhiemService = qdbonhiemService;
            _chucvunhanvienService = chucvunhanvienService;
            _phongdanhmucService = phongdanhmucService;

        }

        public IActionResult Index()
        {
            return View();
        }

        #region AJAX API

        public IActionResult AddUpdateQDBoNhiem(QDBoNhiemViewModel qdbonhiemVm)
        {
            if (!ModelState.IsValid)
            {
                IEnumerable<ModelError> allErrors = ModelState.Values.SelectMany(v => v.Errors);
                return new BadRequestObjectResult(allErrors);
            }
            else
            {
                var username = User.GetSpecificClaim("UserName");

                qdbonhiemVm.CreateBy = username;
                qdbonhiemVm.CreateDate = DateTime.Now;
                qdbonhiemVm.UpdateBy = username;
                qdbonhiemVm.UpdateDate = DateTime.Now;

                if (qdbonhiemVm.InsertqdnnId == 1)
                {
                    var result = _authorizationService.AuthorizeAsync(User, "QDNVBN", Operations.Create); // nhap qd bo nhiem
                    if (result.Result.Succeeded == false)
                    {
                        return new ObjectResult(new GenericResult(false, "Bạn không đủ quyền thêm mới."));
                    }

                    var qdbonhiem = _qdbonhiemService.QDBoNhiemAUD(qdbonhiemVm, "InBoNhiem");
                    return new OkObjectResult(qdbonhiem);
                }
                else
                {
                    var result = _authorizationService.AuthorizeAsync(User, "QDNVBN", Operations.Update); // qd bo nhiem
                    if (result.Result.Succeeded == false)
                    {
                        return new ObjectResult(new GenericResult(false, "Bạn không đủ quyền sửa."));
                    }

                    var qdbonhiem = _qdbonhiemService.QDBoNhiemAUD(qdbonhiemVm, "UpBoNhiem");
                    return new OkObjectResult(qdbonhiem);
                }
            }
        }

        [HttpGet]
        public IActionResult GetListBoNhiem(string corporationId, string phongId, string keyword, int page, int pageSize)
        {
            var khuvuc = !string.IsNullOrEmpty(corporationId) ? corporationId : "%";
            var phong = !string.IsNullOrEmpty(phongId) ? phongId : "%";
            var tukhoa = !string.IsNullOrEmpty(keyword) ? keyword : "%";

            var model = _qdbonhiemService.GetAllBoNhiemPaging(khuvuc, phong, tukhoa, page, pageSize, "", "", "", "", "GetAllBoNhiemTim");

            return new OkObjectResult(model);
        }

        [HttpGet]
        public IActionResult GetBoNhiemId(string dieudongId)
        {
            var model = _qdbonhiemService.GetAllBoNhiemPaging("", "", "", 1, 1000, "", "", "", dieudongId, "GetAllBoNhiemId");

            return new OkObjectResult(model);
        }


        #endregion

        #region Danh muc

        [HttpGet]
        public IActionResult GetListPhong()
        {
            var model = _phongdanhmucService.PhongDanhMucGetList("", "", "", "GetListPhong");
            return new OkObjectResult(model);
        }

        [HttpGet]
        public IActionResult ChucVuNhanVienGetList()
        {           
            var model = _chucvunhanvienService.ChucVuNhanVienGetList("", "", "", "ChucVuNhanVienGetListAll");
            return new OkObjectResult(model);
        }

        [HttpGet]
        public IActionResult ChucVuKhuVucGetList(string makv)
        {
            var model = _chucvunhanvienService.ChucVuNhanVienGetList(makv, "", "", "ChucVuNhanVienGetList");
            return new OkObjectResult(model);
        }

        #endregion

        [HttpPost]
        public IActionResult ExportExcel(string corporationId, string phongId, string keyword)
        {
            string sWebRootFolder = _hostingEnvironment.WebRootPath;
            string sFileName = $"BoNhiem.xlsx";
            // Template File
            string templateDocument = Path.Combine(sWebRootFolder, "templates", "BoNhiemExcel.xlsx");

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
                    ExcelWorksheet worksheet = package.Workbook.Worksheets["BoNhiem"];

                    var khuvuc = !string.IsNullOrEmpty(corporationId) ? corporationId : "%";
                    var phong = !string.IsNullOrEmpty(phongId) ? phongId : "%";
                    var tukhoa = !string.IsNullOrEmpty(keyword) ? keyword : "%";

                    var bonhiemDetail = _qdbonhiemService.GetListBoNhiemPaging(khuvuc, phong, tukhoa, 1, 1000, "", "", "", "",
                        "GetAllBoNhiemTim");

                    int rowIndex = 4;
                    int count = 1;
                    foreach (var hdDetail in bonhiemDetail.Result)
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

    }
}