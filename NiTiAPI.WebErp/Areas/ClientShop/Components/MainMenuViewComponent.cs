using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NiTiErp.Controllers.Components
{
    public class MainMenuViewComponent : ViewComponent
    {
        public async Task<IViewComponentResult> InvokeAsync()
        {
            return View();
        }
        //private IProductCategoryService _productCategoryService;

        //public MainMenuViewComponent(IProductCategoryService productCategoryService)
        //{
        //    _productCategoryService = productCategoryService;
        //}

        //public async Task<IViewComponentResult> InvokeAsync()
        //{
        //    return View(_productCategoryService.GetAll());
        //}
    }
}
