using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using NiTiErp.Application.Interfaces;
using NiTiErp.Application.ViewModels.Product;
using NiTiErp.Data.Entities;
using NiTiErp.Infrastructure.Enums;

namespace NiTiErp.Controllers.Components
{
    public class CategoryMenuViewComponent : ViewComponent
    {
        private IProductCategoryService _productCategoryService;
        private IMemoryCache _memoryCache;
        public CategoryMenuViewComponent(IProductCategoryService productCategoryService,IMemoryCache memoryCache)
        {
            _productCategoryService = productCategoryService;
            _memoryCache = memoryCache;
        }
        public async Task<IViewComponentResult> InvokeAsync()
        {
            var categories = _memoryCache.GetOrCreate(CacheKeys.ProductCategories, entry => {
                entry.SlidingExpiration = TimeSpan.FromHours(2);
                return _productCategoryService.GetAll();
            });
            
            return View(categories);
        }
    }
}
