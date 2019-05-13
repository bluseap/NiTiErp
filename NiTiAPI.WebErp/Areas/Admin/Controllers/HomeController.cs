using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

using NiTiAPI.WebErp.Extensions;
using System.Net;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using NiTiAPI.Areas.Admin.Controllers;

namespace NiTiAPI.WebErp.Areas.Admin.Controllers
{
    public class HomeController : BaseController
    {


        public IActionResult Index()
        {
            return View();
        }

    }
}