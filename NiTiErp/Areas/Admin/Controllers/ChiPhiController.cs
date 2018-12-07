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
using OfficeOpenXml.Style;
using OfficeOpenXml.Table;

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
    public class ChiPhiController : BaseController
    {
        private readonly IHostingEnvironment _hostingEnvironment;
        private readonly NiTiErp.Application.Interfaces.IUserService _userService;
        private readonly IAuthorizationService _authorizationService;

        private readonly IChiPhiLuongService _chiphiluongService;
        private readonly IChiPhiKhoiTaoService _chiphikhoitaoService;
        private readonly IDieuKienTimService _dieukientimService;

        private readonly Application.Dapper.Interfaces.ICorporationService _corporationsService;

        public ChiPhiController(IHostingEnvironment hostingEnvironment,
            NiTiErp.Application.Interfaces.IUserService userService,
            IAuthorizationService authorizationService,

            IChiPhiLuongService chiphiluongService,
            IChiPhiKhoiTaoService chiphikhoitaoService,
            IDieuKienTimService dieukientimService,

            Application.Dapper.Interfaces.ICorporationService corporationsService
            )
        {
            _hostingEnvironment = hostingEnvironment;
            _userService = userService;
            _authorizationService = authorizationService;

            _chiphiluongService = chiphiluongService;
            _chiphikhoitaoService = chiphikhoitaoService;
            _dieukientimService = dieukientimService;

            _corporationsService = corporationsService;
        }

        public IActionResult Index()
        {
            return View();
        }

        #region AJAX API

        public IActionResult AddUpdateChiPhi(ChiPhiKhoiTaoViewModel chiphikhoitaoVm)
        {
            if (!ModelState.IsValid)
            {
                IEnumerable<ModelError> allErrors = ModelState.Values.SelectMany(v => v.Errors);
                return new BadRequestObjectResult(allErrors);
            }
            else
            {
                var username = User.GetSpecificClaim("UserName");

                chiphikhoitaoVm.CreateBy = username;
                chiphikhoitaoVm.CreateDate = DateTime.Now;
                chiphikhoitaoVm.UpdateBy = username;
                chiphikhoitaoVm.UpdateDate = DateTime.Now;

                if (chiphikhoitaoVm.InsertChiPhiKhoiTaoId == 1)
                {
                    var result = _authorizationService.AuthorizeAsync(User, "LUONGCHIPHI", Operations.Create); // nhap chi phi
                    if (result.Result.Succeeded == false)
                    {
                        return new ObjectResult(new GenericResult(false, "Bạn không đủ quyền thêm mới."));
                    }                   

                    var chiphikhoitao = _chiphikhoitaoService.ChiPhiKhoiTaoAUD(chiphikhoitaoVm, "InChiPhiKhoiTao");                   

                    return new OkObjectResult(chiphikhoitao);
                }
                else
                {
                    var result = _authorizationService.AuthorizeAsync(User, "LUONGCHIPHI", Operations.Update); // chi phi
                    if (result.Result.Succeeded == false)
                    {
                        return new ObjectResult(new GenericResult(false, "Bạn không đủ quyền sửa."));
                    }

                    var chiphikhoitao = _chiphikhoitaoService.ChiPhiKhoiTaoAUD(chiphikhoitaoVm, "UpChiPhiKhoiTao");                   

                    return new OkObjectResult(chiphikhoitao);
                }
            }
        }

        public IActionResult AddUpdateChiPhiTangGiam(ChiPhiLuongViewModel chiphiluongVm)
        {
            if (!ModelState.IsValid)
            {
                IEnumerable<ModelError> allErrors = ModelState.Values.SelectMany(v => v.Errors);
                return new BadRequestObjectResult(allErrors);
            }
            else
            {
                var username = User.GetSpecificClaim("UserName");

                chiphiluongVm.CreateBy = username;
                chiphiluongVm.CreateDate = DateTime.Now;
                chiphiluongVm.UpdateBy = username;
                chiphiluongVm.UpdateDate = DateTime.Now;

                if (chiphiluongVm.InsertChiPhiTangGiamId == 1)
                {
                    var result = _authorizationService.AuthorizeAsync(User, "LUONGCHIPHI", Operations.Create); // nhap chi phi
                    if (result.Result.Succeeded == false)
                    {
                        return new ObjectResult(new GenericResult(false, "Bạn không đủ quyền thêm mới."));
                    }

                    var chiphiluong = _chiphiluongService.ChiPhiTangGiamAUD(chiphiluongVm, "InChiPhiLuong");

                    return new OkObjectResult(chiphiluong);
                }
                else
                {
                    var result = _authorizationService.AuthorizeAsync(User, "LUONGCHIPHI", Operations.Update); // chi phi
                    if (result.Result.Succeeded == false)
                    {
                        return new ObjectResult(new GenericResult(false, "Bạn không đủ quyền sửa."));
                    }

                    var chiphiluong = _chiphiluongService.ChiPhiTangGiamAUD(chiphiluongVm, "UpChiPhiLuong");

                    return new OkObjectResult(chiphiluong);
                }
            }
        }

        [HttpGet]
        public IActionResult ChiPhiLuongGetList(int nam, int thang, string corporationId, string phongdanhmucId, string keyword, int chiphiid,
            bool IsChiPhiTang, int page, int pageSize)
        {
            var khuvuc = !string.IsNullOrEmpty(corporationId) ? corporationId : "%";
            var maphong = !string.IsNullOrEmpty(phongdanhmucId) ? phongdanhmucId : "%";
            var tukhoa = !string.IsNullOrEmpty(keyword) ? keyword : "%";

            var hosoId = new Guid();

            var model = _chiphiluongService.GetAllChiPhiLuongPaging(1, nam, thang, khuvuc, maphong, keyword, hosoId, chiphiid, 1, 1
                , IsChiPhiTang, 1, 1, true, "", page, pageSize, "LoaiChiPhiTangGiamGetList");

            return new OkObjectResult(model);
        }

        [HttpGet]
        public IActionResult ChiPhiLuongId(Int64 Id, int nam, int thang, string corporationId, string phongdanhmucId, string keyword, int chiphiid,
            bool IsChiPhiTang, int page, int pageSize)
        {
            var khuvuc = !string.IsNullOrEmpty(corporationId) ? corporationId : "%";
            var maphong = !string.IsNullOrEmpty(phongdanhmucId) ? phongdanhmucId : "%";
            var tukhoa = !string.IsNullOrEmpty(keyword) ? keyword : "%";

            var hosoId = new Guid();

            var model = _chiphiluongService.GetAllChiPhiLuongPaging(Id, nam, thang, khuvuc, maphong, keyword, hosoId, chiphiid, 1, 1
                , IsChiPhiTang, 1, 1, true, "", page, pageSize, "LoaiChiPhiTangGiamId");

            return new OkObjectResult(model);
        }

        [HttpGet]
        public IActionResult ChiPhiKhoiTaGetList(int nam, int thang, string corporationId, string keyword, int page, int pageSize)
        {
            var khuvuc = !string.IsNullOrEmpty(corporationId) ? corporationId : "%";           
            var tukhoa = !string.IsNullOrEmpty(keyword) ? keyword : "%";

            var kynay = new DateTime(nam, thang, 1);

            var model = _chiphikhoitaoService.GetAllChiPhiKhoiTaoPaging(1, khuvuc, tukhoa, page, pageSize, 1, false,
                kynay, false, "", "ChiPhiKhoiTaoKyList");

            return new OkObjectResult(model);
        }

        [HttpGet]
        public IActionResult ChiPhiKhoiTaKyId(int chiphikhoitaoId, int nam, int thang, string corporationId, string keyword, int page, int pageSize)
        {
            var khuvuc = !string.IsNullOrEmpty(corporationId) ? corporationId : "%";
            var tukhoa = !string.IsNullOrEmpty(keyword) ? keyword : "%";

            var kynay = new DateTime(nam, thang, 1);

            var model = _chiphikhoitaoService.GetAllChiPhiKhoiTaoPaging(chiphikhoitaoId, khuvuc, tukhoa, 1, 100, 1, false,
                kynay, false, "", "GetChiPhiKhoiTaoKyId");

            return new OkObjectResult(model);
        }

        [HttpGet]
        public IActionResult ChiPhiKhoiTaKy(int chiphiId, int nam, int thang, string corporationId, string keyword, int page, int pageSize)
        {
            var khuvuc = !string.IsNullOrEmpty(corporationId) ? corporationId : "%";
            var tukhoa = !string.IsNullOrEmpty(keyword) ? keyword : "%";

            var kynay = new DateTime(nam, thang, 1);

            var model = _chiphikhoitaoService.GetAllChiPhiKhoiTaoPaging(1, khuvuc, tukhoa, 1, 100, chiphiId, false,
                kynay, false, "", "GetChiPhiKhoiTaoKy");

            return new OkObjectResult(model);
        }

        [HttpPost]
        public IActionResult DeleteChiPhiKhoiTao(ChiPhiKhoiTaoViewModel chiphikhoitaoVm)
        {
            if (!ModelState.IsValid)
            {
                IEnumerable<ModelError> allErrors = ModelState.Values.SelectMany(v => v.Errors);
                return new BadRequestObjectResult(allErrors);
            }
            else
            {
                if (chiphikhoitaoVm.InsertChiPhiKhoiTaoId == 3)
                {
                    var username = User.GetSpecificClaim("UserName");
                    chiphikhoitaoVm.CreateBy = username;
                    chiphikhoitaoVm.CreateDate = DateTime.Now;
                    chiphikhoitaoVm.UpdateBy = username;
                    chiphikhoitaoVm.UpdateDate = DateTime.Now;
                    chiphikhoitaoVm.KyKhoiTao = DateTime.Now;

                    var result = _authorizationService.AuthorizeAsync(User, "LUONGCHIPHI", Operations.Delete); // xoa chi phi khoi tao
                    if (result.Result.Succeeded == false)
                    {
                        return new ObjectResult(new GenericResult(false, "Bạn không đủ quyền xóa."));
                    }
                  
                    var chiphikhoitao = _chiphikhoitaoService.ChiPhiKhoiTaoAUD(chiphikhoitaoVm, "DelChiPhiKhoiTao");

                    return new OkObjectResult(chiphikhoitao);
                }
                else
                {
                    return new OkObjectResult(chiphikhoitaoVm);
                }
            }
        }

        [HttpPost]
        public IActionResult ExportExcelChiPhi(string CorporationId, int Nam, int Thang, string PhongDanhMucId, int ChiPhiId, int DotInId, int DieuKienId)
        {
            if (DieuKienId == 10)
            {
                //string sWebRootFolder = _hostingEnvironment.WebRootPath;
                //string directory = Path.Combine(sWebRootFolder, "export-files");
                //if (!Directory.Exists(directory))
                //{
                //    Directory.CreateDirectory(directory);
                //}
                //string sFileName = $"HieuQuaKD_{DateTime.Now:yyyyMMddhhmmss}.xlsx";
                //string fileUrl = $"{Request.Scheme}://{Request.Host}/export-files/{sFileName}";
                //FileInfo file = new FileInfo(Path.Combine(directory, sFileName));
                //if (file.Exists)
                //{
                //    file.Delete();
                //    file = new FileInfo(Path.Combine(sWebRootFolder, sFileName));
                //}

                //var khuvuc = !string.IsNullOrEmpty(CorporationId) ? CorporationId : "%";
                //var phong = !string.IsNullOrEmpty(PhongDanhMucId) ? PhongDanhMucId : "%";
                //var hosoId = new Guid();
                //var chiphiluongDetail = _chiphiluongService.GetListChiPhiLuong(1, Nam, Thang, khuvuc, phong, "", hosoId, ChiPhiId, 1, 1
                //    , false, 1, 1, true, "", 1, 1, "ChiPhiTangGiamList");

                //using (ExcelPackage package = new ExcelPackage(file))
                //{
                //    // add a new worksheet to the empty workbook
                //    ExcelWorksheet worksheet = package.Workbook.Worksheets.Add("HieuQuaKD");
                //    worksheet.Cells["A1"].LoadFromCollection(chiphiluongDetail, true, TableStyles.Light1);
                //    worksheet.Cells.AutoFitColumns();
                //    package.Save(); //Save the workbook.
                //}
                //return new OkObjectResult(fileUrl);

                string sWebRootFolder = _hostingEnvironment.WebRootPath;
                string sFileName = $"HieuQuaKinhDoanh.xlsx";
                // Template File
                string templateDocument = Path.Combine(sWebRootFolder, "templates", "HieuQuaKinhDoanh.xlsx");

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
                        ExcelWorksheet worksheet = package.Workbook.Worksheets["HieuQuaKinhDoanh"];

                        var khuvuc = !string.IsNullOrEmpty(CorporationId) ? CorporationId : "%";
                        var phong = !string.IsNullOrEmpty(PhongDanhMucId) ? PhongDanhMucId : "%";

                        var hosoId = new Guid();

                        var chiphiluongDetail = _chiphiluongService.GetListChiPhiLuong(1, Nam, Thang, khuvuc, phong, "", hosoId, ChiPhiId, 1, 1
                            , false, 1, 1, true, "", 1, 1, "ChiPhiTangGiamList");

                        int rowIndex = 10;
                        int count = 1;

                        if (khuvuc == "%")
                        {
                            worksheet.Cells[2, 3].Value = "";
                        }
                        else
                        {
                            var khuvucvm = _corporationsService.GetAllCorPaging(khuvuc, "", "", 1, 10, "", "", khuvuc, "GetCorporationId");
                            var khuvuc2 = khuvucvm.Result.Results[0];
                            worksheet.Cells[3, 2].Value = "XNĐN HUYỆN " + khuvuc2.Name.ToString().ToUpper();
                        }
                        worksheet.Cells[6, 2].Value = "THÁNG " + Thang.ToString() + " NĂM " + Nam.ToString();

                        var tongtienchiphigiam = chiphiluongDetail.Sum(p => p.TongTienChiPhitangGiam);
                        worksheet.Cells[13, 2].Value = "Bằng chữ: " + TextHelper.ToString(tongtienchiphigiam).Trim();

                        worksheet.InsertRow(10, chiphiluongDetail.Count());

                        foreach (var dtlnvDetail in chiphiluongDetail)
                        {
                            //Color DeepBlueHexCode = ColorTranslator.FromHtml("#254061");
                            // Cell 1, Carton Count
                            
                            //worksheet.Cells[rowIndex, 2].Style.Border.Left.Style = ExcelBorderStyle.Thick; // to dam                        
                            //worksheet.Cells[rowIndex, 2].Style.Border.Top.Color.SetColor(Color.Red);
                            worksheet.Cells[rowIndex, 2].Style.Border.Left.Style = ExcelBorderStyle.Medium; // to dam vua
                            worksheet.Cells[rowIndex, 2].Style.Border.Right.Style = ExcelBorderStyle.Thin; // lien nho
                            worksheet.Cells[rowIndex, 2].Style.Border.Top.Style = ExcelBorderStyle.Dotted; // khoan cach
                            worksheet.Cells[rowIndex, 2].Style.Border.Bottom.Style = ExcelBorderStyle.Dotted;
                            worksheet.Cells[rowIndex, 2].Style.Font.Size = 9;
                            worksheet.Cells[rowIndex, 2].Value = count.ToString();
                           
                            worksheet.Cells[rowIndex, 3].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                            worksheet.Cells[rowIndex, 3].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                            worksheet.Cells[rowIndex, 3].Style.Border.Top.Style = ExcelBorderStyle.Dotted;
                            worksheet.Cells[rowIndex, 3].Style.Border.Bottom.Style = ExcelBorderStyle.Dotted;
                            worksheet.Cells[rowIndex, 3].Style.Font.Size = 9;
                            worksheet.Cells[rowIndex, 3].Value = !string.IsNullOrEmpty(dtlnvDetail.TenNhanVien) ? dtlnvDetail.TenNhanVien.ToString() : "";
                            
                            worksheet.Cells[rowIndex, 4].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                            worksheet.Cells[rowIndex, 4].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                            worksheet.Cells[rowIndex, 4].Style.Border.Top.Style = ExcelBorderStyle.Dotted;
                            worksheet.Cells[rowIndex, 4].Style.Border.Bottom.Style = ExcelBorderStyle.Dotted;
                            worksheet.Cells[rowIndex, 4].Style.Font.Size = 9;
                            worksheet.Cells[rowIndex, 4].Value = !string.IsNullOrEmpty(dtlnvDetail.TenPhong) ? dtlnvDetail.TenPhong.ToString() : "";
                            
                            worksheet.Cells[rowIndex, 5].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                            worksheet.Cells[rowIndex, 5].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                            worksheet.Cells[rowIndex, 5].Style.Border.Top.Style = ExcelBorderStyle.Dotted;
                            worksheet.Cells[rowIndex, 5].Style.Border.Bottom.Style = ExcelBorderStyle.Dotted;
                            worksheet.Cells[rowIndex, 5].Style.Font.Size = 9;
                            worksheet.Cells[rowIndex, 5].Value = !string.IsNullOrEmpty(dtlnvDetail.TenChucVu) ? dtlnvDetail.TenChucVu.ToString() : "";

                            worksheet.Cells[rowIndex, 6].Value = dtlnvDetail.TongTienChiPhitangGiam;
                            worksheet.Cells[rowIndex, 6].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                            worksheet.Cells[rowIndex, 6].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                            worksheet.Cells[rowIndex, 6].Style.Border.Top.Style = ExcelBorderStyle.Dotted;
                            worksheet.Cells[rowIndex, 6].Style.Border.Bottom.Style = ExcelBorderStyle.Dotted;
                            worksheet.Cells[rowIndex, 6].Style.Font.Size = 10;

                            //worksheet.Cells[rowIndex, 23].Value = !string.IsNullOrEmpty(hdDetail.HuongDieuTri) ? hdDetail.HuongDieuTri.ToString() : "";
                            worksheet.Cells[rowIndex, 7].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                            worksheet.Cells[rowIndex, 7].Style.Border.Right.Style = ExcelBorderStyle.Medium;
                            worksheet.Cells[rowIndex, 7].Style.Border.Top.Style = ExcelBorderStyle.Dotted;
                            worksheet.Cells[rowIndex, 7].Style.Border.Bottom.Style = ExcelBorderStyle.Dotted;

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
            else
            {
                return new OkObjectResult(CorporationId);
            }
        }

        [HttpPost]
        public IActionResult ExportExcelChiPhiAn(string CorporationId, int Nam, int Thang, string PhongDanhMucId, int ChiPhiId, int DotInId, int DieuKienId)
        {
            if (DieuKienId == 10)
            {               

                string sWebRootFolder = _hostingEnvironment.WebRootPath;
                string sFileName = $"TienAn.xlsx";
                // Template File
                string templateDocument = Path.Combine(sWebRootFolder, "templates", "TienAn.xlsx");

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
                        ExcelWorksheet worksheet = package.Workbook.Worksheets["TienAn"];

                        var khuvuc = !string.IsNullOrEmpty(CorporationId) ? CorporationId : "%";
                        var phong = !string.IsNullOrEmpty(PhongDanhMucId) ? PhongDanhMucId : "%";

                        var hosoId = new Guid();

                        var chiphiluongDetail = _chiphiluongService.GetListChiPhiLuong(1, Nam, Thang, khuvuc, phong, "", hosoId, ChiPhiId, 1, 1
                            , false, 1, 1, true, "", 1, 1, "ChiPhiGiamTienAnList");

                        int rowIndex = 10;
                        int count = 1;

                        if (khuvuc == "%")
                        {
                            worksheet.Cells[2, 3].Value = "";
                        }
                        else
                        {
                            var khuvucvm = _corporationsService.GetAllCorPaging(khuvuc, "", "", 1, 10, "", "", khuvuc, "GetCorporationId");
                            var khuvuc2 = khuvucvm.Result.Results[0];
                            worksheet.Cells[3, 2].Value = "XNĐN HUYỆN " + khuvuc2.Name.ToString().ToUpper();
                        }
                        worksheet.Cells[6, 2].Value = "THÁNG " + Thang.ToString() + " NĂM " + Nam.ToString();

                        var tongtienchiphigiam = chiphiluongDetail.Sum(p => p.TongTienChiPhitangGiam);
                        worksheet.Cells[13, 2].Value = "Bằng chữ: " + TextHelper.ToString(tongtienchiphigiam).Trim();


                        worksheet.Cells[11, 5].Value = chiphiluongDetail.Count().ToString() + " người";

                        worksheet.InsertRow(10, chiphiluongDetail.Count());

                        foreach (var dtlnvDetail in chiphiluongDetail)
                        {
                            //Color DeepBlueHexCode = ColorTranslator.FromHtml("#254061");
                            // Cell 1, Carton Count

                            //worksheet.Cells[rowIndex, 2].Style.Border.Left.Style = ExcelBorderStyle.Thick; // to dam                        
                            //worksheet.Cells[rowIndex, 2].Style.Border.Top.Color.SetColor(Color.Red);
                            worksheet.Cells[rowIndex, 2].Style.Border.Left.Style = ExcelBorderStyle.Medium; // to dam vua
                            worksheet.Cells[rowIndex, 2].Style.Border.Right.Style = ExcelBorderStyle.Thin; // lien nho
                            worksheet.Cells[rowIndex, 2].Style.Border.Top.Style = ExcelBorderStyle.Dotted; // khoan cach
                            worksheet.Cells[rowIndex, 2].Style.Border.Bottom.Style = ExcelBorderStyle.Dotted;
                            worksheet.Cells[rowIndex, 2].Style.Font.Size = 9;
                            worksheet.Cells[rowIndex, 2].Value = count.ToString();

                            worksheet.Cells[rowIndex, 3].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                            worksheet.Cells[rowIndex, 3].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                            worksheet.Cells[rowIndex, 3].Style.Border.Top.Style = ExcelBorderStyle.Dotted;
                            worksheet.Cells[rowIndex, 3].Style.Border.Bottom.Style = ExcelBorderStyle.Dotted;
                            worksheet.Cells[rowIndex, 3].Style.Font.Size = 9;
                            worksheet.Cells[rowIndex, 3].Value = !string.IsNullOrEmpty(dtlnvDetail.TenNhanVien) ? dtlnvDetail.TenNhanVien.ToString() : "";

                            worksheet.Cells[rowIndex, 4].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                            worksheet.Cells[rowIndex, 4].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                            worksheet.Cells[rowIndex, 4].Style.Border.Top.Style = ExcelBorderStyle.Dotted;
                            worksheet.Cells[rowIndex, 4].Style.Border.Bottom.Style = ExcelBorderStyle.Dotted;
                            worksheet.Cells[rowIndex, 4].Style.Font.Size = 9;
                            worksheet.Cells[rowIndex, 4].Value = !string.IsNullOrEmpty(dtlnvDetail.TenPhong) ? dtlnvDetail.TenPhong.ToString() : "";

                            worksheet.Cells[rowIndex, 5].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                            worksheet.Cells[rowIndex, 5].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                            worksheet.Cells[rowIndex, 5].Style.Border.Top.Style = ExcelBorderStyle.Dotted;
                            worksheet.Cells[rowIndex, 5].Style.Border.Bottom.Style = ExcelBorderStyle.Dotted;
                            worksheet.Cells[rowIndex, 5].Style.Font.Size = 9;
                            worksheet.Cells[rowIndex, 5].Value = !string.IsNullOrEmpty(dtlnvDetail.TenChucVu) ? dtlnvDetail.TenChucVu.ToString() : "";

                            worksheet.Cells[rowIndex, 6].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                            worksheet.Cells[rowIndex, 6].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                            worksheet.Cells[rowIndex, 6].Style.Border.Top.Style = ExcelBorderStyle.Dotted;
                            worksheet.Cells[rowIndex, 6].Style.Border.Bottom.Style = ExcelBorderStyle.Dotted;
                            worksheet.Cells[rowIndex, 6].Style.Font.Size = 9;
                            worksheet.Cells[rowIndex, 6].Value = dtlnvDetail.SoNgayAn;

                            worksheet.Cells[rowIndex, 7].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                            worksheet.Cells[rowIndex, 7].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                            worksheet.Cells[rowIndex, 7].Style.Border.Top.Style = ExcelBorderStyle.Dotted;
                            worksheet.Cells[rowIndex, 7].Style.Border.Bottom.Style = ExcelBorderStyle.Dotted;
                            worksheet.Cells[rowIndex, 7].Style.Font.Size = 9;
                            worksheet.Cells[rowIndex, 7].Value = dtlnvDetail.TienChiPhiKhac;

                            worksheet.Cells[rowIndex, 8].Value = dtlnvDetail.TongTienChiPhitangGiam;
                            worksheet.Cells[rowIndex, 8].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                            worksheet.Cells[rowIndex, 8].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                            worksheet.Cells[rowIndex, 8].Style.Border.Top.Style = ExcelBorderStyle.Dotted;
                            worksheet.Cells[rowIndex, 8].Style.Border.Bottom.Style = ExcelBorderStyle.Dotted;
                            worksheet.Cells[rowIndex, 8].Style.Font.Size = 10;

                            //worksheet.Cells[rowIndex, 23].Value = !string.IsNullOrEmpty(hdDetail.HuongDieuTri) ? hdDetail.HuongDieuTri.ToString() : "";
                            worksheet.Cells[rowIndex, 9].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                            worksheet.Cells[rowIndex, 9].Style.Border.Right.Style = ExcelBorderStyle.Medium;
                            worksheet.Cells[rowIndex, 9].Style.Border.Top.Style = ExcelBorderStyle.Dotted;
                            worksheet.Cells[rowIndex, 9].Style.Border.Bottom.Style = ExcelBorderStyle.Dotted;

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
            else
            {
                return new OkObjectResult(CorporationId);
            }
        }


        #region Danh mục chi phi luong

        [HttpGet]
        public IActionResult DieuKienGetList()
        {
            var model = _dieukientimService.DieuKienTimGetList("ChiPhi", "", "", "BangDieuKienTimGetList");
            return new OkObjectResult(model);
        }

        #endregion

        #endregion


    }
}