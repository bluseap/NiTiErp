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
    public class DaoTaoController : BaseController
    {
        private readonly IHostingEnvironment _hostingEnvironment;
        private readonly NiTiErp.Application.Interfaces.IUserService _userService;
        private readonly IAuthorizationService _authorizationService;

        private readonly ICorporationService _corporationsService;
        private readonly IDaoTaoNhanVienService _daotaonhanvienService;
        private readonly IDaoTaoGiaoVienService _daotaogiaovienService;
        private readonly IDaoTaoNoiService _daotaonoiService;
        private readonly IDaoTaoLopService _daotaolopService;

        public DaoTaoController(IHostingEnvironment hostingEnvironment,
            NiTiErp.Application.Interfaces.IUserService userService,
            IAuthorizationService authorizationService,

            ICorporationService corporationsService,
            IDaoTaoNhanVienService daotaonhanvienService,
            IDaoTaoGiaoVienService daotaogiaovienService,
            IDaoTaoNoiService daotaonoiService,
            IDaoTaoLopService daotaolopService
            )
        {
            _hostingEnvironment = hostingEnvironment;
            _userService = userService;
            _authorizationService = authorizationService;

            _corporationsService = corporationsService;
            _daotaonhanvienService = daotaonhanvienService;
            _daotaogiaovienService = daotaogiaovienService;
            _daotaonoiService = daotaonoiService;
            _daotaolopService = daotaolopService;
        }

        public IActionResult Index()
        {
            return View();
        }

        #region AJAX API

        public IActionResult AddUpdateDaoTao(DaoTaoLopViewModel daotaoVm)
        {
            if (!ModelState.IsValid)
            {
                IEnumerable<ModelError> allErrors = ModelState.Values.SelectMany(v => v.Errors);
                return new BadRequestObjectResult(allErrors);
            }
            else
            {
                var username = User.GetSpecificClaim("UserName");

                daotaoVm.CreateBy = username;
                daotaoVm.CreateDate = DateTime.Now;
                daotaoVm.UpdateBy = username;
                daotaoVm.UpdateDate = DateTime.Now;

                if (daotaoVm.InsUpDaoTaoLopId == 1)
                {
                    var result = _authorizationService.AuthorizeAsync(User, "DAOTAONHAP", Operations.Create); // nhap dao tao
                    if (result.Result.Succeeded == false)
                    {
                        return new ObjectResult(new GenericResult(false, "Bạn không đủ quyền thêm mới."));
                    }

                    daotaoVm.Id = Guid.NewGuid();

                    var daotao = _daotaolopService.DaoTaoLopAUD(daotaoVm, "InDaoTaoLop");

                    if (daotaoVm.DaoTaoGiaoVienList != null)
                        SaveDaoTaoGiaoVien(daotaoVm.DaoTaoNoiId, daotaoVm.DaoTaoGiaoVienList, daotaoVm.Id);
                    
                    return new OkObjectResult(daotao);
                }
                else
                {
                    var result = _authorizationService.AuthorizeAsync(User, "DAOTAONHAP", Operations.Update); // dao tao
                    if (result.Result.Succeeded == false)
                    {
                        return new ObjectResult(new GenericResult(false, "Bạn không đủ quyền sửa."));
                    }

                    var daotaonoi = _daotaolopService.DaoTaoLopAUD(daotaoVm, "UpDaoTaoLop");

                    if (daotaoVm.DaoTaoGiaoVienList != null)
                        UpdateDaoTaoGiaoVien(daotaoVm.DaoTaoNoiId, daotaoVm.DaoTaoGiaoVienList, daotaoVm.Id);

                    return new OkObjectResult(daotaonoi);
                }
            }
        }

        [HttpGet]
        public IActionResult GetListDaoTao(string daotaonoiId, string keyword, int page, int pageSize)
        {
            var guid = new Guid();

            var tukhoa = !string.IsNullOrEmpty(keyword) ? keyword : "%";

            var model = _daotaolopService.GetAllDaoTaoLopPaging(1, daotaonoiId, "", tukhoa, page, pageSize, guid, "", "GetListDaoTaoLop");

            return new OkObjectResult(model);
        }

        [HttpGet]
        public IActionResult GetDaoTaoId(Guid daotaolopId)
        {
            var model = _daotaolopService.GetAllDaoTaoLopPaging(1, "", "", "", 1, 1, daotaolopId, "", "GetDaoTaoLopId");

            return new OkObjectResult(model);
        }

        [HttpGet]
        public IActionResult GetNewGuid()
        {
            var newguid = Guid.NewGuid();

            return new OkObjectResult(newguid);
        }

        [HttpPost]
        public IActionResult DeleteDaoTao(DaoTaoLopViewModel daotaoVm)
        {
            if (!ModelState.IsValid)
            {
                IEnumerable<ModelError> allErrors = ModelState.Values.SelectMany(v => v.Errors);
                return new BadRequestObjectResult(allErrors);
            }
            else
            {
                if (daotaoVm.InsUpDaoTaoLopId == 3)
                {
                    var result = _authorizationService.AuthorizeAsync(User, "DAOTAONHAP", Operations.Delete); // xoa truong dao tao
                    if (result.Result.Succeeded == false)
                    {
                        return new ObjectResult(new GenericResult(false, "Bạn không đủ quyền xóa."));
                    }

                    daotaoVm.CreateDate = DateTime.Now;
                    daotaoVm.UpdateDate = DateTime.Now;

                    var daotao = _daotaolopService.DaoTaoLopAUD(daotaoVm, "DelDaoTaoLop");

                    return new OkObjectResult(daotao);
                }
                else
                {
                    return new OkObjectResult(daotaoVm);
                }
            }
        }

        [HttpPost]
        public IActionResult DeleteDaoTaoGiaoVien(DaoTaoGiaoVienViewModel daotaogiaovienVm)
        {
            if (!ModelState.IsValid)
            {
                IEnumerable<ModelError> allErrors = ModelState.Values.SelectMany(v => v.Errors);
                return new BadRequestObjectResult(allErrors);
            }
            else
            {                
                var result = _authorizationService.AuthorizeAsync(User, "DAOTAONHAP", Operations.Delete); // xoa truong dao tao
                if (result.Result.Succeeded == false)
                {
                    return new ObjectResult(new GenericResult(false, "Bạn không đủ quyền xóa."));
                }

                daotaogiaovienVm.CreateDate = DateTime.Now;
                daotaogiaovienVm.UpdateDate = DateTime.Now;

                var daotaogiaovien = _daotaogiaovienService.DaoTaoGiaoVienAUD(daotaogiaovienVm, "DelDaoTaoLopGiaoVien");

                return new OkObjectResult(daotaogiaovien);                
            }
        }

        [HttpPost]
        public IActionResult SaveDaoTaoGiaoVien(int DaoTaoNoiId, List<DaoTaoGiaoVienViewModel> daotaogiaovienList, Guid daotaoId )
        {
            AddDaoTaoGiaoVien(DaoTaoNoiId, daotaogiaovienList, daotaoId);          
            return new OkObjectResult(daotaogiaovienList);
        }

        public void AddDaoTaoGiaoVien(int DaoTaoNoiId, List<DaoTaoGiaoVienViewModel> daotaogiaovienList, Guid daotaoId)
        {
            var username = User.GetSpecificClaim("UserName");

            foreach (var giaovienlist in daotaogiaovienList)
            {
                giaovienlist.Id = Guid.NewGuid();
                giaovienlist.DaoTaoId = daotaoId;
                giaovienlist.DaoTaoNoiId = DaoTaoNoiId;

                giaovienlist.CreateBy = username;
                giaovienlist.CreateDate = DateTime.Now;
                giaovienlist.UpdateBy = username;
                giaovienlist.UpdateDate = DateTime.Now;

                var daotaogiaovien = _daotaogiaovienService.DaoTaoGiaoVienAUD(giaovienlist, "InDaoTaoGiaoVien");               
            }
        }

        [HttpGet]
        public IActionResult SaveDaoTaoNhanVien(DaoTaoNhanVienViewModel daotaonhanvienVm)
        {
            if (!ModelState.IsValid)
            {
                IEnumerable<ModelError> allErrors = ModelState.Values.SelectMany(v => v.Errors);
                return new BadRequestObjectResult(allErrors);
            }
            else
            {
                var username = User.GetSpecificClaim("UserName");

                //daotaonhanvienVm.CreateBy = username;
                //daotaonhanvienVm.CreateDate = DateTime.Now;
                //daotaonhanvienVm.UpdateBy = username;
                //daotaonhanvienVm.UpdateDate = DateTime.Now;

                var result = _authorizationService.AuthorizeAsync(User, "DAOTAONHAP", Operations.Create); // nhap dao tao
                if (result.Result.Succeeded == false)
                {
                    return new ObjectResult(new GenericResult(false, "Bạn không đủ quyền thêm mới."));
                }

                daotaonhanvienVm.Id = Guid.NewGuid();

                //daotaonhanvienVm.Ten = "";
                //daotaonhanvienVm.Hinh = "";               

                try
                {
                    var daotaonhanvien = _daotaonhanvienService.DaoTaoNhanVienListAUD(daotaonhanvienVm.Id, daotaonhanvienVm.HoSoNhanVienId,
                        daotaonhanvienVm.DaoTaoLopId, username, "InDaoTaoNhanVien");
                    
                    return new OkObjectResult(daotaonhanvien);                   
                }
                catch (Exception ex)
                {
                    throw ex;
                }

            }
        }

        [HttpGet]
        public IActionResult GetDaoTaoNhanVienLopId(Guid daotaoId, string keyword, int page, int pageSize)
        {
            var keyword2 = !string.IsNullOrEmpty(keyword) ? keyword : "%";

            var moimoi = Guid.NewGuid();

            var model = _daotaonhanvienService.GetAllDaoTaoNhanVienPaging(moimoi, moimoi, daotaoId,
                "", "", moimoi, keyword2, page, pageSize, "GetListDaoTaoNhanVienLop");

            return new OkObjectResult(model);
        }

        [HttpPost]
        public IActionResult DeleteDaoTaoNhanVien(DaoTaoNhanVienViewModel daotaonhanvienVm)
        {
            if (!ModelState.IsValid)
            {
                IEnumerable<ModelError> allErrors = ModelState.Values.SelectMany(v => v.Errors);
                return new BadRequestObjectResult(allErrors);
            }
            else
            {
                var result = _authorizationService.AuthorizeAsync(User, "DAOTAONHAP", Operations.Delete); // xoa truong dao tao
                if (result.Result.Succeeded == false)
                {
                    return new ObjectResult(new GenericResult(false, "Bạn không đủ quyền xóa."));
                }

                daotaonhanvienVm.CreateDate = DateTime.Now;
                daotaonhanvienVm.UpdateDate = DateTime.Now;

                var daotaonhanvien = _daotaonhanvienService.DaoTaoNhanVienAUD(daotaonhanvienVm, "DelDaoTaoNhanVien");

                return new OkObjectResult(daotaonhanvien);
            }
        }

        [HttpPost]
        public IActionResult UpdateDaoTaoGiaoVien(int DaoTaoNoiId, List<DaoTaoGiaoVienViewModel> daotaogiaovienList, Guid daotaoId)
        {
            UpdateAddDaoTaoGiaoVien(DaoTaoNoiId, daotaogiaovienList, daotaoId);
            return new OkObjectResult(daotaogiaovienList);
        }

        public void UpdateAddDaoTaoGiaoVien(int DaoTaoNoiId, List<DaoTaoGiaoVienViewModel> daotaogiaovienList, Guid daotaoId)
        {
            var username = User.GetSpecificClaim("UserName");

            foreach (var giaovienlist in daotaogiaovienList)
            {
                if (giaovienlist.Id.ToString() == "00000000-0000-0000-0000-000000000000")
                {
                    giaovienlist.Id = Guid.NewGuid();
                    giaovienlist.DaoTaoId = daotaoId;
                    giaovienlist.DaoTaoNoiId = DaoTaoNoiId;

                    giaovienlist.CreateBy = username;
                    giaovienlist.CreateDate = DateTime.Now;
                    giaovienlist.UpdateBy = username;
                    giaovienlist.UpdateDate = DateTime.Now;

                    var daotaogiaovien = _daotaogiaovienService.DaoTaoGiaoVienAUD(giaovienlist, "InDaoTaoGiaoVien");
                }
                else
                {
                    giaovienlist.DaoTaoId = daotaoId;
                    giaovienlist.DaoTaoNoiId = DaoTaoNoiId;

                    giaovienlist.CreateBy = username;
                    giaovienlist.CreateDate = DateTime.Now;
                    giaovienlist.UpdateBy = username;
                    giaovienlist.UpdateDate = DateTime.Now;

                    var daotaogiaovien = _daotaogiaovienService.DaoTaoGiaoVienAUD(giaovienlist, "InDaoTaoGiaoVien");
                }
            }
        }

        [HttpGet]
        public IActionResult GetDaoTaoGiaoVienLopId(Guid daotaoId)
        {
            var moimoi = Guid.NewGuid();

            var model = _daotaogiaovienService.DaoTaoGiaoVienGetList(1, "", "", "", 1, 1000, moimoi, daotaoId, "GetDaoTaoGiaoVienLop");

            return new OkObjectResult(model);
        }

        [HttpGet]
        public IActionResult GetDaoTaoGiaoVienId(Guid daotaogiaovienId)
        {
            var model = _daotaogiaovienService.GetAllDaoTaoGiaoVienPaging(1, "", "", "", 1, 1000, daotaogiaovienId, daotaogiaovienId, "GetDaoTaoGiaoVienId");

            return new OkObjectResult(model);
        }

        [HttpPost]
        public IActionResult ExportExcelDaoTaoNhanVien(Guid daotaolopId, Guid hosoId, Guid daotaonoiId, string corporationId, string phongId, string chucvuId, string keyword, string dieukienkhac)
        {
            if (dieukienkhac == "1")
            {
                string sWebRootFolder = _hostingEnvironment.WebRootPath;
                string sFileName = $"DaoTaoNhanVien.xlsx";
                // Template File
                string templateDocument = Path.Combine(sWebRootFolder, "templates", "DaoTaoNhanVien.xlsx");

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
                        ExcelWorksheet worksheet = package.Workbook.Worksheets["DaoTaoNhanVien"];

                        var khuvuc = !string.IsNullOrEmpty(corporationId) ? corporationId : "%";
                        var phong = !string.IsNullOrEmpty(phongId) ? phongId : "%";
                        var chucvu = !string.IsNullOrEmpty(chucvuId) ? chucvuId : "%";
                        var tukhoa = !string.IsNullOrEmpty(keyword) ? keyword : "%";

                        var daotaonhanvienlopDetail = _daotaonhanvienService.DaoTaoNhanVienGetList(daotaolopId, hosoId, daotaolopId,
                                corporationId, phongId, daotaolopId, keyword, 1, 1000, "GetListDaoTaoNhanVienLop");

                        int rowIndex = 11;
                        int count = 1;

                        if (khuvuc == "%")
                        {
                            worksheet.Cells[2, 3].Value = "";
                        }
                        else
                        {
                            var khuvucvm = _corporationsService.GetAllCorPaging(khuvuc, "", "", 1, 10, "", "", khuvuc, "GetCorporationId");

                            //worksheet.Cells[2, 3].Value = khuvucvm.Result.Results[0].Name.ToString().ToUpper();
                        }

                        var daotaolop = _daotaolopService.DaoTaoLopGetList(1, "", "", "", 1, 1, daotaolopId, "", "GetDaoTaoLopId");

                        worksheet.Cells[5, 4].Value = !string.IsNullOrEmpty(daotaolop.Result[0].TenTruong) ? daotaolop.Result[0].TenTruong.ToString() : "";
                        worksheet.Cells[6, 4].Value = !string.IsNullOrEmpty(daotaolop.Result[0].NoiHoc) ? daotaolop.Result[0].NoiHoc.ToString() : "";
                        worksheet.Cells[7, 4].Value = !string.IsNullOrEmpty(daotaolop.Result[0].ChuyenMon) ? daotaolop.Result[0].ChuyenMon.ToString() : "";

                        worksheet.InsertRow(11, daotaonhanvienlopDetail.Result.Count());

                        foreach (var dtlnvDetail in daotaonhanvienlopDetail.Result)
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

                            worksheet.Cells[rowIndex, 3].Value = !string.IsNullOrEmpty(dtlnvDetail.TenNhanVien) ? dtlnvDetail.TenNhanVien.ToString() : "";
                            worksheet.Cells[rowIndex, 3].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                            worksheet.Cells[rowIndex, 3].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                            worksheet.Cells[rowIndex, 3].Style.Border.Top.Style = ExcelBorderStyle.Dotted;
                            worksheet.Cells[rowIndex, 3].Style.Border.Bottom.Style = ExcelBorderStyle.Dotted;

                            worksheet.Cells[rowIndex, 4].Value = !string.IsNullOrEmpty(dtlnvDetail.NgaySinh.ToString()) ? dtlnvDetail.NgaySinh.Year.ToString() : "";
                            worksheet.Cells[rowIndex, 4].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                            worksheet.Cells[rowIndex, 4].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                            worksheet.Cells[rowIndex, 4].Style.Border.Top.Style = ExcelBorderStyle.Dotted;
                            worksheet.Cells[rowIndex, 4].Style.Border.Bottom.Style = ExcelBorderStyle.Dotted;

                            worksheet.Cells[rowIndex, 5].Value = !string.IsNullOrEmpty(dtlnvDetail.GioiTinh) ? dtlnvDetail.GioiTinh == "1" ? "Nam" : "Nữ" : "";                            
                            worksheet.Cells[rowIndex, 5].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                            worksheet.Cells[rowIndex, 5].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                            worksheet.Cells[rowIndex, 5].Style.Border.Top.Style = ExcelBorderStyle.Dotted;
                            worksheet.Cells[rowIndex, 5].Style.Border.Bottom.Style = ExcelBorderStyle.Dotted;

                            worksheet.Cells[rowIndex, 6].Value = !string.IsNullOrEmpty(dtlnvDetail.TenKhuVuc) ? dtlnvDetail.TenKhuVuc.ToString() : "";
                            worksheet.Cells[rowIndex, 6].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                            worksheet.Cells[rowIndex, 6].Style.Border.Top.Style = ExcelBorderStyle.Dotted;
                            worksheet.Cells[rowIndex, 6].Style.Border.Bottom.Style = ExcelBorderStyle.Dotted;

                            worksheet.Cells[rowIndex, 7].Value = !string.IsNullOrEmpty(dtlnvDetail.TenPhong) ? dtlnvDetail.TenPhong.ToString() : "";
                            worksheet.Cells[rowIndex, 7].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                            worksheet.Cells[rowIndex, 7].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                            worksheet.Cells[rowIndex, 7].Style.Border.Top.Style = ExcelBorderStyle.Dotted;
                            worksheet.Cells[rowIndex, 7].Style.Border.Bottom.Style = ExcelBorderStyle.Dotted;

                            worksheet.Cells[rowIndex, 8].Value = !string.IsNullOrEmpty(dtlnvDetail.TenChucVu) ? dtlnvDetail.TenChucVu.ToString() : "";
                            worksheet.Cells[rowIndex, 8].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                            worksheet.Cells[rowIndex, 8].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                            worksheet.Cells[rowIndex, 8].Style.Border.Top.Style = ExcelBorderStyle.Dotted;
                            worksheet.Cells[rowIndex, 8].Style.Border.Bottom.Style = ExcelBorderStyle.Dotted;                            

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
                return new OkObjectResult(daotaonoiId);
            }
        }

        #endregion

    }
}