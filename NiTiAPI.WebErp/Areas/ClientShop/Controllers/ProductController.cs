﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Localization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Localization;
using NiTiAPI.Dapper.Repositories.Interfaces;
using NiTiAPI.Dapper.ViewModels.ClientShop;

namespace NiTiAPI.WebErp.Areas.ClientShop.Controllers
{
    public class ProductController : BaseController
    {
        private readonly IStringLocalizer<HomeController> _localizer;
        private readonly IProductRepository _productRepository;
        private readonly ICategoriesRepository _categoriesRepository;

        public ProductController(IStringLocalizer<HomeController> localizer, IProductRepository productRepository,
            ICategoriesRepository categoriesRepository)
        {
            _localizer = localizer;
            _productRepository = productRepository;
            _categoriesRepository = categoriesRepository;
        }

        public IActionResult Index(string id, string productId)
        {
            ViewData["CorporationName"] = id;

            if (id != null)
            {
                HttpContext.Session.SetString("corprationName", id);
            }
            else
            {
                HttpContext.Session.SetString("corprationName", "");
            }

            var culture = HttpContext.Features.Get<IRequestCultureFeature>().RequestCulture.Culture.Name;     
            return View();
        }

        public IActionResult Details(string id, string productId)
        {
            HttpContext.Session.Clear();
            ViewData["BodyClass"] = "product-page";
            ViewData["CorporationName"] = id;            
            if (id != null)
            {
                HttpContext.Session.SetString("corprationName", id);
            }
            else
            {
                HttpContext.Session.SetString("corprationName", "");
            }

            var culture = HttpContext.Features.Get<IRequestCultureFeature>().RequestCulture.Culture.Name;

            var model = new ProductDetailViewModel();

            if (productId != null)
            {
                model.Product = _productRepository.GetById(Convert.ToInt64(productId), culture);
                var product = model.Product.Result;
                if (product != null)
                {
                    model.Category = _categoriesRepository.GetById(product.CategoryId);
                }               
            }

            //model.RelatedProducts = _productService.GetRelatedProducts(productId, 9);
            //model.UpsellProducts = _productService.GetUpsellProducts(6);
            //model.ProductImages = _productService.GetImages(productId);
            //model.Tags = _productService.GetProductTags(productId);
            //model.Colors = _billService.GetColors().Select(x => new SelectListItem()
            //{
            //    Text = x.Name,
            //    Value = x.Id.ToString()
            //}).ToList();
            //model.Sizes = _billService.GetSizes().Select(x => new SelectListItem()
            //{
            //    Text = x.Name,
            //    Value = x.Id.ToString()
            //}).ToList();

            return View(model);
        }

    }
}