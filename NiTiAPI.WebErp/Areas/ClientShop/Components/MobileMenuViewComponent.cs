using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NiTiErp.Controllers.Components
{
    public class MobileMenuViewComponent : ViewComponent
    {
        public async Task<IViewComponentResult> InvokeAsync()
        {
            return View();
        }
        //private IProductCategoryService _productCategoryService;

        //public MobileMenuViewComponent(IProductCategoryService productCategoryService)
        //{
        //    _productCategoryService = productCategoryService;
        //}

        //public async Task<IViewComponentResult> InvokeAsync()
        //{
        //    return View(_productCategoryService.GetAll());
        //}
    }
}
