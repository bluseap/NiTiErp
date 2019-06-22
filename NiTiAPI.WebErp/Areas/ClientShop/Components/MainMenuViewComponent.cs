using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using NiTiAPI.Dapper.Repositories.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NiTiErp.WebErp.Areas.ClientShop.Controllers.Components
{
    public class MainMenuViewComponent : ViewComponent
    {
        private IProductRepository _productRepository;

        public MainMenuViewComponent(IProductRepository productRepository)
        {
            _productRepository = productRepository;
        }

        public async Task<IViewComponentResult> InvokeAsync()
        {
            var corporationName = HttpContext.Session.GetString("corprationName");

            if (corporationName != null)
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
