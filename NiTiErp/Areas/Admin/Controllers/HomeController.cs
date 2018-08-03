using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using NiTiErp.Extensions;
using NiTiErp.Application.Dapper.Interfaces;

namespace NiTiErp.Areas.Admin.Controllers
{
 
    public class HomeController : BaseController
    {
        private readonly IReportService _reportService;

        public HomeController(IReportService reportService)
        {
            _reportService = reportService;
        }

        public IActionResult Index()
        {
            var email = User.GetSpecificClaim("Email");

            return View();
        }

        public async Task<IActionResult> GetRevenue(string fromDate, string toDate)
        {
            return new OkObjectResult(await _reportService.GetReportAsync(fromDate, toDate));
        }

        public async Task<IActionResult> TKSLNhanVien(string corporationId, string phongId, string chucvuId, string trinhdoId   )
        {
            return new OkObjectResult(await _reportService.SumHoSoNhanVienPara(corporationId, phongId, chucvuId, trinhdoId,
                "", "", "", "", "", "TKNhanVienKhuVuc"));
        }

        public async Task<IActionResult> TKSLChucVu(string corporationId, string phongId, string chucvuId, string trinhdoId)
        {
            return new OkObjectResult(await _reportService.SumHoSoNhanVienPara(corporationId, phongId, chucvuId, trinhdoId,
                "", "", "", "", "", "TKChucVuKhuVuc"));
        }

    }
}