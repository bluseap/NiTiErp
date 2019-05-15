using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using Microsoft.AspNetCore.Mvc.ModelBinding;

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