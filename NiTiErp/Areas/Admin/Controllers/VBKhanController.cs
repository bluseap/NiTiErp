using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace NiTiErp.Areas.Admin.Controllers
{
    public class VBKhanController : BaseController
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}