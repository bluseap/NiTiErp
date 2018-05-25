using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

using NiTiErp.Application.Interfaces;
using NiTiErp.Application.ViewModels.System;
using NiTiErp.Authorization;
using NiTiErp.Extensions;

namespace NiTiErp.Areas.Admin.Controllers
{
    public class HosoController : BaseController
    {
        //IProductCategoryService _productCategoryService;

        //public HosoController(IProductCategoryService productCategoryService)
        //{
        //    _productCategoryService = productCategoryService;
        //}

        public IActionResult Index()
        {
            return View();
        }

    }
}