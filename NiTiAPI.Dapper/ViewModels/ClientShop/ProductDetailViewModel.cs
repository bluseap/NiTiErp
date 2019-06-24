using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace NiTiAPI.Dapper.ViewModels.ClientShop
{
    public class ProductDetailViewModel
    {
        public Task<ProductViewModel> Product { get; set; }

        public bool Available { set; get; }

        //public List<ProductViewModel> RelatedProducts { get; set; }

        public Task<CategoriesViewModel> Category { get; set; }

        //public List<ProductImageViewModel> ProductImages { set; get; }

        //public List<ProductViewModel> UpsellProducts { get; set; }

        //public List<ProductViewModel> LastestProducts { get; set; }

        //public List<TagViewModel> Tags { set; get; }

        //public List<SelectListItem> Colors { set; get; }

        //public List<SelectListItem> Sizes { set; get; }
    }
}
