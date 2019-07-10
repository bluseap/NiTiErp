using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Localization;
using Microsoft.AspNetCore.Mvc;
using NiTiAPI.Dapper.Repositories.Interfaces;
using NiTiAPI.Dapper.ViewModels.ClientShop;
using NiTiAPI.Utilities.Constants;
using NiTiAPI.WebErp.Extensions;

namespace NiTiAPI.WebErp.Areas.ClientShop.Controllers
{
    public class CartController : BaseController
    {
        private readonly IProductRepository _productRepository;

        public CartController(IProductRepository productRepository
            )
        {
            _productRepository = productRepository;
            
        }

        public IActionResult Index()
        {
            return View();
        }

        //[HttpPost]
        //public IActionResult AddToCart(long productId, int quantity, int color, int size)
        //{           

        //    var culture = HttpContext.Features.Get<IRequestCultureFeature>().RequestCulture.Culture.Name;

        //    //Get product detail
        //    var product = _productRepository.GetById(productId, culture);

        //    //Get session with item list from cart
        //    var session = HttpContext.Session.Get<List<ShoppingCartViewModel>>(CommonConstants.CartSession);
        //    if (session != null)
        //    {
        //        //Convert string to list object
        //        bool hasChanged = false;

        //        //Check exist with item product id
        //        if (session.Any(x => x.Product.Id == productId))
        //        {
        //            foreach (var item in session)
        //            {
        //                //Update quantity for product if match product id
        //                if (item.Product.Id == productId)
        //                {
        //                    item.Quantity += quantity;
        //                    item.Price = product.Result.DiscountPrice == 0 ? product.Result.DiscountPrice : product.Result.Price;
        //                    hasChanged = true;
        //                }
        //            }
        //        }
        //        else
        //        {
        //            session.Add(new ShoppingCartViewModel()
        //            {
        //                Product = product.Result,
        //                Quantity = quantity,
        //                Color = _billService.GetColor(color),
        //                Size = _billService.GetSize(size),
        //                Price = product.Result.DiscountPrice == 0 ? product.Result.DiscountPrice : product.Result.Price
        //        });
        //            hasChanged = true;
        //        }

        //        //Update back to cart
        //        if (hasChanged)
        //        {
        //            HttpContext.Session.Set(CommonConstants.CartSession, session);
        //        }
        //    }
        //    else
        //    {
        //        //Add new cart
        //        var cart = new List<ShoppingCartViewModel>();
        //        cart.Add(new ShoppingCartViewModel()
        //        {
        //            Product = product,
        //            Quantity = quantity,
        //            Color = _billService.GetColor(color),
        //            Size = _billService.GetSize(size),
        //            Price = product.PromotionPrice ?? product.Price
        //        });
        //        HttpContext.Session.Set(CommonConstants.CartSession, cart);
        //    }
        //    return new OkObjectResult(productId);
        //}

    }
}