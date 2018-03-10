using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using NiTiErp.Models;
using Microsoft.AspNetCore.Authorization;
using NiTiErp.Extensions;
using NiTiErp.Application.Interfaces;

namespace NiTiErp.Controllers
{
    public class HomeNewsController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}