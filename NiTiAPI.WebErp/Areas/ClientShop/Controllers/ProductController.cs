using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Localization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Localization;
using NiTiAPI.Dapper.Repositories.Interfaces;
using NiTiAPI.Dapper.ViewModels;

namespace NiTiAPI.WebErp.Areas.ClientShop.Controllers
{
    public class ProductController : BaseController
    {
        private readonly IStringLocalizer<HomeController> _localizer;
        private readonly IProductRepository _productRepository;


        public ProductController(IStringLocalizer<HomeController> localizer, IProductRepository productRepository)
        {
            _localizer = localizer;
            _productRepository = productRepository;

        }

        public IActionResult Index(string id, string productId)
        {
            ViewData["CorporationName"] = id;

            var culture = HttpContext.Features.Get<IRequestCultureFeature>().RequestCulture.Culture.Name;

            ViewBag.Name = HttpContext.Session.GetString("corprationName");

            return View();
        }

    }
}