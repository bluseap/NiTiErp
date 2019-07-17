using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using NiTiAPI.Dapper.Repositories.Interfaces;
using NiTiAPI.Infrastructure.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NiTiAPI.WebErp.Areas.ClientShop.Controllers.Components
{
    public class CategoryMenuViewComponent : ViewComponent
    {
        private IProductRepository _productRepository;
        private IMemoryCache _memoryCache;

        public CategoryMenuViewComponent(IProductRepository productRepository, IMemoryCache memoryCache)
        {
            _productRepository = productRepository;
            _memoryCache = memoryCache;
        }

        public async Task<IViewComponentResult> InvokeAsync()
        {            
            var corporationName = HttpContext.Session.GetString("corprationName");

            if (corporationName != null && corporationName != "favicon.ico")
            {
                var product = _productRepository.GetListProductCatelogCorName(corporationName, "vi-VN");
                return View(product);              
            }
            else
            {
                return View();
            }
            
        }

    }
}
