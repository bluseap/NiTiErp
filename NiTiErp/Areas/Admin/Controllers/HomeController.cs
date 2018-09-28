using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using NiTiErp.Extensions;
using NiTiErp.Application.Dapper.Interfaces;
using System.Net;
using NiTiErp.Application.Dapper.ViewModels;

namespace NiTiErp.Areas.Admin.Controllers
{
 
    public class HomeController : BaseController
    {
        private readonly IReportService _reportService;

        private readonly IAppUserLoginService _appuserloginService;

        public HomeController(IReportService reportService, IAppUserLoginService appuserloginService)
        {
            _reportService = reportService;

            _appuserloginService = appuserloginService;
        }

        public IActionResult Index()
        {
            var email = User.GetSpecificClaim("Email");

            //CountUserLogin();

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

        public IActionResult CountUserLogin()
        {
            string ipString = HttpContext.Connection.RemoteIpAddress.ToString(); // LoginIpAddress

            IPHostEntry heserver = Dns.GetHostEntry(Dns.GetHostName());

            //var ip = heserver.AddressList[2].ToString();
            var nameComputer = heserver.HostName.ToString(); // LoginNameIp
            var localIp6 = heserver.AddressList[0].ToString();
            var temIp6 = heserver.AddressList[1].ToString();
            var ip6Address = heserver.AddressList[2].ToString();
            var ipComputer = heserver.AddressList[3].ToString(); // LoginIp


            var appuserloginVm =  new AppUserLoginViewModel();

            var username = User.GetSpecificClaim("UserName");

            appuserloginVm.UserName = username;

            appuserloginVm.LoginIpAddress = ipString;
            appuserloginVm.LoginIp = ipComputer;
            appuserloginVm.LoginNameIp = nameComputer;
            appuserloginVm.LoginIp6Address = ip6Address;
            appuserloginVm.LoginLocalIp6Adress = localIp6;
            appuserloginVm.LoginMacIp = temIp6;

            appuserloginVm.CreateDate = DateTime.Now;
            appuserloginVm.CreateBy = username;            
           
            var model = _appuserloginService.AppUserLoginAUD(appuserloginVm, "InAppUserLogin");

            return new OkObjectResult(model);
        }

        public IEnumerable<string> GetIpAddress()
        {
            var username = User.GetSpecificClaim("UserName");

            // As a string
            string ipString = HttpContext.Connection.RemoteIpAddress.ToString(); // LoginIpAddress

            // As the IpAddress object
            System.Net.IPAddress ipAddress = HttpContext.Connection.RemoteIpAddress;

            //var remoteIpAddress = request.HttpContext.Connection.RemoteIpAddress;

            IPHostEntry heserver = Dns.GetHostEntry(Dns.GetHostName());
            var ip = heserver.AddressList[2].ToString();

            var nameComputer = heserver.HostName.ToString(); // LoginNameIp

            var localIp6 = heserver.AddressList[0].ToString();
            var temIp6 = heserver.AddressList[1].ToString();
            var ip6Address = heserver.AddressList[2].ToString();
            var ipComputer = heserver.AddressList[3].ToString(); // LoginIp

            return new string[] { ip, "value2" };
        }


    }
}