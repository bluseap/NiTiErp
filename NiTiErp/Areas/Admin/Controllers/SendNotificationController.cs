using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using NiTiErp.Application.Dapper.Interfaces;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;

using RestSharp;
using RestSharp.Authenticators;

namespace NiTiErp.Areas.Admin.Controllers
{
    public class SendNotificationController : BaseController
    {
        private readonly IHostingEnvironment _hostingEnvironment;
        private readonly NiTiErp.Application.Interfaces.IUserService _userService;
        private readonly IAuthorizationService _authorizationService;

        private readonly IRegisterDocService _registerdocService;

        public SendNotificationController(IHostingEnvironment hostingEnvironment,
            NiTiErp.Application.Interfaces.IUserService userService,
            IAuthorizationService authorizationService,

            IRegisterDocService registerdocService
            )
        {
            _hostingEnvironment = hostingEnvironment;
            _userService = userService;
            _authorizationService = authorizationService;

            _registerdocService = registerdocService;
        }

        public IActionResult Index()
        {
            return View();
        }
        

        [HttpGet]
        public IActionResult SendNotifiToAndroid(string body, string title, string firebasenotifiid)
        {  
            var client = new RestClient("https://fcm.googleapis.com/fcm/send");
            var request = new RestRequest(Method.POST);

            request.AddHeader("postman-token", "3dbd6c03-72a1-0e30-73da-a49cd909e764");
            request.AddHeader("cache-control", "no-cache");
            request.AddHeader("content-type", "application/json");
            request.AddHeader("authorization", "key=AAAAmMixZMM:APA91bFbgjNbF-CfiACXe5Il57s_5r1e3U8J-897gaiUna-mTfknUHPCQTtZiTQpQnnx6aP34c54bUxqMEtQEuNtaVZz0YqnkYRi4T_a_EvbsSEYoid81rhR1M2qpDe9g-0aokSrEOJX");
            //request.AddParameter("application/json", "{\r\n\t\"notification\": {\r\n\t\t\"body\": \"99 sdfs sdfthis is a body\", \"title\": \"77 sdfsdf this is a title\"\r\n\t}, \r\n\t\"priority\": \"high\", \r\n\t\"data\": {\r\n\t\t\"clickaction\": \"FLUTTERNOTIFICATIONCLICK\", \"id\": \"1\", \"status\": \"done\"\r\n\t}, \r\n\t\"to\": \"dLdWmKEy3Uc:APA91bE45CJcRUhBdCYZesGDXfqZkkPcmMHkzFIT4AEYl31dku0ZscQIorhLFg2eQ24_Rvd80hVMHaErGxZ-IzT7ExRHup2xj3XKTDnums9k3Cvk72g-1TcQwR5d8NaxcmOOvOJ88Ybg\"\r\n} ", ParameterType.RequestBody);
            request.AddParameter("application/json", "{\r\n\t\"notification\": {\r\n\t\t\"body\": \"" + 
                body + "\", \"title\": \"" + title + "\"\r\n\t}, \r\n\t\"priority\": \"high\", \r\n\t\"data\": {\r\n\t\t\"clickaction\": \"FLUTTERNOTIFICATIONCLICK\", \"id\": \"1\", \"status\": \"done\"\r\n\t}, \r\n\t\"to\": \"" + 
                firebasenotifiid + "\"\r\n} ", ParameterType.RequestBody);

            IRestResponse response = client.Execute(request);

            return new OkObjectResult(response);
        }
       

    }
}