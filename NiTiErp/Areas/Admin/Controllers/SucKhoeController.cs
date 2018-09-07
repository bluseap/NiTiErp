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
    public class SucKhoeController : BaseController
    {
        private readonly IHostingEnvironment _hostingEnvironment;
        private readonly NiTiErp.Application.Interfaces.IUserService _userService;
        private readonly IAuthorizationService _authorizationService;

        private readonly IDieuKienTimService _dieukientimService;
        private readonly IPhanLoaiSucKhoeService _phanloaisuckhoeService;
        private readonly ISucKhoeService _suckhoeService;

        public SucKhoeController(IHostingEnvironment hostingEnvironment,
            NiTiErp.Application.Interfaces.IUserService userService,
            IAuthorizationService authorizationService,

            IDieuKienTimService dieukientimService,
            IPhanLoaiSucKhoeService phanloaisuckhoeService,
            ISucKhoeService suckhoeService
            )
        {
            _hostingEnvironment = hostingEnvironment;
            _userService = userService;
            _authorizationService = authorizationService;

            _dieukientimService = dieukientimService;
            _phanloaisuckhoeService = phanloaisuckhoeService;
            _suckhoeService = suckhoeService;
        }

        public IActionResult Index()
        {
            return View();
        }

        #region AJAX API

        public IActionResult AddUpdateSucKhoe(SucKhoeViewModel suckhoeVm)
        {
            if (!ModelState.IsValid)
            {
                IEnumerable<ModelError> allErrors = ModelState.Values.SelectMany(v => v.Errors);
                return new BadRequestObjectResult(allErrors);
            }
            else
            {
                var username = User.GetSpecificClaim("UserName");

                suckhoeVm.CreateBy = username;
                suckhoeVm.CreateDate = DateTime.Now;
                suckhoeVm.UpdateBy = username;
                suckhoeVm.UpdateDate = DateTime.Now;

                if (suckhoeVm.InsertUpdateSucKhoeId == 1)
                {
                    var result = _authorizationService.AuthorizeAsync(User, "SUCKHOENHAP", Operations.Create); // nhap suc khoe
                    if (result.Result.Succeeded == false)
                    {
                        return new ObjectResult(new GenericResult(false, "Bạn không đủ quyền thêm mới."));
                    }

                    var suckhoe = _suckhoeService.SucKhoeAUD(suckhoeVm, "InSucKhoe");
                    return new OkObjectResult(suckhoe);
                }
                else
                {
                    var result = _authorizationService.AuthorizeAsync(User, "SUCKHOENHAP", Operations.Update); // suc khoe
                    if (result.Result.Succeeded == false)
                    {
                        return new ObjectResult(new GenericResult(false, "Bạn không đủ quyền sửa."));
                    }

                    var suckhoe = _suckhoeService.SucKhoeAUD(suckhoeVm, "UpSucKhoe");
                    return new OkObjectResult(suckhoe);
                }
            }
        }

        [HttpGet]
        public IActionResult GetListSucKhoe(string namKham, string corporationId, string phongId, string keyword, int page, int pageSize)
        {
            var khuvuc = !string.IsNullOrEmpty(corporationId) ? corporationId : "%";
            var phong = !string.IsNullOrEmpty(phongId) ? phongId : "%";
            var tukhoa = !string.IsNullOrEmpty(keyword) ? keyword : "%";

            var model = _suckhoeService.GetAllSucKhoePaging(Convert.ToInt32(namKham), khuvuc, phong, tukhoa, page, pageSize, "", "", "", "GetAllSucKhoeNhanVien");

            return new OkObjectResult(model);
        }

        [HttpGet]
        public IActionResult GetSucKhoeId(string suckhoeId)
        {
            var model = _suckhoeService.GetAllSucKhoePaging(1, "", "", "", 1, 1000, "", "", suckhoeId, "GetAllSucKhoeId");

            return new OkObjectResult(model);
        }

        [HttpPost]
        public IActionResult DeleteSucKhoe(SucKhoeViewModel suckhoeVm)
        {
            if (!ModelState.IsValid)
            {
                IEnumerable<ModelError> allErrors = ModelState.Values.SelectMany(v => v.Errors);
                return new BadRequestObjectResult(allErrors);
            }
            else
            {
                if (suckhoeVm.InsertUpdateSucKhoeId == 3)
                {
                    var result = _authorizationService.AuthorizeAsync(User, "SUCKHOENHAP", Operations.Delete); // xoa suc khoe nhan vien
                    if (result.Result.Succeeded == false)
                    {
                        return new ObjectResult(new GenericResult(false, "Bạn không đủ quyền xóa."));
                    }
                    
                    suckhoeVm.CreateDate = DateTime.Now;
                    suckhoeVm.UpdateDate = DateTime.Now;
                   
                    var suckhoe = _suckhoeService.SucKhoeAUD(suckhoeVm, "DelSucKhoe");

                    return new OkObjectResult(suckhoe);
                }
                else
                {
                    return new OkObjectResult(suckhoeVm);
                }
            }
        }

        [HttpPost]
        public IActionResult ExportExcelSucKhoe(string namkham, string corporationId, string phongId, string keyword, int page, int pageSize, string dieukienkhac)
        {
            string sWebRootFolder = _hostingEnvironment.WebRootPath;
            string sFileName = $"SucKhoe.xlsx";
            // Template File
            string templateDocument = Path.Combine(sWebRootFolder, "templates", "SucKhoe.xlsx");

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
                    ExcelWorksheet worksheet = package.Workbook.Worksheets["SucKhoe"];

                    var khuvuc = !string.IsNullOrEmpty(corporationId) ? corporationId : "%";
                    var phong = !string.IsNullOrEmpty(phongId) ? phongId : "%";
                    var tukhoa = !string.IsNullOrEmpty(keyword) ? keyword : "%";
                    
                    var suckhoeDetail = _suckhoeService.SucKhoeGetList(Convert.ToInt32(namkham), khuvuc, phong, tukhoa,
                        dieukienkhac, "", "", "GetListDieuKienSucKhoe");

                    int rowIndex = 4;
                    int count = 1;
                    foreach (var hdDetail in suckhoeDetail.Result)
                    {
                        // Cell 1, Carton Count
                        worksheet.Cells[rowIndex, 1].Value = count.ToString();
                        worksheet.Cells[rowIndex, 2].Value = hdDetail.Ten != null ? hdDetail.Ten.ToString() : "";
                        worksheet.Cells[rowIndex, 3].Value = hdDetail.TenPhong != null ? hdDetail.TenPhong.ToString() : "";
                        worksheet.Cells[rowIndex, 4].Value = hdDetail.NgaySinh != null ? hdDetail.NgaySinh.Year.ToString() : "";
                        worksheet.Cells[rowIndex, 5].Value = hdDetail.GioiTinh != null ? hdDetail.GioiTinh == "1" ? "Nam" : "Nữ" : "";
                        //worksheet.Cells[rowIndex, 6].Value = hdDetail.CanNang != null ? hdDetail.CanNang.ToString() : "";

                        //worksheet.Cells[rowIndex, 6].Value = hdDetail.NgayHetHan != null ? hdDetail.NgayHetHan.Date.ToString("dd/M/yyyy", CultureInfo.InvariantCulture) : "";

                        //worksheet.Cells[rowIndex, 5].Value = hdDetail.NgaySinh != null ? hdDetail.NgaySinh.Date.ToString("dd/M/yyyy", CultureInfo.InvariantCulture) : "";

                        rowIndex++;
                        count++;
                    }

                    package.SaveAs(file); //Save the workbook.                    
                }
            }
            return new OkObjectResult(url);
        }

        #region Danh mục

        [HttpGet]
        public IActionResult DieuKienSucKhoe()
        {
            var model = _dieukientimService.DieuKienTimGetList("SucKhoeNhanVien", "", "", "BangDieuKienTimGetList");
            return new OkObjectResult(model);
        }

        [HttpGet]
        public IActionResult PhanLoaiSucKhoe()
        {
            var model = _phanloaisuckhoeService.PhanLoaiSucKhoeGetList("", "PO", "", "PhanLoaiSucKhoeGetList");
            return new OkObjectResult(model);
        }

        #endregion

        #endregion


    }
}