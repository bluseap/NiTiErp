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
    public class CongNgayController : BaseController
    {
        private readonly IHostingEnvironment _hostingEnvironment;
        private readonly NiTiErp.Application.Interfaces.IUserService _userService;
        private readonly IAuthorizationService _authorizationService;

        private readonly ILuongDotInKyService _luongdotinkyService;
        private readonly IDieuKienTimService _dieukientimService;
        private readonly ILuongKyHieuService _luongkyhieuService;
        private readonly ILuongBaoHiemService _luongbaohiemService;

        private readonly Application.Dapper.Interfaces.ICorporationService _corporationsService;

        public CongNgayController(IHostingEnvironment hostingEnvironment,
            NiTiErp.Application.Interfaces.IUserService userService,
            IAuthorizationService authorizationService,

            ILuongDotInKyService luongdotinkyService,
            IDieuKienTimService dieukientimService,
            ILuongKyHieuService luongkyhieuService,
            ILuongBaoHiemService luongbaohiemService,
            Application.Dapper.Interfaces.ICorporationService corporationsService
            )
        {
            _hostingEnvironment = hostingEnvironment;
            _userService = userService;
            _authorizationService = authorizationService;

            _luongdotinkyService = luongdotinkyService;
            _dieukientimService = dieukientimService;
            _luongkyhieuService = luongkyhieuService;
            _luongbaohiemService = luongbaohiemService;

            _corporationsService = corporationsService;
        }

        public IActionResult Index()
        {            
            return View();
        }

        #region AJAX API

        [HttpPost]
        public IActionResult AddUpdateLuongBaoHiem(LuongBaoHiemViewModel luongbaohiemVm)
        {
            if (!ModelState.IsValid)
            {
                IEnumerable<ModelError> allErrors = ModelState.Values.SelectMany(v => v.Errors);
                return new BadRequestObjectResult(allErrors);
            }
            else
            {
                var username = User.GetSpecificClaim("UserName");

                luongbaohiemVm.CreateBy = username;
                luongbaohiemVm.CreateDate = DateTime.Now;
                luongbaohiemVm.UpdateBy = username;
                luongbaohiemVm.UpdateDate = DateTime.Now;

                if (luongbaohiemVm.InsertLuongBaoHiemId == 2 )
                {
                    var result = _authorizationService.AuthorizeAsync(User, "LUONGNHAP", Operations.Update); // Cap nhat luong bao hiem nhan vien cham cong ngay
                    if (result.Result.Succeeded == false)
                    {
                        return new ObjectResult(new GenericResult(false, "Bạn không đủ quyền thêm mới."));
                    }                   

                    var luongbaohiem = _luongbaohiemService.LuongBaoHiemAUD(luongbaohiemVm, "UpBangChamCongNgay");
                    return new OkObjectResult(luongbaohiem);
                
                }
                else
                {
                    return new OkObjectResult(luongbaohiemVm);
                }

            }
        }

        public IActionResult LuongBaoHiemGetList(int nam, int thang, string corporationId, string phongId,
            string chucvuId, string keyword, int page, int pageSize, string dotinluong)
        {
            var khuvuc = !string.IsNullOrEmpty(corporationId) ? corporationId : "%";
            var phong = !string.IsNullOrEmpty(phongId) ? phongId : "%";
            var tukhoa = !string.IsNullOrEmpty(keyword) ? keyword : "%";
            var chucvu = !string.IsNullOrEmpty(chucvuId) ? chucvuId : "%";

            var hosoid = new Guid();

            var model = _luongbaohiemService.LuongBaoHiemGetList(1, nam, thang, khuvuc, phong, 
                chucvuId, hosoid, "", "", "", dotinluong, tukhoa, "GetListLuongBaoHiemKy");

            return new OkObjectResult(model);
        }

        public IActionResult LuongBaoHiemGetListId(Int64 Id, int nam, int thang, string corporationId, string phongId,
            string chucvuId, string keyword, int page, int pageSize)
        {
            var khuvuc = !string.IsNullOrEmpty(corporationId) ? corporationId : "%";
            var phong = !string.IsNullOrEmpty(phongId) ? phongId : "%";
            var tukhoa = !string.IsNullOrEmpty(keyword) ? keyword : "%";
            var chucvu = !string.IsNullOrEmpty(chucvuId) ? chucvuId : "%";

            var hosoid = new Guid();

            var model = _luongbaohiemService.LuongBaoHiemGetList(Id, nam, thang, khuvuc, phong,
                chucvuId, hosoid, "", "", "", "", keyword, "GetLuongBaoHiemId");

            return new OkObjectResult(model);
        }

        [HttpPost]
        public IActionResult ExportExcelChamCongNgay(int thangChamCong, int namChamCong, string luongDotInId, string makvChamCong, string madphongChamCong,
            string keywordChamCong, string dieukienChamCong)
        {           
            string sWebRootFolder = _hostingEnvironment.WebRootPath;
            string sFileName = $"ChamCongNgay.xlsx";
            // Template File
            string templateDocument = Path.Combine(sWebRootFolder, "templates", "ChamCongNgay.xlsx");

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
                    ExcelWorksheet worksheet = package.Workbook.Worksheets["ChamCongNgay"];

                    var khuvuc = !string.IsNullOrEmpty(makvChamCong) ? makvChamCong : "%";
                    var phong = !string.IsNullOrEmpty(madphongChamCong) ? madphongChamCong : "%";
                    var tukhoa = !string.IsNullOrEmpty(keywordChamCong) ? keywordChamCong : "%";

                    var hosoid = new Guid();
                    var suckhoeDetail = _luongbaohiemService.LuongBaoHiemGetList(1, namChamCong, thangChamCong, khuvuc, phong,
                        "", hosoid, "", "", "", luongDotInId, tukhoa, "GetListLuongBaoHiemKy");

                    int rowIndex = 12;
                    int count = 1;

                    if (khuvuc == "%")
                    {
                        worksheet.Cells[3, 2].Value = "";
                    }
                    else
                    {
                        var khuvucvm = _corporationsService.GetAllCorPaging(khuvuc, "", "", 1, 10, "", "", khuvuc, "GetCorporationId");
                        worksheet.Cells[3, 2].Value = khuvucvm.Result.Results[0].Name.ToString().ToUpper();

                        worksheet.Cells[3, 2].Style.Font.Size = 8;
                        worksheet.Cells[3, 2].Style.Font.Bold = true;
                        worksheet.Cells[3, 2].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                        worksheet.Cells[3, 2].Style.VerticalAlignment = ExcelVerticalAlignment.Center;
                    }

                    worksheet.Cells[6, 2].Value = "(Tháng " + thangChamCong.ToString() + "/" + namChamCong.ToString() + ")";
                    worksheet.Cells[6, 2].Style.Font.Size = 7;
                    worksheet.Cells[6, 2].Style.Font.Bold = true;
                    worksheet.Cells[6, 2].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center; // canh giua
                    worksheet.Cells[6, 2].Style.VerticalAlignment = ExcelVerticalAlignment.Center;

                    worksheet.InsertRow(12, suckhoeDetail.Result.Count());
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
                        worksheet.Cells[rowIndex, 2].Style.Font.Size = 7;
                        worksheet.Row(rowIndex).Height = 9;

                        worksheet.Cells[rowIndex, 3].Value = !string.IsNullOrEmpty(hdDetail.TenNhanVien) ? hdDetail.TenNhanVien.ToString() : "";
                        worksheet.Cells[rowIndex, 3].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowIndex, 3].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowIndex, 3].Style.Border.Top.Style = ExcelBorderStyle.Dotted;
                        worksheet.Cells[rowIndex, 3].Style.Border.Bottom.Style = ExcelBorderStyle.Dotted;
                        worksheet.Cells[rowIndex, 3].Style.Font.Size = 7;
                        worksheet.Row(rowIndex).Height = 9;

                        worksheet.Cells[rowIndex, 4].Value = !string.IsNullOrEmpty(hdDetail.TenPhong) ? hdDetail.TenPhong.ToString() : "";
                        worksheet.Cells[rowIndex, 4].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowIndex, 4].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowIndex, 4].Style.Border.Top.Style = ExcelBorderStyle.Dotted;
                        worksheet.Cells[rowIndex, 4].Style.Border.Bottom.Style = ExcelBorderStyle.Dotted;
                        worksheet.Cells[rowIndex, 4].Style.Font.Size = 7;
                        worksheet.Row(rowIndex).Height = 9;

                        worksheet.Cells[rowIndex, 5].Value = !string.IsNullOrEmpty(hdDetail.TenChucVu) ? hdDetail.TenChucVu.ToString() : "";
                        worksheet.Cells[rowIndex, 5].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowIndex, 5].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowIndex, 5].Style.Border.Top.Style = ExcelBorderStyle.Dotted;
                        worksheet.Cells[rowIndex, 5].Style.Border.Bottom.Style = ExcelBorderStyle.Dotted;
                        worksheet.Cells[rowIndex, 5].Style.Font.Size = 7;
                        worksheet.Row(rowIndex).Height = 9;


                        Color colFromHex = System.Drawing.ColorTranslator.FromHtml("#DDDDDD"); // mau xam nhat
                        if (hdDetail.Ngay01.ToString() == "CN")
                        {
                            worksheet.Cells[rowIndex, 6].Style.Fill.PatternType = ExcelFillStyle.Solid; // 
                            worksheet.Cells[rowIndex, 6].Style.Fill.BackgroundColor.SetColor(colFromHex);
                        }                        
                        worksheet.Cells[rowIndex, 6].Value = !string.IsNullOrEmpty(hdDetail.Ngay01.ToString()) ? hdDetail.Ngay01.ToString() : "";                        
                        worksheet.Cells[rowIndex, 6].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowIndex, 6].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowIndex, 6].Style.Border.Top.Style = ExcelBorderStyle.Dotted;
                        worksheet.Cells[rowIndex, 6].Style.Border.Bottom.Style = ExcelBorderStyle.Dotted;
                        worksheet.Cells[rowIndex, 6].Style.Font.Size = 7;
                        worksheet.Cells[rowIndex, 6].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;

                        if (hdDetail.Ngay02.ToString() == "CN")
                        {
                            worksheet.Cells[rowIndex, 7].Style.Fill.PatternType = ExcelFillStyle.Solid; // 
                            worksheet.Cells[rowIndex, 7].Style.Fill.BackgroundColor.SetColor(colFromHex);
                        }
                        worksheet.Cells[rowIndex, 7].Value = !string.IsNullOrEmpty(hdDetail.Ngay02.ToString()) ? hdDetail.Ngay02.ToString() : "";
                        worksheet.Cells[rowIndex, 7].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowIndex, 7].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowIndex, 7].Style.Border.Top.Style = ExcelBorderStyle.Dotted;
                        worksheet.Cells[rowIndex, 7].Style.Border.Bottom.Style = ExcelBorderStyle.Dotted;
                        worksheet.Cells[rowIndex, 7].Style.Font.Size = 7;
                        worksheet.Cells[rowIndex, 7].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;

                        if (hdDetail.Ngay03.ToString() == "CN")
                        {
                            worksheet.Cells[rowIndex, 8].Style.Fill.PatternType = ExcelFillStyle.Solid; // 
                            worksheet.Cells[rowIndex, 8].Style.Fill.BackgroundColor.SetColor(colFromHex);
                        }
                        worksheet.Cells[rowIndex, 8].Value = !string.IsNullOrEmpty(hdDetail.Ngay03.ToString()) ? hdDetail.Ngay03.ToString() : "";
                        worksheet.Cells[rowIndex, 8].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowIndex, 8].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowIndex, 8].Style.Border.Top.Style = ExcelBorderStyle.Dotted;
                        worksheet.Cells[rowIndex, 8].Style.Border.Bottom.Style = ExcelBorderStyle.Dotted;
                        worksheet.Cells[rowIndex, 8].Style.Font.Size = 7;
                        worksheet.Cells[rowIndex, 8].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;

                        if (hdDetail.Ngay04.ToString() == "CN")
                        {
                            worksheet.Cells[rowIndex, 9].Style.Fill.PatternType = ExcelFillStyle.Solid; // 
                            worksheet.Cells[rowIndex, 9].Style.Fill.BackgroundColor.SetColor(colFromHex);
                        }
                        worksheet.Cells[rowIndex, 9].Value = !string.IsNullOrEmpty(hdDetail.Ngay04.ToString()) ? hdDetail.Ngay04.ToString() : "";
                        worksheet.Cells[rowIndex, 9].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowIndex, 9].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowIndex, 9].Style.Border.Top.Style = ExcelBorderStyle.Dotted;
                        worksheet.Cells[rowIndex, 9].Style.Border.Bottom.Style = ExcelBorderStyle.Dotted;
                        worksheet.Cells[rowIndex, 9].Style.Font.Size = 7;
                        worksheet.Cells[rowIndex, 9].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;

                        if (hdDetail.Ngay04.ToString() == "CN")
                        {
                            worksheet.Cells[rowIndex, 9].Style.Fill.PatternType = ExcelFillStyle.Solid; // 
                            worksheet.Cells[rowIndex, 9].Style.Fill.BackgroundColor.SetColor(colFromHex);
                        }
                        worksheet.Cells[rowIndex, 9].Value = !string.IsNullOrEmpty(hdDetail.Ngay04.ToString()) ? hdDetail.Ngay04.ToString() : "";
                        worksheet.Cells[rowIndex, 9].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowIndex, 9].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowIndex, 9].Style.Border.Top.Style = ExcelBorderStyle.Dotted;
                        worksheet.Cells[rowIndex, 9].Style.Border.Bottom.Style = ExcelBorderStyle.Dotted;
                        worksheet.Cells[rowIndex, 9].Style.Font.Size = 7;
                        worksheet.Cells[rowIndex, 9].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;

                        if (hdDetail.Ngay05.ToString() == "CN")
                        {
                            worksheet.Cells[rowIndex, 10].Style.Fill.PatternType = ExcelFillStyle.Solid; // 
                            worksheet.Cells[rowIndex, 10].Style.Fill.BackgroundColor.SetColor(colFromHex);
                        }
                        worksheet.Cells[rowIndex, 10].Value = !string.IsNullOrEmpty(hdDetail.Ngay05.ToString()) ? hdDetail.Ngay05.ToString() : "";
                        worksheet.Cells[rowIndex, 10].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowIndex, 10].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowIndex, 10].Style.Border.Top.Style = ExcelBorderStyle.Dotted;
                        worksheet.Cells[rowIndex, 10].Style.Border.Bottom.Style = ExcelBorderStyle.Dotted;
                        worksheet.Cells[rowIndex, 10].Style.Font.Size = 7;
                        worksheet.Cells[rowIndex, 10].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;

                        if (hdDetail.Ngay06.ToString() == "CN")
                        {
                            worksheet.Cells[rowIndex, 11].Style.Fill.PatternType = ExcelFillStyle.Solid; // 
                            worksheet.Cells[rowIndex, 11].Style.Fill.BackgroundColor.SetColor(colFromHex);
                        }
                        worksheet.Cells[rowIndex, 11].Value = !string.IsNullOrEmpty(hdDetail.Ngay06.ToString()) ? hdDetail.Ngay06.ToString() : "";
                        worksheet.Cells[rowIndex, 11].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowIndex, 11].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowIndex, 11].Style.Border.Top.Style = ExcelBorderStyle.Dotted;
                        worksheet.Cells[rowIndex, 11].Style.Border.Bottom.Style = ExcelBorderStyle.Dotted;
                        worksheet.Cells[rowIndex, 11].Style.Font.Size = 7;
                        worksheet.Cells[rowIndex, 11].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;

                        if (hdDetail.Ngay07.ToString() == "CN")
                        {
                            worksheet.Cells[rowIndex, 12].Style.Fill.PatternType = ExcelFillStyle.Solid; // 
                            worksheet.Cells[rowIndex, 12].Style.Fill.BackgroundColor.SetColor(colFromHex);
                        }
                        worksheet.Cells[rowIndex, 12].Value = !string.IsNullOrEmpty(hdDetail.Ngay07.ToString()) ? hdDetail.Ngay07.ToString() : "";
                        worksheet.Cells[rowIndex, 12].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowIndex, 12].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowIndex, 12].Style.Border.Top.Style = ExcelBorderStyle.Dotted;
                        worksheet.Cells[rowIndex, 12].Style.Border.Bottom.Style = ExcelBorderStyle.Dotted;
                        worksheet.Cells[rowIndex, 12].Style.Font.Size = 7;
                        worksheet.Cells[rowIndex, 12].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;

                        if (hdDetail.Ngay08.ToString() == "CN")
                        {
                            worksheet.Cells[rowIndex, 13].Style.Fill.PatternType = ExcelFillStyle.Solid; // 
                            worksheet.Cells[rowIndex, 13].Style.Fill.BackgroundColor.SetColor(colFromHex);
                        }
                        worksheet.Cells[rowIndex, 13].Value = !string.IsNullOrEmpty(hdDetail.Ngay08.ToString()) ? hdDetail.Ngay08.ToString() : "";
                        worksheet.Cells[rowIndex, 13].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowIndex, 13].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowIndex, 13].Style.Border.Top.Style = ExcelBorderStyle.Dotted;
                        worksheet.Cells[rowIndex, 13].Style.Border.Bottom.Style = ExcelBorderStyle.Dotted;
                        worksheet.Cells[rowIndex, 13].Style.Font.Size = 7;
                        worksheet.Cells[rowIndex, 13].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;

                        if (hdDetail.Ngay09.ToString() == "CN")
                        {
                            worksheet.Cells[rowIndex, 14].Style.Fill.PatternType = ExcelFillStyle.Solid; // 
                            worksheet.Cells[rowIndex, 14].Style.Fill.BackgroundColor.SetColor(colFromHex);
                        }
                        worksheet.Cells[rowIndex, 14].Value = !string.IsNullOrEmpty(hdDetail.Ngay09.ToString()) ? hdDetail.Ngay09.ToString() : "";
                        worksheet.Cells[rowIndex, 14].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowIndex, 14].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowIndex, 14].Style.Border.Top.Style = ExcelBorderStyle.Dotted;
                        worksheet.Cells[rowIndex, 14].Style.Border.Bottom.Style = ExcelBorderStyle.Dotted;
                        worksheet.Cells[rowIndex, 14].Style.Font.Size = 7;
                        worksheet.Cells[rowIndex, 14].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;

                        if (hdDetail.Ngay10.ToString() == "CN")
                        {
                            worksheet.Cells[rowIndex, 15].Style.Fill.PatternType = ExcelFillStyle.Solid; // 
                            worksheet.Cells[rowIndex, 15].Style.Fill.BackgroundColor.SetColor(colFromHex);
                        }
                        worksheet.Cells[rowIndex, 15].Value = !string.IsNullOrEmpty(hdDetail.Ngay10.ToString()) ? hdDetail.Ngay10.ToString() : "";
                        worksheet.Cells[rowIndex, 15].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowIndex, 15].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowIndex, 15].Style.Border.Top.Style = ExcelBorderStyle.Dotted;
                        worksheet.Cells[rowIndex, 15].Style.Border.Bottom.Style = ExcelBorderStyle.Dotted;
                        worksheet.Cells[rowIndex, 15].Style.Font.Size = 7;
                        worksheet.Cells[rowIndex, 15].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;

                        if (hdDetail.Ngay11.ToString() == "CN")
                        {
                            worksheet.Cells[rowIndex, 16].Style.Fill.PatternType = ExcelFillStyle.Solid; // 
                            worksheet.Cells[rowIndex, 16].Style.Fill.BackgroundColor.SetColor(colFromHex);
                        }
                        worksheet.Cells[rowIndex, 16].Value = !string.IsNullOrEmpty(hdDetail.Ngay11.ToString()) ? hdDetail.Ngay11.ToString() : "";
                        worksheet.Cells[rowIndex, 16].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowIndex, 16].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowIndex, 16].Style.Border.Top.Style = ExcelBorderStyle.Dotted;
                        worksheet.Cells[rowIndex, 16].Style.Border.Bottom.Style = ExcelBorderStyle.Dotted;
                        worksheet.Cells[rowIndex, 16].Style.Font.Size = 7;
                        worksheet.Cells[rowIndex, 16].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;

                        if (hdDetail.Ngay12.ToString() == "CN")
                        {
                            worksheet.Cells[rowIndex, 17].Style.Fill.PatternType = ExcelFillStyle.Solid; // 
                            worksheet.Cells[rowIndex, 17].Style.Fill.BackgroundColor.SetColor(colFromHex);
                        }
                        worksheet.Cells[rowIndex, 17].Value = !string.IsNullOrEmpty(hdDetail.Ngay12.ToString()) ? hdDetail.Ngay12.ToString() : "";
                        worksheet.Cells[rowIndex, 17].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowIndex, 17].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowIndex, 17].Style.Border.Top.Style = ExcelBorderStyle.Dotted;
                        worksheet.Cells[rowIndex, 17].Style.Border.Bottom.Style = ExcelBorderStyle.Dotted;
                        worksheet.Cells[rowIndex, 17].Style.Font.Size = 7;
                        worksheet.Cells[rowIndex, 17].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;

                        if (hdDetail.Ngay13.ToString() == "CN")
                        {
                            worksheet.Cells[rowIndex, 18].Style.Fill.PatternType = ExcelFillStyle.Solid; // 
                            worksheet.Cells[rowIndex, 18].Style.Fill.BackgroundColor.SetColor(colFromHex);
                        }
                        worksheet.Cells[rowIndex, 18].Value = !string.IsNullOrEmpty(hdDetail.Ngay13.ToString()) ? hdDetail.Ngay13.ToString() : "";
                        worksheet.Cells[rowIndex, 18].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowIndex, 18].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowIndex, 18].Style.Border.Top.Style = ExcelBorderStyle.Dotted;
                        worksheet.Cells[rowIndex, 18].Style.Border.Bottom.Style = ExcelBorderStyle.Dotted;
                        worksheet.Cells[rowIndex, 18].Style.Font.Size = 7;
                        worksheet.Cells[rowIndex, 18].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;

                        if (hdDetail.Ngay14.ToString() == "CN")
                        {
                            worksheet.Cells[rowIndex, 19].Style.Fill.PatternType = ExcelFillStyle.Solid; // 
                            worksheet.Cells[rowIndex, 19].Style.Fill.BackgroundColor.SetColor(colFromHex);
                        }
                        worksheet.Cells[rowIndex, 19].Value = !string.IsNullOrEmpty(hdDetail.Ngay14.ToString()) ? hdDetail.Ngay14.ToString() : "";
                        worksheet.Cells[rowIndex, 19].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowIndex, 19].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowIndex, 19].Style.Border.Top.Style = ExcelBorderStyle.Dotted;
                        worksheet.Cells[rowIndex, 19].Style.Border.Bottom.Style = ExcelBorderStyle.Dotted;
                        worksheet.Cells[rowIndex, 19].Style.Font.Size = 7;
                        worksheet.Cells[rowIndex, 19].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;

                        if (hdDetail.Ngay15.ToString() == "CN")
                        {
                            worksheet.Cells[rowIndex, 20].Style.Fill.PatternType = ExcelFillStyle.Solid; // 
                            worksheet.Cells[rowIndex, 20].Style.Fill.BackgroundColor.SetColor(colFromHex);
                        }
                        worksheet.Cells[rowIndex, 20].Value = !string.IsNullOrEmpty(hdDetail.Ngay15.ToString()) ? hdDetail.Ngay15.ToString() : "";
                        worksheet.Cells[rowIndex, 20].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowIndex, 20].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowIndex, 20].Style.Border.Top.Style = ExcelBorderStyle.Dotted;
                        worksheet.Cells[rowIndex, 20].Style.Border.Bottom.Style = ExcelBorderStyle.Dotted;
                        worksheet.Cells[rowIndex, 20].Style.Font.Size = 7;
                        worksheet.Cells[rowIndex, 20].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;

                        if (hdDetail.Ngay16.ToString() == "CN")
                        {
                            worksheet.Cells[rowIndex, 21].Style.Fill.PatternType = ExcelFillStyle.Solid; // 
                            worksheet.Cells[rowIndex, 21].Style.Fill.BackgroundColor.SetColor(colFromHex);
                        }
                        worksheet.Cells[rowIndex, 21].Value = !string.IsNullOrEmpty(hdDetail.Ngay16.ToString()) ? hdDetail.Ngay16.ToString() : "";
                        worksheet.Cells[rowIndex, 21].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowIndex, 21].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowIndex, 21].Style.Border.Top.Style = ExcelBorderStyle.Dotted;
                        worksheet.Cells[rowIndex, 21].Style.Border.Bottom.Style = ExcelBorderStyle.Dotted;
                        worksheet.Cells[rowIndex, 21].Style.Font.Size = 7;
                        worksheet.Cells[rowIndex, 21].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;

                        if (hdDetail.Ngay17.ToString() == "CN")
                        {
                            worksheet.Cells[rowIndex, 22].Style.Fill.PatternType = ExcelFillStyle.Solid; // 
                            worksheet.Cells[rowIndex, 22].Style.Fill.BackgroundColor.SetColor(colFromHex);
                        }
                        worksheet.Cells[rowIndex, 22].Value = !string.IsNullOrEmpty(hdDetail.Ngay17.ToString()) ? hdDetail.Ngay17.ToString() : "";
                        worksheet.Cells[rowIndex, 22].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowIndex, 22].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowIndex, 22].Style.Border.Top.Style = ExcelBorderStyle.Dotted;
                        worksheet.Cells[rowIndex, 22].Style.Border.Bottom.Style = ExcelBorderStyle.Dotted;
                        worksheet.Cells[rowIndex, 22].Style.Font.Size = 7;
                        worksheet.Cells[rowIndex, 22].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;

                        if (hdDetail.Ngay18.ToString() == "CN")
                        {
                            worksheet.Cells[rowIndex, 23].Style.Fill.PatternType = ExcelFillStyle.Solid; // 
                            worksheet.Cells[rowIndex, 23].Style.Fill.BackgroundColor.SetColor(colFromHex);
                        }
                        worksheet.Cells[rowIndex, 23].Value = !string.IsNullOrEmpty(hdDetail.Ngay18.ToString()) ? hdDetail.Ngay18.ToString() : "";
                        worksheet.Cells[rowIndex, 23].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowIndex, 23].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowIndex, 23].Style.Border.Top.Style = ExcelBorderStyle.Dotted;
                        worksheet.Cells[rowIndex, 23].Style.Border.Bottom.Style = ExcelBorderStyle.Dotted;
                        worksheet.Cells[rowIndex, 23].Style.Font.Size = 7;
                        worksheet.Cells[rowIndex, 23].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;

                        if (hdDetail.Ngay19.ToString() == "CN")
                        {
                            worksheet.Cells[rowIndex, 24].Style.Fill.PatternType = ExcelFillStyle.Solid; // 
                            worksheet.Cells[rowIndex, 24].Style.Fill.BackgroundColor.SetColor(colFromHex);
                        }
                        worksheet.Cells[rowIndex, 24].Value = !string.IsNullOrEmpty(hdDetail.Ngay19.ToString()) ? hdDetail.Ngay19.ToString() : "";
                        worksheet.Cells[rowIndex, 24].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowIndex, 24].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowIndex, 24].Style.Border.Top.Style = ExcelBorderStyle.Dotted;
                        worksheet.Cells[rowIndex, 24].Style.Border.Bottom.Style = ExcelBorderStyle.Dotted;
                        worksheet.Cells[rowIndex, 24].Style.Font.Size = 7;
                        worksheet.Cells[rowIndex, 24].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;

                        if (hdDetail.Ngay20.ToString() == "CN")
                        {
                            worksheet.Cells[rowIndex, 25].Style.Fill.PatternType = ExcelFillStyle.Solid; // 
                            worksheet.Cells[rowIndex, 25].Style.Fill.BackgroundColor.SetColor(colFromHex);
                        }
                        worksheet.Cells[rowIndex, 25].Value = !string.IsNullOrEmpty(hdDetail.Ngay20.ToString()) ? hdDetail.Ngay20.ToString() : "";
                        worksheet.Cells[rowIndex, 25].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowIndex, 25].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowIndex, 25].Style.Border.Top.Style = ExcelBorderStyle.Dotted;
                        worksheet.Cells[rowIndex, 25].Style.Border.Bottom.Style = ExcelBorderStyle.Dotted;
                        worksheet.Cells[rowIndex, 25].Style.Font.Size = 7;
                        worksheet.Cells[rowIndex, 25].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;

                        if (hdDetail.Ngay21.ToString() == "CN")
                        {
                            worksheet.Cells[rowIndex, 26].Style.Fill.PatternType = ExcelFillStyle.Solid; // 
                            worksheet.Cells[rowIndex, 26].Style.Fill.BackgroundColor.SetColor(colFromHex);
                        }
                        worksheet.Cells[rowIndex, 26].Value = !string.IsNullOrEmpty(hdDetail.Ngay21.ToString()) ? hdDetail.Ngay21.ToString() : "";
                        worksheet.Cells[rowIndex, 26].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowIndex, 26].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowIndex, 26].Style.Border.Top.Style = ExcelBorderStyle.Dotted;
                        worksheet.Cells[rowIndex, 26].Style.Border.Bottom.Style = ExcelBorderStyle.Dotted;
                        worksheet.Cells[rowIndex, 26].Style.Font.Size = 7;
                        worksheet.Cells[rowIndex, 26].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;

                        if (hdDetail.Ngay22.ToString() == "CN")
                        {
                            worksheet.Cells[rowIndex, 27].Style.Fill.PatternType = ExcelFillStyle.Solid; // 
                            worksheet.Cells[rowIndex, 27].Style.Fill.BackgroundColor.SetColor(colFromHex);
                        }
                        worksheet.Cells[rowIndex, 27].Value = !string.IsNullOrEmpty(hdDetail.Ngay22.ToString()) ? hdDetail.Ngay22.ToString() : "";
                        worksheet.Cells[rowIndex, 27].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowIndex, 27].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowIndex, 27].Style.Border.Top.Style = ExcelBorderStyle.Dotted;
                        worksheet.Cells[rowIndex, 27].Style.Border.Bottom.Style = ExcelBorderStyle.Dotted;
                        worksheet.Cells[rowIndex, 27].Style.Font.Size = 7;
                        worksheet.Cells[rowIndex, 27].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;

                        if (hdDetail.Ngay23.ToString() == "CN")
                        {
                            worksheet.Cells[rowIndex, 28].Style.Fill.PatternType = ExcelFillStyle.Solid; // 
                            worksheet.Cells[rowIndex, 28].Style.Fill.BackgroundColor.SetColor(colFromHex);
                        }
                        worksheet.Cells[rowIndex, 28].Value = !string.IsNullOrEmpty(hdDetail.Ngay23.ToString()) ? hdDetail.Ngay23.ToString() : "";
                        worksheet.Cells[rowIndex, 28].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowIndex, 28].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowIndex, 28].Style.Border.Top.Style = ExcelBorderStyle.Dotted;
                        worksheet.Cells[rowIndex, 28].Style.Border.Bottom.Style = ExcelBorderStyle.Dotted;
                        worksheet.Cells[rowIndex, 28].Style.Font.Size = 7;
                        worksheet.Cells[rowIndex, 28].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;

                        if (hdDetail.Ngay24.ToString() == "CN")
                        {
                            worksheet.Cells[rowIndex, 29].Style.Fill.PatternType = ExcelFillStyle.Solid; // 
                            worksheet.Cells[rowIndex, 29].Style.Fill.BackgroundColor.SetColor(colFromHex);
                        }
                        worksheet.Cells[rowIndex, 29].Value = !string.IsNullOrEmpty(hdDetail.Ngay24.ToString()) ? hdDetail.Ngay24.ToString() : "";
                        worksheet.Cells[rowIndex, 29].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowIndex, 29].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowIndex, 29].Style.Border.Top.Style = ExcelBorderStyle.Dotted;
                        worksheet.Cells[rowIndex, 29].Style.Border.Bottom.Style = ExcelBorderStyle.Dotted;
                        worksheet.Cells[rowIndex, 29].Style.Font.Size = 7;
                        worksheet.Cells[rowIndex, 29].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;

                        if (hdDetail.Ngay25.ToString() == "CN")
                        {
                            worksheet.Cells[rowIndex, 30].Style.Fill.PatternType = ExcelFillStyle.Solid; // 
                            worksheet.Cells[rowIndex, 30].Style.Fill.BackgroundColor.SetColor(colFromHex);
                        }
                        worksheet.Cells[rowIndex, 30].Value = !string.IsNullOrEmpty(hdDetail.Ngay25.ToString()) ? hdDetail.Ngay25.ToString() : "";
                        worksheet.Cells[rowIndex, 30].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowIndex, 30].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowIndex, 30].Style.Border.Top.Style = ExcelBorderStyle.Dotted;
                        worksheet.Cells[rowIndex, 30].Style.Border.Bottom.Style = ExcelBorderStyle.Dotted;
                        worksheet.Cells[rowIndex, 30].Style.Font.Size = 7;
                        worksheet.Cells[rowIndex, 30].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;

                        if (hdDetail.Ngay26.ToString() == "CN")
                        {
                            worksheet.Cells[rowIndex, 31].Style.Fill.PatternType = ExcelFillStyle.Solid; // 
                            worksheet.Cells[rowIndex, 31].Style.Fill.BackgroundColor.SetColor(colFromHex);
                        }
                        worksheet.Cells[rowIndex, 31].Value = !string.IsNullOrEmpty(hdDetail.Ngay26.ToString()) ? hdDetail.Ngay26.ToString() : "";
                        worksheet.Cells[rowIndex, 31].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowIndex, 31].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowIndex, 31].Style.Border.Top.Style = ExcelBorderStyle.Dotted;
                        worksheet.Cells[rowIndex, 31].Style.Border.Bottom.Style = ExcelBorderStyle.Dotted;
                        worksheet.Cells[rowIndex, 31].Style.Font.Size = 7;
                        worksheet.Cells[rowIndex, 31].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;

                        if (hdDetail.Ngay27.ToString() == "CN")
                        {
                            worksheet.Cells[rowIndex, 32].Style.Fill.PatternType = ExcelFillStyle.Solid; // 
                            worksheet.Cells[rowIndex, 32].Style.Fill.BackgroundColor.SetColor(colFromHex);
                        }
                        worksheet.Cells[rowIndex, 32].Value = !string.IsNullOrEmpty(hdDetail.Ngay27.ToString()) ? hdDetail.Ngay27.ToString() : "";
                        worksheet.Cells[rowIndex, 32].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowIndex, 32].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowIndex, 32].Style.Border.Top.Style = ExcelBorderStyle.Dotted;
                        worksheet.Cells[rowIndex, 32].Style.Border.Bottom.Style = ExcelBorderStyle.Dotted;
                        worksheet.Cells[rowIndex, 32].Style.Font.Size = 7;
                        worksheet.Cells[rowIndex, 32].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;

                        if (hdDetail.Ngay28.ToString() == "CN")
                        {
                            worksheet.Cells[rowIndex, 33].Style.Fill.PatternType = ExcelFillStyle.Solid; // 
                            worksheet.Cells[rowIndex, 33].Style.Fill.BackgroundColor.SetColor(colFromHex);
                        }
                        worksheet.Cells[rowIndex, 33].Value = !string.IsNullOrEmpty(hdDetail.Ngay28.ToString()) ? hdDetail.Ngay28.ToString() : "";
                        worksheet.Cells[rowIndex, 33].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowIndex, 33].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowIndex, 33].Style.Border.Top.Style = ExcelBorderStyle.Dotted;
                        worksheet.Cells[rowIndex, 33].Style.Border.Bottom.Style = ExcelBorderStyle.Dotted;
                        worksheet.Cells[rowIndex, 33].Style.Font.Size = 7;
                        worksheet.Cells[rowIndex, 33].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;

                        if (hdDetail.Ngay29.ToString() == "CN")
                        {
                            worksheet.Cells[rowIndex, 34].Style.Fill.PatternType = ExcelFillStyle.Solid; // 
                            worksheet.Cells[rowIndex, 34].Style.Fill.BackgroundColor.SetColor(colFromHex);
                        }
                        else if (hdDetail.Ngay29.ToString() == "KO")
                        {
                            worksheet.Cells[rowIndex, 34].Value = "";
                        }
                        else
                        {
                            worksheet.Cells[rowIndex, 34].Value = !string.IsNullOrEmpty(hdDetail.Ngay29.ToString()) ? hdDetail.Ngay29.ToString() : "";
                        }
                        worksheet.Cells[rowIndex, 34].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowIndex, 34].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowIndex, 34].Style.Border.Top.Style = ExcelBorderStyle.Dotted;
                        worksheet.Cells[rowIndex, 34].Style.Border.Bottom.Style = ExcelBorderStyle.Dotted;
                        worksheet.Cells[rowIndex, 34].Style.Font.Size = 7;
                        worksheet.Cells[rowIndex, 34].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;

                        if (hdDetail.Ngay30.ToString() == "CN")
                        {
                            worksheet.Cells[rowIndex, 35].Style.Fill.PatternType = ExcelFillStyle.Solid; // 
                            worksheet.Cells[rowIndex, 35].Style.Fill.BackgroundColor.SetColor(colFromHex);
                        }
                        else if (hdDetail.Ngay30.ToString() == "KO")
                        {
                            worksheet.Cells[rowIndex, 35].Value = "";
                        }
                        else
                        {
                            worksheet.Cells[rowIndex, 35].Value = !string.IsNullOrEmpty(hdDetail.Ngay30.ToString()) ? hdDetail.Ngay30.ToString() : "";
                        }
                        worksheet.Cells[rowIndex, 35].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowIndex, 35].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowIndex, 35].Style.Border.Top.Style = ExcelBorderStyle.Dotted;
                        worksheet.Cells[rowIndex, 35].Style.Border.Bottom.Style = ExcelBorderStyle.Dotted;
                        worksheet.Cells[rowIndex, 35].Style.Font.Size = 7;
                        worksheet.Cells[rowIndex, 35].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;

                        if (hdDetail.Ngay31.ToString() == "CN")
                        {
                            worksheet.Cells[rowIndex, 36].Style.Fill.PatternType = ExcelFillStyle.Solid; // 
                            worksheet.Cells[rowIndex, 36].Style.Fill.BackgroundColor.SetColor(colFromHex);
                        }
                        else if (hdDetail.Ngay31.ToString() == "KO")
                        {
                            worksheet.Cells[rowIndex, 36].Value = "";
                        }
                        else
                        {
                            worksheet.Cells[rowIndex, 36].Value = !string.IsNullOrEmpty(hdDetail.Ngay31.ToString()) ? hdDetail.Ngay31.ToString() : "";
                        }
                        worksheet.Cells[rowIndex, 36].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowIndex, 36].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowIndex, 36].Style.Border.Top.Style = ExcelBorderStyle.Dotted;
                        worksheet.Cells[rowIndex, 36].Style.Border.Bottom.Style = ExcelBorderStyle.Dotted;
                        worksheet.Cells[rowIndex, 36].Style.Font.Size = 7;
                        worksheet.Cells[rowIndex, 36].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;

                        worksheet.Cells[rowIndex, 37].Value = !string.IsNullOrEmpty(hdDetail.SoNgay.ToString()) ? Convert.ToInt32(hdDetail.SoNgay) : 0;
                        worksheet.Cells[rowIndex, 37].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowIndex, 37].Style.Border.Right.Style = ExcelBorderStyle.Medium;
                        worksheet.Cells[rowIndex, 37].Style.Border.Top.Style = ExcelBorderStyle.Dotted;
                        worksheet.Cells[rowIndex, 37].Style.Border.Bottom.Style = ExcelBorderStyle.Dotted;
                        worksheet.Cells[rowIndex, 37].Style.Font.Size = 7;
                        worksheet.Cells[rowIndex, 37].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;

                        //worksheet.Cells[rowIndex, 6].Value = hdDetail.NgayHetHan != null ? hdDetail.NgayHetHan.Date.ToString("dd/M/yyyy", CultureInfo.InvariantCulture) : "";
                        //worksheet.Cells[rowIndex, 5].Value = hdDetail.NgaySinh != null ? hdDetail.NgaySinh.Date.ToString("dd/M/yyyy", CultureInfo.InvariantCulture) : "";

                        rowIndex++;
                        count++;
                    }

                    package.SaveAs(file); //Save the workbook.    

                }
               
                return new OkObjectResult(url);
            }           
        }

        [HttpPost]
        public IActionResult ExportExcelBangLuong(int thangChamCong, int namChamCong, string luongDotInId, string makvChamCong, string madphongChamCong,
            string keywordChamCong, string dieukienChamCong)
        {
            string sWebRootFolder = _hostingEnvironment.WebRootPath;
            string sFileName = $"BangLuongThang.xlsx";
            // Template File
            string templateDocument = Path.Combine(sWebRootFolder, "templates", "BangLuongThang.xlsx");

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
                    ExcelWorksheet worksheet = package.Workbook.Worksheets["BangLuongThang"];

                    var khuvuc = !string.IsNullOrEmpty(makvChamCong) ? makvChamCong : "%";
                    var phong = !string.IsNullOrEmpty(madphongChamCong) ? madphongChamCong : "%";
                    var tukhoa = !string.IsNullOrEmpty(keywordChamCong) ? keywordChamCong : "%";

                    var hosoid = new Guid();
                    var suckhoeDetail = _luongbaohiemService.LuongBaoHiemGetList(1, namChamCong, thangChamCong, khuvuc, phong,
                        "", hosoid, "", "", "", luongDotInId, tukhoa, "GetListLuongBaoHiemKy");

                    int rowIndex = 12;
                    int count = 1;

                    if (khuvuc == "%")
                    {
                        worksheet.Cells[3, 2].Value = "";
                    }
                    else
                    {
                        var khuvucvm = _corporationsService.GetAllCorPaging(khuvuc, "", "", 1, 10, "", "", khuvuc, "GetCorporationId");
                        worksheet.Cells[3, 2].Value = khuvucvm.Result.Results[0].Name.ToString().ToUpper();

                        worksheet.Cells[3, 2].Style.Font.Size = 8;
                        worksheet.Cells[3, 2].Style.Font.Bold = true;
                        worksheet.Cells[3, 2].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                        worksheet.Cells[3, 2].Style.VerticalAlignment = ExcelVerticalAlignment.Center;
                    }

                    worksheet.Cells[6, 2].Value = "(Tháng " + thangChamCong.ToString() + "/" + namChamCong.ToString() + ")";
                    worksheet.Cells[6, 2].Style.Font.Size = 7;
                    worksheet.Cells[6, 2].Style.Font.Bold = true;
                    worksheet.Cells[6, 2].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center; // canh giua
                    worksheet.Cells[6, 2].Style.VerticalAlignment = ExcelVerticalAlignment.Center;

                    worksheet.InsertRow(12, suckhoeDetail.Result.Count());
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
                        worksheet.Cells[rowIndex, 2].Style.Font.Size = 9;
                        worksheet.Row(rowIndex).Height = 18;

                        worksheet.Cells[rowIndex, 3].Value = !string.IsNullOrEmpty(hdDetail.TenNhanVien) ? hdDetail.TenNhanVien.ToString() : "";
                        worksheet.Cells[rowIndex, 3].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowIndex, 3].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowIndex, 3].Style.Border.Top.Style = ExcelBorderStyle.Dotted;
                        worksheet.Cells[rowIndex, 3].Style.Border.Bottom.Style = ExcelBorderStyle.Dotted;
                        worksheet.Cells[rowIndex, 3].Style.Font.Size = 9;
                        worksheet.Row(rowIndex).Height = 18;

                        worksheet.Cells[rowIndex, 4].Value = !string.IsNullOrEmpty(hdDetail.TenPhong) ? hdDetail.TenPhong.ToString() : "";
                        worksheet.Cells[rowIndex, 4].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowIndex, 4].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowIndex, 4].Style.Border.Top.Style = ExcelBorderStyle.Dotted;
                        worksheet.Cells[rowIndex, 4].Style.Border.Bottom.Style = ExcelBorderStyle.Dotted;
                        worksheet.Cells[rowIndex, 4].Style.Font.Size = 9;
                        worksheet.Row(rowIndex).Height = 18;

                        worksheet.Cells[rowIndex, 5].Value = !string.IsNullOrEmpty(hdDetail.TenChucVu) ? hdDetail.TenChucVu.ToString() : "";
                        worksheet.Cells[rowIndex, 5].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowIndex, 5].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowIndex, 5].Style.Border.Top.Style = ExcelBorderStyle.Dotted;
                        worksheet.Cells[rowIndex, 5].Style.Border.Bottom.Style = ExcelBorderStyle.Dotted;
                        worksheet.Cells[rowIndex, 5].Style.Font.Size = 9;
                        worksheet.Row(rowIndex).Height = 18;
                        
                        
                        worksheet.Cells[rowIndex, 6].Value = !string.IsNullOrEmpty(hdDetail.HeSo.ToString()) ? hdDetail.HeSo.ToString() : "";
                        worksheet.Cells[rowIndex, 6].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowIndex, 6].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowIndex, 6].Style.Border.Top.Style = ExcelBorderStyle.Dotted;
                        worksheet.Cells[rowIndex, 6].Style.Border.Bottom.Style = ExcelBorderStyle.Dotted;
                        worksheet.Cells[rowIndex, 6].Style.Font.Size = 9;
                        worksheet.Cells[rowIndex, 6].Style.HorizontalAlignment = ExcelHorizontalAlignment.Right;

                        worksheet.Cells[rowIndex, 7].Value = !string.IsNullOrEmpty(hdDetail.SoNgay.ToString()) ? Math.Round(hdDetail.SoNgay, 1).ToString() : "";
                        worksheet.Cells[rowIndex, 7].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowIndex, 7].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowIndex, 7].Style.Border.Top.Style = ExcelBorderStyle.Dotted;
                        worksheet.Cells[rowIndex, 7].Style.Border.Bottom.Style = ExcelBorderStyle.Dotted;
                        worksheet.Cells[rowIndex, 7].Style.Font.Size = 9;
                        worksheet.Cells[rowIndex, 7].Style.HorizontalAlignment = ExcelHorizontalAlignment.Right;

                        worksheet.Cells[rowIndex, 8].Value = !string.IsNullOrEmpty(hdDetail.MucLuong.ToString()) ? Math.Round(hdDetail.MucLuong, 0).ToString() : "";
                        worksheet.Cells[rowIndex, 8].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowIndex, 8].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowIndex, 8].Style.Border.Top.Style = ExcelBorderStyle.Dotted;
                        worksheet.Cells[rowIndex, 8].Style.Border.Bottom.Style = ExcelBorderStyle.Dotted;
                        worksheet.Cells[rowIndex, 8].Style.Font.Size = 9;
                        worksheet.Cells[rowIndex, 8].Style.HorizontalAlignment = ExcelHorizontalAlignment.Right;

                        worksheet.Cells[rowIndex, 9].Value = !string.IsNullOrEmpty(hdDetail.TienBaoHiem.ToString()) ? Math.Round(hdDetail.TienBaoHiem, 0).ToString() : "";
                        worksheet.Cells[rowIndex, 9].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowIndex, 9].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowIndex, 9].Style.Border.Top.Style = ExcelBorderStyle.Dotted;
                        worksheet.Cells[rowIndex, 9].Style.Border.Bottom.Style = ExcelBorderStyle.Dotted;
                        worksheet.Cells[rowIndex, 9].Style.Font.Size = 9;
                        worksheet.Cells[rowIndex, 9].Style.HorizontalAlignment = ExcelHorizontalAlignment.Right;

                        worksheet.Cells[rowIndex, 10].Value = !string.IsNullOrEmpty(hdDetail.TienBHYT.ToString()) ? Math.Round(hdDetail.TienBHYT, 0).ToString() : "";
                        worksheet.Cells[rowIndex, 10].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowIndex, 10].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowIndex, 10].Style.Border.Top.Style = ExcelBorderStyle.Dotted;
                        worksheet.Cells[rowIndex, 10].Style.Border.Bottom.Style = ExcelBorderStyle.Dotted;
                        worksheet.Cells[rowIndex, 10].Style.Font.Size = 9;
                        worksheet.Cells[rowIndex, 10].Style.HorizontalAlignment = ExcelHorizontalAlignment.Right;

                        worksheet.Cells[rowIndex, 11].Value = !string.IsNullOrEmpty(hdDetail.TienBHTN.ToString()) ? Math.Round(hdDetail.TienBHTN, 0).ToString() : "";
                        worksheet.Cells[rowIndex, 11].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowIndex, 11].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowIndex, 11].Style.Border.Top.Style = ExcelBorderStyle.Dotted;
                        worksheet.Cells[rowIndex, 11].Style.Border.Bottom.Style = ExcelBorderStyle.Dotted;
                        worksheet.Cells[rowIndex, 11].Style.Font.Size = 9;
                        worksheet.Cells[rowIndex, 11].Style.HorizontalAlignment = ExcelHorizontalAlignment.Right;

                        worksheet.Cells[rowIndex, 12].Value = !string.IsNullOrEmpty(hdDetail.TienBHXH.ToString()) ? Math.Round(hdDetail.TienBHXH, 0).ToString() : "";
                        worksheet.Cells[rowIndex, 12].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowIndex, 12].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowIndex, 12].Style.Border.Top.Style = ExcelBorderStyle.Dotted;
                        worksheet.Cells[rowIndex, 12].Style.Border.Bottom.Style = ExcelBorderStyle.Dotted;
                        worksheet.Cells[rowIndex, 12].Style.Font.Size = 9;
                        worksheet.Cells[rowIndex, 12].Style.HorizontalAlignment = ExcelHorizontalAlignment.Right;

                        worksheet.Cells[rowIndex, 13].Value = !string.IsNullOrEmpty(hdDetail.TongTienBaoHiem.ToString()) ? Math.Round(hdDetail.TongTienBaoHiem, 0).ToString() : "";
                        worksheet.Cells[rowIndex, 13].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowIndex, 13].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowIndex, 13].Style.Border.Top.Style = ExcelBorderStyle.Dotted;
                        worksheet.Cells[rowIndex, 13].Style.Border.Bottom.Style = ExcelBorderStyle.Dotted;
                        worksheet.Cells[rowIndex, 13].Style.Font.Size = 9;
                        worksheet.Cells[rowIndex, 13].Style.HorizontalAlignment = ExcelHorizontalAlignment.Right;

                        worksheet.Cells[rowIndex, 14].Value = !string.IsNullOrEmpty(hdDetail.TongTienThucLinh.ToString()) ? Math.Round(hdDetail.TongTienThucLinh, 0).ToString() : "";
                        worksheet.Cells[rowIndex, 14].Style.Numberformat.Format = "0";
                        worksheet.Cells[rowIndex, 14].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowIndex, 14].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowIndex, 14].Style.Border.Top.Style = ExcelBorderStyle.Dotted;
                        worksheet.Cells[rowIndex, 14].Style.Border.Bottom.Style = ExcelBorderStyle.Dotted;
                        worksheet.Cells[rowIndex, 14].Style.Font.Size = 9;
                        worksheet.Cells[rowIndex, 14].Style.HorizontalAlignment = ExcelHorizontalAlignment.Right;

                        worksheet.Cells[rowIndex, 15].Value = "";
                        worksheet.Cells[rowIndex, 15].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowIndex, 15].Style.Border.Right.Style = ExcelBorderStyle.Medium;
                        worksheet.Cells[rowIndex, 15].Style.Border.Top.Style = ExcelBorderStyle.Dotted;
                        worksheet.Cells[rowIndex, 15].Style.Border.Bottom.Style = ExcelBorderStyle.Dotted;
                        worksheet.Cells[rowIndex, 15].Style.Font.Size = 9;
                        worksheet.Cells[rowIndex, 15].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;

                        //worksheet.Cells[rowIndex, 6].Value = hdDetail.NgayHetHan != null ? hdDetail.NgayHetHan.Date.ToString("dd/M/yyyy", CultureInfo.InvariantCulture) : "";
                        //worksheet.Cells[rowIndex, 5].Value = hdDetail.NgaySinh != null ? hdDetail.NgaySinh.Date.ToString("dd/M/yyyy", CultureInfo.InvariantCulture) : "";

                        rowIndex++;
                        count++;
                    }

                    package.SaveAs(file); //Save the workbook.    

                }

                return new OkObjectResult(url);
            }
        }

        #region Danh muc Hop dong nhan vien

        [HttpGet]
        public IActionResult LuongKyHieuGetList()
        {
            var model = _luongkyhieuService.LuongKyHieuGetList("LuongKyHieu", "", "", "KyHieuChamCongGetList");
            return new OkObjectResult(model);
        }

        [HttpGet]
        public IActionResult DieuKienGetList()
        {
            var model = _dieukientimService.DieuKienTimGetList("LuongBaoHiem", "", "", "BangDieuKienTimGetList");
            return new OkObjectResult(model);
        }

        [HttpGet]
        public IActionResult LuongDotInGetList(string makv)
        {
            var model = _luongdotinkyService.LuongDotInKyGetList(makv, "", "", "LuongDotInKyGetList");
            return new OkObjectResult(model);
        }

        #endregion

        #endregion



    }
}