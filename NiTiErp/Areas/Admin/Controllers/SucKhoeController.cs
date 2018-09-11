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
using OfficeOpenXml.Style;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
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

        private readonly Application.Dapper.Interfaces.ICorporationService _corporationsService;

        public SucKhoeController(IHostingEnvironment hostingEnvironment,
            NiTiErp.Application.Interfaces.IUserService userService,
            IAuthorizationService authorizationService,

            IDieuKienTimService dieukientimService,
            IPhanLoaiSucKhoeService phanloaisuckhoeService,
            ISucKhoeService suckhoeService,
            Application.Dapper.Interfaces.ICorporationService corporationsService
            )
        {
            _hostingEnvironment = hostingEnvironment;
            _userService = userService;
            _authorizationService = authorizationService;

            _dieukientimService = dieukientimService;
            _phanloaisuckhoeService = phanloaisuckhoeService;
            _suckhoeService = suckhoeService;
            _corporationsService = corporationsService; 
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
            if (dieukienkhac == "5")
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

                        int rowIndex = 7;
                        int count = 1;

                        if (khuvuc == "%")
                        {
                            worksheet.Cells[2, 3].Value = "";
                        }
                        else
                        {
                            var khuvucvm = _corporationsService.GetAllCorPaging(khuvuc, "", "", 1, 10, "", "", khuvuc, "GetCorporationId");

                            worksheet.Cells[2, 3].Value = khuvucvm.Result.Results[0].Name.ToString().ToUpper();
                        }

                        worksheet.InsertRow(7, suckhoeDetail.Result.Count());
                        foreach (var hdDetail in suckhoeDetail.Result)
                        {                            
                            //Color DeepBlueHexCode = ColorTranslator.FromHtml("#254061");
                            // Cell 1, Carton Count
                            worksheet.Cells[rowIndex, 2].Value = count.ToString();
                            //worksheet.Cells[rowIndex, 2].Style.Border.Left.Style = ExcelBorderStyle.Thick; // to dam                        
                            //worksheet.Cells[rowIndex, 2].Style.Border.Top.Color.SetColor(Color.Red);
                            worksheet.Cells[rowIndex, 2].Style.Border.Left.Style = ExcelBorderStyle.Medium; // to dam vua
                            worksheet.Cells[rowIndex, 2].Style.Border.Right.Style = ExcelBorderStyle.Thin; // lien nho
                            worksheet.Cells[rowIndex, 2].Style.Border.Top.Style = ExcelBorderStyle.Dotted; // khoan cach
                            worksheet.Cells[rowIndex, 2].Style.Border.Bottom.Style = ExcelBorderStyle.Dotted;

                            worksheet.Cells[rowIndex, 3].Value = !string.IsNullOrEmpty(hdDetail.Ten) ? hdDetail.Ten.ToString() : "";
                            worksheet.Cells[rowIndex, 3].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                            worksheet.Cells[rowIndex, 3].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                            worksheet.Cells[rowIndex, 3].Style.Border.Top.Style = ExcelBorderStyle.Dotted;
                            worksheet.Cells[rowIndex, 3].Style.Border.Bottom.Style = ExcelBorderStyle.Dotted;

                            worksheet.Cells[rowIndex, 4].Value = !string.IsNullOrEmpty(hdDetail.TenPhong) ? hdDetail.TenPhong.ToString() : "";
                            worksheet.Cells[rowIndex, 4].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                            worksheet.Cells[rowIndex, 4].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                            worksheet.Cells[rowIndex, 4].Style.Border.Top.Style = ExcelBorderStyle.Dotted;
                            worksheet.Cells[rowIndex, 4].Style.Border.Bottom.Style = ExcelBorderStyle.Dotted;

                            worksheet.Cells[rowIndex, 5].Value = !string.IsNullOrEmpty(hdDetail.NgaySinh.ToString()) ? hdDetail.NgaySinh.Year.ToString() : "";
                            worksheet.Cells[rowIndex, 5].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                            worksheet.Cells[rowIndex, 5].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                            worksheet.Cells[rowIndex, 5].Style.Border.Top.Style = ExcelBorderStyle.Dotted;
                            worksheet.Cells[rowIndex, 5].Style.Border.Bottom.Style = ExcelBorderStyle.Dotted;

                            worksheet.Cells[rowIndex, 6].Value = !string.IsNullOrEmpty(hdDetail.GioiTinh) ? hdDetail.GioiTinh == "1" ? "Nam" : "Nữ" : ""; worksheet.Cells[rowIndex, 3].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                            worksheet.Cells[rowIndex, 6].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                            worksheet.Cells[rowIndex, 6].Style.Border.Top.Style = ExcelBorderStyle.Dotted;
                            worksheet.Cells[rowIndex, 6].Style.Border.Bottom.Style = ExcelBorderStyle.Dotted;

                            worksheet.Cells[rowIndex, 7].Value = !string.IsNullOrEmpty(hdDetail.CanNang.ToString()) ? hdDetail.CanNang.ToString() : "";
                            worksheet.Cells[rowIndex, 7].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                            worksheet.Cells[rowIndex, 7].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                            worksheet.Cells[rowIndex, 7].Style.Border.Top.Style = ExcelBorderStyle.Dotted;
                            worksheet.Cells[rowIndex, 7].Style.Border.Bottom.Style = ExcelBorderStyle.Dotted;

                            worksheet.Cells[rowIndex, 8].Value = !string.IsNullOrEmpty(hdDetail.ChieuCao.ToString()) ? hdDetail.ChieuCao.ToString() : "";
                            worksheet.Cells[rowIndex, 8].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                            worksheet.Cells[rowIndex, 8].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                            worksheet.Cells[rowIndex, 8].Style.Border.Top.Style = ExcelBorderStyle.Dotted;
                            worksheet.Cells[rowIndex, 8].Style.Border.Bottom.Style = ExcelBorderStyle.Dotted;

                            worksheet.Cells[rowIndex, 9].Value = !string.IsNullOrEmpty(hdDetail.HuyetAp) ? hdDetail.HuyetAp.ToString() : "";
                            worksheet.Cells[rowIndex, 9].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                            worksheet.Cells[rowIndex, 9].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                            worksheet.Cells[rowIndex, 9].Style.Border.Top.Style = ExcelBorderStyle.Dotted;
                            worksheet.Cells[rowIndex, 9].Style.Border.Bottom.Style = ExcelBorderStyle.Dotted;

                            worksheet.Cells[rowIndex, 10].Value = !string.IsNullOrEmpty(hdDetail.Mat) ? hdDetail.Mat.ToString() : "";
                            worksheet.Cells[rowIndex, 10].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                            worksheet.Cells[rowIndex, 10].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                            worksheet.Cells[rowIndex, 10].Style.Border.Top.Style = ExcelBorderStyle.Dotted;
                            worksheet.Cells[rowIndex, 10].Style.Border.Bottom.Style = ExcelBorderStyle.Dotted;

                            worksheet.Cells[rowIndex, 11].Value = !string.IsNullOrEmpty(hdDetail.TaiMuiHong) ? hdDetail.TaiMuiHong.ToString() : "";
                            worksheet.Cells[rowIndex, 11].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                            worksheet.Cells[rowIndex, 11].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                            worksheet.Cells[rowIndex, 11].Style.Border.Top.Style = ExcelBorderStyle.Dotted;
                            worksheet.Cells[rowIndex, 11].Style.Border.Bottom.Style = ExcelBorderStyle.Dotted;

                            worksheet.Cells[rowIndex, 12].Value = !string.IsNullOrEmpty(hdDetail.RangHamMat) ? hdDetail.RangHamMat.ToString() : "";
                            worksheet.Cells[rowIndex, 12].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                            worksheet.Cells[rowIndex, 12].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                            worksheet.Cells[rowIndex, 12].Style.Border.Top.Style = ExcelBorderStyle.Dotted;
                            worksheet.Cells[rowIndex, 12].Style.Border.Bottom.Style = ExcelBorderStyle.Dotted;

                            worksheet.Cells[rowIndex, 13].Value = !string.IsNullOrEmpty(hdDetail.SieuAmVungBung) ? hdDetail.SieuAmVungBung.ToString() : "";
                            worksheet.Cells[rowIndex, 13].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                            worksheet.Cells[rowIndex, 13].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                            worksheet.Cells[rowIndex, 13].Style.Border.Top.Style = ExcelBorderStyle.Dotted;
                            worksheet.Cells[rowIndex, 13].Style.Border.Bottom.Style = ExcelBorderStyle.Dotted;

                            worksheet.Cells[rowIndex, 14].Value = !string.IsNullOrEmpty(hdDetail.XQTimPhoi) ? hdDetail.XQTimPhoi.ToString() : "";
                            worksheet.Cells[rowIndex, 14].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                            worksheet.Cells[rowIndex, 14].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                            worksheet.Cells[rowIndex, 14].Style.Border.Top.Style = ExcelBorderStyle.Dotted;
                            worksheet.Cells[rowIndex, 14].Style.Border.Bottom.Style = ExcelBorderStyle.Dotted;

                            worksheet.Cells[rowIndex, 15].Value = !string.IsNullOrEmpty(hdDetail.DoDienTim) ? hdDetail.DoDienTim.ToString() : "";
                            worksheet.Cells[rowIndex, 15].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                            worksheet.Cells[rowIndex, 15].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                            worksheet.Cells[rowIndex, 15].Style.Border.Top.Style = ExcelBorderStyle.Dotted;
                            worksheet.Cells[rowIndex, 15].Style.Border.Bottom.Style = ExcelBorderStyle.Dotted;

                            worksheet.Cells[rowIndex, 16].Value = !string.IsNullOrEmpty(hdDetail.PhuKhoa) ? hdDetail.PhuKhoa.ToString() : "";
                            worksheet.Cells[rowIndex, 16].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                            worksheet.Cells[rowIndex, 16].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                            worksheet.Cells[rowIndex, 16].Style.Border.Top.Style = ExcelBorderStyle.Dotted;
                            worksheet.Cells[rowIndex, 16].Style.Border.Bottom.Style = ExcelBorderStyle.Dotted;

                            worksheet.Cells[rowIndex, 17].Value = !string.IsNullOrEmpty(hdDetail.PhetTBAmDao) ? hdDetail.PhetTBAmDao.ToString() : "";
                            worksheet.Cells[rowIndex, 17].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                            worksheet.Cells[rowIndex, 17].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                            worksheet.Cells[rowIndex, 17].Style.Border.Top.Style = ExcelBorderStyle.Dotted;
                            worksheet.Cells[rowIndex, 17].Style.Border.Bottom.Style = ExcelBorderStyle.Dotted;

                            worksheet.Cells[rowIndex, 18].Value = !string.IsNullOrEmpty(hdDetail.CongThucMau) ? hdDetail.CongThucMau.ToString() : "";
                            worksheet.Cells[rowIndex, 18].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                            worksheet.Cells[rowIndex, 18].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                            worksheet.Cells[rowIndex, 18].Style.Border.Top.Style = ExcelBorderStyle.Dotted;
                            worksheet.Cells[rowIndex, 18].Style.Border.Bottom.Style = ExcelBorderStyle.Dotted;

                            worksheet.Cells[rowIndex, 19].Value = !string.IsNullOrEmpty(hdDetail.TPTNT) ? hdDetail.TPTNT.ToString() : "";
                            worksheet.Cells[rowIndex, 19].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                            worksheet.Cells[rowIndex, 19].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                            worksheet.Cells[rowIndex, 19].Style.Border.Top.Style = ExcelBorderStyle.Dotted;
                            worksheet.Cells[rowIndex, 19].Style.Border.Bottom.Style = ExcelBorderStyle.Dotted;

                            worksheet.Cells[rowIndex, 20].Value = !string.IsNullOrEmpty(hdDetail.GlucoDuong) ? hdDetail.GlucoDuong.ToString() : "";
                            worksheet.Cells[rowIndex, 20].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                            worksheet.Cells[rowIndex, 20].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                            worksheet.Cells[rowIndex, 20].Style.Border.Top.Style = ExcelBorderStyle.Dotted;
                            worksheet.Cells[rowIndex, 20].Style.Border.Bottom.Style = ExcelBorderStyle.Dotted;

                            worksheet.Cells[rowIndex, 21].Value = !string.IsNullOrEmpty(hdDetail.NhomMau) ? hdDetail.NhomMau.ToString() : "";
                            worksheet.Cells[rowIndex, 21].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                            worksheet.Cells[rowIndex, 21].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                            worksheet.Cells[rowIndex, 21].Style.Border.Top.Style = ExcelBorderStyle.Dotted;
                            worksheet.Cells[rowIndex, 21].Style.Border.Bottom.Style = ExcelBorderStyle.Dotted;

                            worksheet.Cells[rowIndex, 22].Value = !string.IsNullOrEmpty(hdDetail.PhanLoaiSucKhoe) ? hdDetail.PhanLoaiSucKhoe.ToString() : "";
                            worksheet.Cells[rowIndex, 22].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                            worksheet.Cells[rowIndex, 22].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                            worksheet.Cells[rowIndex, 22].Style.Border.Top.Style = ExcelBorderStyle.Dotted;
                            worksheet.Cells[rowIndex, 22].Style.Border.Bottom.Style = ExcelBorderStyle.Dotted;

                            worksheet.Cells[rowIndex, 23].Value = !string.IsNullOrEmpty(hdDetail.HuongDieuTri) ? hdDetail.HuongDieuTri.ToString() : "";
                            worksheet.Cells[rowIndex, 23].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                            worksheet.Cells[rowIndex, 23].Style.Border.Right.Style = ExcelBorderStyle.Medium;
                            worksheet.Cells[rowIndex, 23].Style.Border.Top.Style = ExcelBorderStyle.Dotted;
                            worksheet.Cells[rowIndex, 23].Style.Border.Bottom.Style = ExcelBorderStyle.Dotted;

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
            else if (dieukienkhac == "6")
            {
                string sWebRootFolder = _hostingEnvironment.WebRootPath;
                string sFileName = $"SucKhoeTK.xlsx";
                // Template File
                string templateDocument = Path.Combine(sWebRootFolder, "templates", "SucKhoeTK.xlsx");

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
                        ExcelWorksheet worksheet = package.Workbook.Worksheets["SucKhoeTK"];

                        var khuvuc = !string.IsNullOrEmpty(corporationId) ? corporationId : "%";
                        var phong = !string.IsNullOrEmpty(phongId) ? phongId : "%";
                        var tukhoa = !string.IsNullOrEmpty(keyword) ? keyword : "%";

                        var suckhoeDetail = _suckhoeService.SucKhoeGetList(Convert.ToInt32(namkham), khuvuc, phong, tukhoa,
                            dieukienkhac, "", "", "GetListDieuKienSucKhoe");

                        int rowIndex = 7;
                        int count = 1;

                        if (khuvuc == "%")
                        {
                            worksheet.Cells[2, 3].Value = "";
                        }
                        else
                        {
                            var khuvucvm = _corporationsService.GetAllCorPaging(khuvuc, "", "", 1, 10, "", "", khuvuc, "GetCorporationId");

                            worksheet.Cells[2, 3].Value = khuvucvm.Result.Results[0].Name.ToString().ToUpper();
                        }

                        worksheet.InsertRow(7, suckhoeDetail.Result.Count());
                        foreach (var hdDetail in suckhoeDetail.Result)
                        {
                            //Color DeepBlueHexCode = ColorTranslator.FromHtml("#254061");
                            // Cell 1, Carton Count
                            worksheet.Cells[rowIndex, 2].Value = count.ToString();
                            //worksheet.Cells[rowIndex, 2].Style.Border.Left.Style = ExcelBorderStyle.Thick; // to dam                        
                            //worksheet.Cells[rowIndex, 2].Style.Border.Top.Color.SetColor(Color.Red);
                            worksheet.Cells[rowIndex, 2].Style.Border.Left.Style = ExcelBorderStyle.Medium; // to dam vua
                            worksheet.Cells[rowIndex, 2].Style.Border.Right.Style = ExcelBorderStyle.Thin; // lien nho
                            worksheet.Cells[rowIndex, 2].Style.Border.Top.Style = ExcelBorderStyle.Dotted; // khoan cach
                            worksheet.Cells[rowIndex, 2].Style.Border.Bottom.Style = ExcelBorderStyle.Dotted;

                            worksheet.Cells[rowIndex, 3].Value = !string.IsNullOrEmpty(hdDetail.Ten) ? hdDetail.Ten.ToString() : "";
                            worksheet.Cells[rowIndex, 3].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                            worksheet.Cells[rowIndex, 3].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                            worksheet.Cells[rowIndex, 3].Style.Border.Top.Style = ExcelBorderStyle.Dotted;
                            worksheet.Cells[rowIndex, 3].Style.Border.Bottom.Style = ExcelBorderStyle.Dotted;

                            worksheet.Cells[rowIndex, 4].Value = !string.IsNullOrEmpty(hdDetail.TenPhong) ? hdDetail.TenPhong.ToString() : "";
                            worksheet.Cells[rowIndex, 4].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                            worksheet.Cells[rowIndex, 4].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                            worksheet.Cells[rowIndex, 4].Style.Border.Top.Style = ExcelBorderStyle.Dotted;
                            worksheet.Cells[rowIndex, 4].Style.Border.Bottom.Style = ExcelBorderStyle.Dotted;

                            worksheet.Cells[rowIndex, 5].Value = !string.IsNullOrEmpty(hdDetail.NgaySinh.ToString()) ? hdDetail.NgaySinh.Year.ToString() : "";
                            worksheet.Cells[rowIndex, 5].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                            worksheet.Cells[rowIndex, 5].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                            worksheet.Cells[rowIndex, 5].Style.Border.Top.Style = ExcelBorderStyle.Dotted;
                            worksheet.Cells[rowIndex, 5].Style.Border.Bottom.Style = ExcelBorderStyle.Dotted;

                            worksheet.Cells[rowIndex, 6].Value = !string.IsNullOrEmpty(hdDetail.GioiTinh) ? hdDetail.GioiTinh == "1" ? "Nam" : "Nữ" : ""; worksheet.Cells[rowIndex, 3].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                            worksheet.Cells[rowIndex, 6].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                            worksheet.Cells[rowIndex, 6].Style.Border.Top.Style = ExcelBorderStyle.Dotted;
                            worksheet.Cells[rowIndex, 6].Style.Border.Bottom.Style = ExcelBorderStyle.Dotted;

                            worksheet.Cells[rowIndex, 7].Value = !string.IsNullOrEmpty(hdDetail.CanNangIs.ToString()) ? hdDetail.CanNangIs : 0;
                            worksheet.Cells[rowIndex, 7].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                            worksheet.Cells[rowIndex, 7].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                            worksheet.Cells[rowIndex, 7].Style.Border.Top.Style = ExcelBorderStyle.Dotted;
                            worksheet.Cells[rowIndex, 7].Style.Border.Bottom.Style = ExcelBorderStyle.Dotted;

                            worksheet.Cells[rowIndex, 8].Value = !string.IsNullOrEmpty(hdDetail.ChieuCaoIs.ToString()) ? hdDetail.ChieuCaoIs : 0;
                            worksheet.Cells[rowIndex, 8].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                            worksheet.Cells[rowIndex, 8].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                            worksheet.Cells[rowIndex, 8].Style.Border.Top.Style = ExcelBorderStyle.Dotted;
                            worksheet.Cells[rowIndex, 8].Style.Border.Bottom.Style = ExcelBorderStyle.Dotted;

                            worksheet.Cells[rowIndex, 9].Value = !string.IsNullOrEmpty(hdDetail.HuyetApIs.ToString()) ? hdDetail.HuyetApIs : 0;
                            worksheet.Cells[rowIndex, 9].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                            worksheet.Cells[rowIndex, 9].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                            worksheet.Cells[rowIndex, 9].Style.Border.Top.Style = ExcelBorderStyle.Dotted;
                            worksheet.Cells[rowIndex, 9].Style.Border.Bottom.Style = ExcelBorderStyle.Dotted;

                            worksheet.Cells[rowIndex, 10].Value = !string.IsNullOrEmpty(hdDetail.MatIs.ToString()) ? hdDetail.MatIs : 0;
                            worksheet.Cells[rowIndex, 10].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                            worksheet.Cells[rowIndex, 10].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                            worksheet.Cells[rowIndex, 10].Style.Border.Top.Style = ExcelBorderStyle.Dotted;
                            worksheet.Cells[rowIndex, 10].Style.Border.Bottom.Style = ExcelBorderStyle.Dotted;

                            worksheet.Cells[rowIndex, 11].Value = !string.IsNullOrEmpty(hdDetail.TaiMuiHongIs.ToString()) ? hdDetail.TaiMuiHongIs : 0;
                            worksheet.Cells[rowIndex, 11].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                            worksheet.Cells[rowIndex, 11].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                            worksheet.Cells[rowIndex, 11].Style.Border.Top.Style = ExcelBorderStyle.Dotted;
                            worksheet.Cells[rowIndex, 11].Style.Border.Bottom.Style = ExcelBorderStyle.Dotted;

                            worksheet.Cells[rowIndex, 12].Value = !string.IsNullOrEmpty(hdDetail.RangHamMatIs.ToString()) ? hdDetail.RangHamMatIs : 0;
                            worksheet.Cells[rowIndex, 12].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                            worksheet.Cells[rowIndex, 12].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                            worksheet.Cells[rowIndex, 12].Style.Border.Top.Style = ExcelBorderStyle.Dotted;
                            worksheet.Cells[rowIndex, 12].Style.Border.Bottom.Style = ExcelBorderStyle.Dotted;

                            worksheet.Cells[rowIndex, 13].Value = !string.IsNullOrEmpty(hdDetail.SieuAmVungBungIs.ToString()) ? hdDetail.SieuAmVungBungIs : 0;
                            worksheet.Cells[rowIndex, 13].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                            worksheet.Cells[rowIndex, 13].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                            worksheet.Cells[rowIndex, 13].Style.Border.Top.Style = ExcelBorderStyle.Dotted;
                            worksheet.Cells[rowIndex, 13].Style.Border.Bottom.Style = ExcelBorderStyle.Dotted;

                            worksheet.Cells[rowIndex, 14].Value = !string.IsNullOrEmpty(hdDetail.XQTimPhoiIs.ToString()) ? hdDetail.XQTimPhoiIs : 0;
                            worksheet.Cells[rowIndex, 14].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                            worksheet.Cells[rowIndex, 14].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                            worksheet.Cells[rowIndex, 14].Style.Border.Top.Style = ExcelBorderStyle.Dotted;
                            worksheet.Cells[rowIndex, 14].Style.Border.Bottom.Style = ExcelBorderStyle.Dotted;

                            worksheet.Cells[rowIndex, 15].Value = !string.IsNullOrEmpty(hdDetail.DoDienTimIs.ToString()) ? hdDetail.DoDienTimIs : 0;
                            worksheet.Cells[rowIndex, 15].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                            worksheet.Cells[rowIndex, 15].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                            worksheet.Cells[rowIndex, 15].Style.Border.Top.Style = ExcelBorderStyle.Dotted;
                            worksheet.Cells[rowIndex, 15].Style.Border.Bottom.Style = ExcelBorderStyle.Dotted;

                            worksheet.Cells[rowIndex, 16].Value = !string.IsNullOrEmpty(hdDetail.PhuKhoaIs.ToString()) ? hdDetail.PhuKhoaIs : 0;
                            worksheet.Cells[rowIndex, 16].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                            worksheet.Cells[rowIndex, 16].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                            worksheet.Cells[rowIndex, 16].Style.Border.Top.Style = ExcelBorderStyle.Dotted;
                            worksheet.Cells[rowIndex, 16].Style.Border.Bottom.Style = ExcelBorderStyle.Dotted;

                            worksheet.Cells[rowIndex, 17].Value = !string.IsNullOrEmpty(hdDetail.PhetTBAmDaoIs.ToString()) ? hdDetail.PhetTBAmDaoIs : 0;
                            worksheet.Cells[rowIndex, 17].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                            worksheet.Cells[rowIndex, 17].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                            worksheet.Cells[rowIndex, 17].Style.Border.Top.Style = ExcelBorderStyle.Dotted;
                            worksheet.Cells[rowIndex, 17].Style.Border.Bottom.Style = ExcelBorderStyle.Dotted;

                            worksheet.Cells[rowIndex, 18].Value = !string.IsNullOrEmpty(hdDetail.CongThucMauIs.ToString()) ? hdDetail.CongThucMauIs : 0;
                            worksheet.Cells[rowIndex, 18].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                            worksheet.Cells[rowIndex, 18].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                            worksheet.Cells[rowIndex, 18].Style.Border.Top.Style = ExcelBorderStyle.Dotted;
                            worksheet.Cells[rowIndex, 18].Style.Border.Bottom.Style = ExcelBorderStyle.Dotted;

                            worksheet.Cells[rowIndex, 19].Value = !string.IsNullOrEmpty(hdDetail.TPTNTIs.ToString()) ? hdDetail.TPTNTIs : 0;
                            worksheet.Cells[rowIndex, 19].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                            worksheet.Cells[rowIndex, 19].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                            worksheet.Cells[rowIndex, 19].Style.Border.Top.Style = ExcelBorderStyle.Dotted;
                            worksheet.Cells[rowIndex, 19].Style.Border.Bottom.Style = ExcelBorderStyle.Dotted;

                            worksheet.Cells[rowIndex, 20].Value = !string.IsNullOrEmpty(hdDetail.GlucoDuongIs.ToString()) ? hdDetail.GlucoDuongIs : 0;
                            worksheet.Cells[rowIndex, 20].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                            worksheet.Cells[rowIndex, 20].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                            worksheet.Cells[rowIndex, 20].Style.Border.Top.Style = ExcelBorderStyle.Dotted;
                            worksheet.Cells[rowIndex, 20].Style.Border.Bottom.Style = ExcelBorderStyle.Dotted;

                            worksheet.Cells[rowIndex, 21].Value = !string.IsNullOrEmpty(hdDetail.NhomMauIs.ToString()) ? hdDetail.NhomMauIs : 0;
                            worksheet.Cells[rowIndex, 21].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                            worksheet.Cells[rowIndex, 21].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                            worksheet.Cells[rowIndex, 21].Style.Border.Top.Style = ExcelBorderStyle.Dotted;
                            worksheet.Cells[rowIndex, 21].Style.Border.Bottom.Style = ExcelBorderStyle.Dotted;

                            worksheet.Cells[rowIndex, 22].Value = !string.IsNullOrEmpty(hdDetail.PhanLoaiSucKhoe) ? hdDetail.PhanLoaiSucKhoe.ToString() : "";
                            worksheet.Cells[rowIndex, 22].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                            worksheet.Cells[rowIndex, 22].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                            worksheet.Cells[rowIndex, 22].Style.Border.Top.Style = ExcelBorderStyle.Dotted;
                            worksheet.Cells[rowIndex, 22].Style.Border.Bottom.Style = ExcelBorderStyle.Dotted;

                            worksheet.Cells[rowIndex, 23].Value = !string.IsNullOrEmpty(hdDetail.HuongDieuTri) ? hdDetail.HuongDieuTri.ToString() : "";
                            worksheet.Cells[rowIndex, 23].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                            worksheet.Cells[rowIndex, 23].Style.Border.Right.Style = ExcelBorderStyle.Medium;
                            worksheet.Cells[rowIndex, 23].Style.Border.Top.Style = ExcelBorderStyle.Dotted;
                            worksheet.Cells[rowIndex, 23].Style.Border.Bottom.Style = ExcelBorderStyle.Dotted;

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
            else //if (dieukienkhac == "7")
            {                
                string sWebRootFolder = _hostingEnvironment.WebRootPath;
                string sFileName = $"SucKhoeTKPL.xlsx";
                // Template File
                string templateDocument = Path.Combine(sWebRootFolder, "templates", "SucKhoeTKPL.xlsx");

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
                        ExcelWorksheet worksheet = package.Workbook.Worksheets["SucKhoeTKPL"];

                        var khuvuc = !string.IsNullOrEmpty(corporationId) ? corporationId : "%";
                        var phong = !string.IsNullOrEmpty(phongId) ? phongId : "%";
                        var tukhoa = !string.IsNullOrEmpty(keyword) ? keyword : "%";

                        var suckhoeDetail = _suckhoeService.SucKhoeGetList(Convert.ToInt32(namkham), khuvuc, phong, tukhoa,
                            dieukienkhac, "", "", "GetListDieuKienSucKhoe");

                        int rowIndex = 7;
                        int count = 1;

                        if (khuvuc == "%")
                        {
                            worksheet.Cells[2, 3].Value = "";
                        }
                        else
                        {
                            var khuvucvm = _corporationsService.GetAllCorPaging(khuvuc, "", "", 1, 10, "", "", khuvuc, "GetCorporationId");

                            worksheet.Cells[2, 3].Value = khuvucvm.Result.Results[0].Name.ToString().ToUpper();
                        }

                        worksheet.InsertRow(7, suckhoeDetail.Result.Count());
                        foreach (var hdDetail in suckhoeDetail.Result)
                        {
                            //Color DeepBlueHexCode = ColorTranslator.FromHtml("#254061");
                            // Cell 1, Carton Count
                            worksheet.Cells[rowIndex, 2].Value = count.ToString();
                            //worksheet.Cells[rowIndex, 2].Style.Border.Left.Style = ExcelBorderStyle.Thick; // to dam                        
                            //worksheet.Cells[rowIndex, 2].Style.Border.Top.Color.SetColor(Color.Red);
                            worksheet.Cells[rowIndex, 2].Style.Border.Left.Style = ExcelBorderStyle.Medium; // to dam vua
                            worksheet.Cells[rowIndex, 2].Style.Border.Right.Style = ExcelBorderStyle.Thin; // lien nho
                            worksheet.Cells[rowIndex, 2].Style.Border.Top.Style = ExcelBorderStyle.Dotted; // khoan cach
                            worksheet.Cells[rowIndex, 2].Style.Border.Bottom.Style = ExcelBorderStyle.Dotted;

                            worksheet.Cells[rowIndex, 3].Value = !string.IsNullOrEmpty(hdDetail.Ten) ? hdDetail.Ten.ToString() : "";
                            worksheet.Cells[rowIndex, 3].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                            worksheet.Cells[rowIndex, 3].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                            worksheet.Cells[rowIndex, 3].Style.Border.Top.Style = ExcelBorderStyle.Dotted;
                            worksheet.Cells[rowIndex, 3].Style.Border.Bottom.Style = ExcelBorderStyle.Dotted;

                            worksheet.Cells[rowIndex, 4].Value = !string.IsNullOrEmpty(hdDetail.ChauThanh.ToString()) ? hdDetail.ChauThanh : 0;
                            worksheet.Cells[rowIndex, 4].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                            worksheet.Cells[rowIndex, 4].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                            worksheet.Cells[rowIndex, 4].Style.Border.Top.Style = ExcelBorderStyle.Dotted;
                            worksheet.Cells[rowIndex, 4].Style.Border.Bottom.Style = ExcelBorderStyle.Dotted;

                            worksheet.Cells[rowIndex, 5].Value = !string.IsNullOrEmpty(hdDetail.ChauPhu.ToString()) ? hdDetail.ChauPhu  : 0;
                            worksheet.Cells[rowIndex, 5].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                            worksheet.Cells[rowIndex, 5].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                            worksheet.Cells[rowIndex, 5].Style.Border.Top.Style = ExcelBorderStyle.Dotted;
                            worksheet.Cells[rowIndex, 5].Style.Border.Bottom.Style = ExcelBorderStyle.Dotted;

                            worksheet.Cells[rowIndex, 6].Value = !string.IsNullOrEmpty(hdDetail.ChoMoi.ToString()) ? hdDetail.ChoMoi  : 0;
                            worksheet.Cells[rowIndex, 6].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                            worksheet.Cells[rowIndex, 6].Style.Border.Top.Style = ExcelBorderStyle.Dotted;
                            worksheet.Cells[rowIndex, 6].Style.Border.Bottom.Style = ExcelBorderStyle.Dotted;

                            worksheet.Cells[rowIndex, 7].Value = !string.IsNullOrEmpty(hdDetail.PhuTan.ToString()) ? hdDetail.PhuTan : 0;
                            worksheet.Cells[rowIndex, 7].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                            worksheet.Cells[rowIndex, 7].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                            worksheet.Cells[rowIndex, 7].Style.Border.Top.Style = ExcelBorderStyle.Dotted;
                            worksheet.Cells[rowIndex, 7].Style.Border.Bottom.Style = ExcelBorderStyle.Dotted;

                            worksheet.Cells[rowIndex, 8].Value = !string.IsNullOrEmpty(hdDetail.ChauDoc.ToString()) ? hdDetail.ChauDoc : 0;
                            worksheet.Cells[rowIndex, 8].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                            worksheet.Cells[rowIndex, 8].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                            worksheet.Cells[rowIndex, 8].Style.Border.Top.Style = ExcelBorderStyle.Dotted;
                            worksheet.Cells[rowIndex, 8].Style.Border.Bottom.Style = ExcelBorderStyle.Dotted;

                            worksheet.Cells[rowIndex, 9].Value = !string.IsNullOrEmpty(hdDetail.AnPhu.ToString()) ? hdDetail.AnPhu : 0;
                            worksheet.Cells[rowIndex, 9].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                            worksheet.Cells[rowIndex, 9].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                            worksheet.Cells[rowIndex, 9].Style.Border.Top.Style = ExcelBorderStyle.Dotted;
                            worksheet.Cells[rowIndex, 9].Style.Border.Bottom.Style = ExcelBorderStyle.Dotted;

                            worksheet.Cells[rowIndex, 10].Value = !string.IsNullOrEmpty(hdDetail.TanChau.ToString()) ? hdDetail.TanChau : 0;
                            worksheet.Cells[rowIndex, 10].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                            worksheet.Cells[rowIndex, 10].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                            worksheet.Cells[rowIndex, 10].Style.Border.Top.Style = ExcelBorderStyle.Dotted;
                            worksheet.Cells[rowIndex, 10].Style.Border.Bottom.Style = ExcelBorderStyle.Dotted;

                            worksheet.Cells[rowIndex, 11].Value = !string.IsNullOrEmpty(hdDetail.TriTon.ToString()) ? hdDetail.TriTon : 0;
                            worksheet.Cells[rowIndex, 11].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                            worksheet.Cells[rowIndex, 11].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                            worksheet.Cells[rowIndex, 11].Style.Border.Top.Style = ExcelBorderStyle.Dotted;
                            worksheet.Cells[rowIndex, 11].Style.Border.Bottom.Style = ExcelBorderStyle.Dotted;

                            worksheet.Cells[rowIndex, 12].Value = !string.IsNullOrEmpty(hdDetail.TinhBien.ToString()) ? hdDetail.TinhBien : 0;
                            worksheet.Cells[rowIndex, 12].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                            worksheet.Cells[rowIndex, 12].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                            worksheet.Cells[rowIndex, 12].Style.Border.Top.Style = ExcelBorderStyle.Dotted;
                            worksheet.Cells[rowIndex, 12].Style.Border.Bottom.Style = ExcelBorderStyle.Dotted;

                            worksheet.Cells[rowIndex, 13].Value = !string.IsNullOrEmpty(hdDetail.ThoaiSon.ToString()) ? hdDetail.ThoaiSon : 0;
                            worksheet.Cells[rowIndex, 13].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                            worksheet.Cells[rowIndex, 13].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                            worksheet.Cells[rowIndex, 13].Style.Border.Top.Style = ExcelBorderStyle.Dotted;
                            worksheet.Cells[rowIndex, 13].Style.Border.Bottom.Style = ExcelBorderStyle.Dotted;

                            worksheet.Cells[rowIndex, 14].Value = !string.IsNullOrEmpty(hdDetail.LongXuyen.ToString()) ? hdDetail.LongXuyen : 0;
                            worksheet.Cells[rowIndex, 14].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                            worksheet.Cells[rowIndex, 14].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                            worksheet.Cells[rowIndex, 14].Style.Border.Top.Style = ExcelBorderStyle.Dotted;
                            worksheet.Cells[rowIndex, 14].Style.Border.Bottom.Style = ExcelBorderStyle.Dotted;

                            worksheet.Cells[rowIndex, 15].Value = !string.IsNullOrEmpty(hdDetail.CongTy.ToString()) ? hdDetail.CongTy : 0;
                            worksheet.Cells[rowIndex, 15].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                            worksheet.Cells[rowIndex, 15].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                            worksheet.Cells[rowIndex, 15].Style.Border.Top.Style = ExcelBorderStyle.Dotted;
                            worksheet.Cells[rowIndex, 15].Style.Border.Bottom.Style = ExcelBorderStyle.Dotted;                           

                            worksheet.Cells[rowIndex, 23].Value = !string.IsNullOrEmpty(hdDetail.TongSoLuong.ToString()) ? hdDetail.TongSoLuong : 0;
                            worksheet.Cells[rowIndex, 23].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                            worksheet.Cells[rowIndex, 23].Style.Border.Right.Style = ExcelBorderStyle.Medium;
                            worksheet.Cells[rowIndex, 23].Style.Border.Top.Style = ExcelBorderStyle.Dotted;
                            worksheet.Cells[rowIndex, 23].Style.Border.Bottom.Style = ExcelBorderStyle.Dotted;

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
            //return new OkObjectResult(url);
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