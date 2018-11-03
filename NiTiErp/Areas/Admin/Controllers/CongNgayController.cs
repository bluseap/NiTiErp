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
                    }

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

                        //worksheet.Cells[rowIndex, 3].Value = !string.IsNullOrEmpty(hdDetail.Ten) ? hdDetail.Ten.ToString() : "";
                        //worksheet.Cells[rowIndex, 3].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                        //worksheet.Cells[rowIndex, 3].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                        //worksheet.Cells[rowIndex, 3].Style.Border.Top.Style = ExcelBorderStyle.Dotted;
                        //worksheet.Cells[rowIndex, 3].Style.Border.Bottom.Style = ExcelBorderStyle.Dotted;

                        //worksheet.Cells[rowIndex, 4].Value = !string.IsNullOrEmpty(hdDetail.TenKhuVuc) ? hdDetail.TenKhuVuc.ToString() : "";
                        //worksheet.Cells[rowIndex, 4].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                        //worksheet.Cells[rowIndex, 4].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                        //worksheet.Cells[rowIndex, 4].Style.Border.Top.Style = ExcelBorderStyle.Dotted;
                        //worksheet.Cells[rowIndex, 4].Style.Border.Bottom.Style = ExcelBorderStyle.Dotted;

                        //worksheet.Cells[rowIndex, 5].Value = !string.IsNullOrEmpty(hdDetail.TenPhong) ? hdDetail.TenPhong.ToString() : "";
                        //worksheet.Cells[rowIndex, 5].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                        //worksheet.Cells[rowIndex, 5].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                        //worksheet.Cells[rowIndex, 5].Style.Border.Top.Style = ExcelBorderStyle.Dotted;
                        //worksheet.Cells[rowIndex, 5].Style.Border.Bottom.Style = ExcelBorderStyle.Dotted;

                        Color colFromHex = System.Drawing.ColorTranslator.FromHtml("#DDDDDD");
                        if (hdDetail.Ngay01.ToString() == "X")
                        {
                            worksheet.Cells[rowIndex, 6].Style.Fill.PatternType = ExcelFillStyle.Solid;
                            worksheet.Cells[rowIndex, 6].Style.Fill.BackgroundColor.SetColor(colFromHex);
                        }
                        worksheet.Cells[rowIndex, 6].Value = !string.IsNullOrEmpty(hdDetail.Ngay01.ToString()) ? hdDetail.Ngay01.ToString() : "";
                        worksheet.Cells[rowIndex, 6].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowIndex, 6].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                        worksheet.Cells[rowIndex, 6].Style.Border.Top.Style = ExcelBorderStyle.Dotted;
                        worksheet.Cells[rowIndex, 6].Style.Border.Bottom.Style = ExcelBorderStyle.Dotted;
                        worksheet.Cells[rowIndex, 6].Style.Font.Size = 7;
                        worksheet.Cells[rowIndex, 6].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;

                        //worksheet.Cells[rowIndex, 7].Value = !string.IsNullOrEmpty(hdDetail.GioiTinh) ? hdDetail.GioiTinh == "1" ? "Nam" : "Nữ" : ""; worksheet.Cells[rowIndex, 3].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                        //worksheet.Cells[rowIndex, 7].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                        //worksheet.Cells[rowIndex, 7].Style.Border.Top.Style = ExcelBorderStyle.Dotted;
                        //worksheet.Cells[rowIndex, 7].Style.Border.Bottom.Style = ExcelBorderStyle.Dotted;

                        //worksheet.Cells[rowIndex, 8].Value = !string.IsNullOrEmpty(hdDetail.CanNang.ToString()) ? hdDetail.CanNang.ToString() : "";
                        //worksheet.Cells[rowIndex, 8].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                        //worksheet.Cells[rowIndex, 8].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                        //worksheet.Cells[rowIndex, 8].Style.Border.Top.Style = ExcelBorderStyle.Dotted;
                        //worksheet.Cells[rowIndex, 8].Style.Border.Bottom.Style = ExcelBorderStyle.Dotted;

                        //worksheet.Cells[rowIndex, 9].Value = !string.IsNullOrEmpty(hdDetail.ChieuCao.ToString()) ? hdDetail.ChieuCao.ToString() : "";
                        //worksheet.Cells[rowIndex, 9].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                        //worksheet.Cells[rowIndex, 9].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                        //worksheet.Cells[rowIndex, 9].Style.Border.Top.Style = ExcelBorderStyle.Dotted;
                        //worksheet.Cells[rowIndex, 9].Style.Border.Bottom.Style = ExcelBorderStyle.Dotted;

                        //worksheet.Cells[rowIndex, 10].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                        //worksheet.Cells[rowIndex, 10].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                        //worksheet.Cells[rowIndex, 10].Style.Border.Top.Style = ExcelBorderStyle.Dotted;
                        //worksheet.Cells[rowIndex, 10].Style.Border.Bottom.Style = ExcelBorderStyle.Dotted;

                        //worksheet.Cells[rowIndex, 11].Value = !string.IsNullOrEmpty(hdDetail.Mat) ? hdDetail.Mat.ToString() : "";
                        //worksheet.Cells[rowIndex, 11].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                        //worksheet.Cells[rowIndex, 11].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                        //worksheet.Cells[rowIndex, 11].Style.Border.Top.Style = ExcelBorderStyle.Dotted;
                        //worksheet.Cells[rowIndex, 11].Style.Border.Bottom.Style = ExcelBorderStyle.Dotted;

                        //worksheet.Cells[rowIndex, 12].Value = !string.IsNullOrEmpty(hdDetail.TaiMuiHong) ? hdDetail.TaiMuiHong.ToString() : "";
                        //worksheet.Cells[rowIndex, 12].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                        //worksheet.Cells[rowIndex, 12].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                        //worksheet.Cells[rowIndex, 12].Style.Border.Top.Style = ExcelBorderStyle.Dotted;
                        //worksheet.Cells[rowIndex, 12].Style.Border.Bottom.Style = ExcelBorderStyle.Dotted;

                        //worksheet.Cells[rowIndex, 13].Value = !string.IsNullOrEmpty(hdDetail.RangHamMat) ? hdDetail.RangHamMat.ToString() : "";
                        //worksheet.Cells[rowIndex, 13].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                        //worksheet.Cells[rowIndex, 13].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                        //worksheet.Cells[rowIndex, 13].Style.Border.Top.Style = ExcelBorderStyle.Dotted;
                        //worksheet.Cells[rowIndex, 13].Style.Border.Bottom.Style = ExcelBorderStyle.Dotted;

                        //worksheet.Cells[rowIndex, 14].Value = !string.IsNullOrEmpty(hdDetail.SieuAmVungBung) ? hdDetail.SieuAmVungBung.ToString() : "";
                        //worksheet.Cells[rowIndex, 14].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                        //worksheet.Cells[rowIndex, 14].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                        //worksheet.Cells[rowIndex, 14].Style.Border.Top.Style = ExcelBorderStyle.Dotted;
                        //worksheet.Cells[rowIndex, 14].Style.Border.Bottom.Style = ExcelBorderStyle.Dotted;

                        //worksheet.Cells[rowIndex, 15].Value = !string.IsNullOrEmpty(hdDetail.XQTimPhoi) ? hdDetail.XQTimPhoi.ToString() : "";
                        //worksheet.Cells[rowIndex, 15].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                        //worksheet.Cells[rowIndex, 15].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                        //worksheet.Cells[rowIndex, 15].Style.Border.Top.Style = ExcelBorderStyle.Dotted;
                        //worksheet.Cells[rowIndex, 15].Style.Border.Bottom.Style = ExcelBorderStyle.Dotted;

                        //worksheet.Cells[rowIndex, 16].Value = !string.IsNullOrEmpty(hdDetail.DoDienTim) ? hdDetail.DoDienTim.ToString() : "";
                        //worksheet.Cells[rowIndex, 16].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                        //worksheet.Cells[rowIndex, 16].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                        //worksheet.Cells[rowIndex, 16].Style.Border.Top.Style = ExcelBorderStyle.Dotted;
                        //worksheet.Cells[rowIndex, 16].Style.Border.Bottom.Style = ExcelBorderStyle.Dotted;

                        //worksheet.Cells[rowIndex, 17].Value = !string.IsNullOrEmpty(hdDetail.PhuKhoa) ? hdDetail.PhuKhoa.ToString() : "";
                        //worksheet.Cells[rowIndex, 17].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                        //worksheet.Cells[rowIndex, 17].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                        //worksheet.Cells[rowIndex, 17].Style.Border.Top.Style = ExcelBorderStyle.Dotted;
                        //worksheet.Cells[rowIndex, 17].Style.Border.Bottom.Style = ExcelBorderStyle.Dotted;

                        //worksheet.Cells[rowIndex, 18].Value = !string.IsNullOrEmpty(hdDetail.PhetTBAmDao) ? hdDetail.PhetTBAmDao.ToString() : "";
                        //worksheet.Cells[rowIndex, 18].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                        //worksheet.Cells[rowIndex, 18].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                        //worksheet.Cells[rowIndex, 18].Style.Border.Top.Style = ExcelBorderStyle.Dotted;
                        //worksheet.Cells[rowIndex, 18].Style.Border.Bottom.Style = ExcelBorderStyle.Dotted;

                        //worksheet.Cells[rowIndex, 19].Value = !string.IsNullOrEmpty(hdDetail.CongThucMau) ? hdDetail.CongThucMau.ToString() : "";
                        //worksheet.Cells[rowIndex, 19].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                        //worksheet.Cells[rowIndex, 19].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                        //worksheet.Cells[rowIndex, 19].Style.Border.Top.Style = ExcelBorderStyle.Dotted;
                        //worksheet.Cells[rowIndex, 19].Style.Border.Bottom.Style = ExcelBorderStyle.Dotted;

                        //worksheet.Cells[rowIndex, 20].Value = !string.IsNullOrEmpty(hdDetail.TPTNT) ? hdDetail.TPTNT.ToString() : "";
                        //worksheet.Cells[rowIndex, 20].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                        //worksheet.Cells[rowIndex, 20].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                        //worksheet.Cells[rowIndex, 20].Style.Border.Top.Style = ExcelBorderStyle.Dotted;
                        //worksheet.Cells[rowIndex, 20].Style.Border.Bottom.Style = ExcelBorderStyle.Dotted;

                        //worksheet.Cells[rowIndex, 21].Value = !string.IsNullOrEmpty(hdDetail.GlucoDuong) ? hdDetail.GlucoDuong.ToString() : "";
                        //worksheet.Cells[rowIndex, 21].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                        //worksheet.Cells[rowIndex, 21].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                        //worksheet.Cells[rowIndex, 21].Style.Border.Top.Style = ExcelBorderStyle.Dotted;
                        //worksheet.Cells[rowIndex, 21].Style.Border.Bottom.Style = ExcelBorderStyle.Dotted;

                        //worksheet.Cells[rowIndex, 22].Value = !string.IsNullOrEmpty(hdDetail.NhomMau) ? hdDetail.NhomMau.ToString() : "";
                        //worksheet.Cells[rowIndex, 22].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                        //worksheet.Cells[rowIndex, 22].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                        //worksheet.Cells[rowIndex, 22].Style.Border.Top.Style = ExcelBorderStyle.Dotted;
                        //worksheet.Cells[rowIndex, 22].Style.Border.Bottom.Style = ExcelBorderStyle.Dotted;

                        //worksheet.Cells[rowIndex, 23].Value = !string.IsNullOrEmpty(hdDetail.PhanLoaiSucKhoe) ? hdDetail.PhanLoaiSucKhoe.ToString() : "";
                        //worksheet.Cells[rowIndex, 23].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                        //worksheet.Cells[rowIndex, 23].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                        //worksheet.Cells[rowIndex, 23].Style.Border.Top.Style = ExcelBorderStyle.Dotted;
                        //worksheet.Cells[rowIndex, 23].Style.Border.Bottom.Style = ExcelBorderStyle.Dotted;

                        //worksheet.Cells[rowIndex, 24].Value = !string.IsNullOrEmpty(hdDetail.HuongDieuTri) ? hdDetail.HuongDieuTri.ToString() : "";
                        //worksheet.Cells[rowIndex, 24].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                        //worksheet.Cells[rowIndex, 24].Style.Border.Right.Style = ExcelBorderStyle.Medium;
                        //worksheet.Cells[rowIndex, 24].Style.Border.Top.Style = ExcelBorderStyle.Dotted;
                        //worksheet.Cells[rowIndex, 24].Style.Border.Bottom.Style = ExcelBorderStyle.Dotted;

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