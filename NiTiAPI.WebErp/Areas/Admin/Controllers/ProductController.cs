using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using NiTiAPI.Dapper.Repositories.Interfaces;

namespace NiTiAPI.WebErp.Areas.Admin.Controllers
{
    public class ProductController : BaseController
    {
        private readonly IProductRepository _product;

        public ProductController(IProductRepository product)
        {
            _product = product;
        }

        public IActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public async Task<IActionResult> GetProductId(long id, string culture)
        {
            var model = await _product.GetById(id, culture);
            return new OkObjectResult(model);
        }

        [HttpGet]
        public async Task<IActionResult> GetPaging(string keyword, int corporationId, int categoryId,
            int pageIndex, int pageSize, string culture)
        {
            var model = await _product.GetPagingProduct(keyword, corporationId, categoryId, pageIndex, pageSize, culture);
            return new OkObjectResult(model);
        }

    }
}