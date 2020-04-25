using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.AspNetCore.Localization;
using Microsoft.AspNetCore.Http;

using Microsoft.Extensions.Localization;
using NiTiAPI.Dapper.Repositories.Interfaces;

namespace NiTiAPI.WebErp.Areas.CPrice.Controllers
{
    public class HomeController : BaseController
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}