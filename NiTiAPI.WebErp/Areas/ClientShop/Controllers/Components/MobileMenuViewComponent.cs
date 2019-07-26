using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using NiTiAPI.Dapper.Repositories.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NiTiAPI.WebErp.Areas.ClientShop.Controllers.Components
{
    public class MobileMenuViewComponent : ViewComponent
    {        

        private IProductRepository _productRepository;

        public MobileMenuViewComponent(IProductRepository productRepository)
        {
            _productRepository = productRepository;
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
