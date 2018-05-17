using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using NiTiErp.Application.Interfaces;

namespace NiTiErp.Controllers.Components
{
    public class MobileNewsMenuViewComponent : ViewComponent
    {

        private IProductCategoryService _productCategoryService;

        public MobileNewsMenuViewComponent(IProductCategoryService productCategoryService)
        {
            _productCategoryService = productCategoryService;
        }

        public async Task<IViewComponentResult> InvokeAsync()
        {
            return View(_productCategoryService.GetAll());
        }   
       
    }
}
