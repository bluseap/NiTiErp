using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace NiTiErp.Areas.Client.Controllers
{
    public class CorporationClientController : Controller
    {
        [Area("Client")]
        public IActionResult Index()
        {
            return View();
        }
    }
}