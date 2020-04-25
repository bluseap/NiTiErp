using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace NiTiAPI.WebErp.Areas.ClientShop.Controllers
{
    public class AjaxContentController : BaseController
    {
        public IActionResult HeaderCart()
        {
            return ViewComponent("HeaderCart");
        }
    }
}