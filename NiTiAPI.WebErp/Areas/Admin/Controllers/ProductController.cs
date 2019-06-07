using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using NiTiAPI.Dapper.Repositories.Interfaces;
using NiTiAPI.Dapper.ViewModels;
using NiTiAPI.WebErp.Filters;

namespace NiTiAPI.WebErp.Areas.Admin.Controllers
{
    public class ProductController : BaseController
    {
        private readonly IProductRepository _product;
        private readonly IProductImagesRepository _productImages;

        public ProductController(IProductRepository product, IProductImagesRepository productImages)
        {
            _product = product;
            _productImages = productImages;
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

        [HttpPost]
        [ClaimRequirement(FunctionCode.SALES_PRODUCT, ActionCode.CREATE)]
        public async Task<IActionResult> CreateProduct(ProductViewModel productVm)
        {
            if (!ModelState.IsValid)
            {
                IEnumerable<ModelError> allErrors = ModelState.Values.SelectMany(v => v.Errors);
                return new BadRequestObjectResult(allErrors);
            }
            else
            {
                productVm.CreateDate = DateTime.Now;
                var product = await _product.CreateProduct(productVm, "vi-VN");
                return new OkObjectResult(product);
            }
        }

        [HttpPost]
        [ClaimRequirement(FunctionCode.SALES_PRODUCT, ActionCode.UPDATE)]
        public async Task<IActionResult> UpdateProduct(ProductViewModel productVm)
        {
            if (!ModelState.IsValid)
            {
                IEnumerable<ModelError> allErrors = ModelState.Values.SelectMany(v => v.Errors);
                return new BadRequestObjectResult(allErrors);
            }
            else
            {
                productVm.UpdateDate = DateTime.Now;
                var product = await _product.UpdateProduct(productVm, "vi-VN");
                return new OkObjectResult(product);
            }
        }

        [HttpPost]
        [ClaimRequirement(FunctionCode.SALES_PRODUCT, ActionCode.DELETE)]
        public async Task<IActionResult> DeleteProduct(long Id, string username)
        {
            if (!ModelState.IsValid)
            {
                IEnumerable<ModelError> allErrors = ModelState.Values.SelectMany(v => v.Errors);
                return new BadRequestObjectResult(allErrors);
            }
            else
            {
                var role = await _product.DeleteProduct(Id, username);
                return new OkObjectResult(role);
            }
        }

        #region Product Images

        [HttpGet]
        public async Task<IActionResult> GetProductImages(long productId)
        {
            var model = await _productImages.GetListProductImages(productId);
            return new OkObjectResult(model);
        }

        [HttpPost]
        [ClaimRequirement(FunctionCode.SALES_PRODUCT, ActionCode.CREATE)]
        public IActionResult SaveImages(long productId, string images, string username)
        {
            var productImages = _productImages.ProductImages(productId, images, username);            
            return new OkObjectResult(productImages);
        }

        #endregion


    }
}