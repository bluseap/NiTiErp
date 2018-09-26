using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using NiTiErp.Extensions;
using NiTiErp.Application.Dapper.Interfaces;
using System.Net;

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

            GetIpAddress();

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

        public IEnumerable<string> GetIpAddress()
        {
            // As a string
            string ipString = HttpContext.Connection.RemoteIpAddress.ToString();

            // As the IpAddress object
            System.Net.IPAddress ipAddress = HttpContext.Connection.RemoteIpAddress;

            //var remoteIpAddress = request.HttpContext.Connection.RemoteIpAddress;

            IPHostEntry heserver = Dns.GetHostEntry(Dns.GetHostName());
            var ip = heserver.AddressList[2].ToString();
            return new string[] { ip, "value2" };
        }

    }
}