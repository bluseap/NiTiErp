using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

using Microsoft.AspNetCore.Authorization;
using NiTiErp.Application.Interfaces;
using NiTiErp.Application.ViewModels.System;
using NiTiErp.Authorization;
using NiTiErp.Extensions;

namespace NiTiErp.Areas.Admin.Controllers
{
    public class QDKyLuatController : BaseController
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}