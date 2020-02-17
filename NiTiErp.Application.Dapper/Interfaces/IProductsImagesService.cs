using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using NiTiErp.Application.Dapper.ViewModels;

namespace NiTiErp.Application.Dapper.Interfaces
{
    public interface IProductsImagesService
    {
        Task<IEnumerable<ProductsImagesViewModel>> RemoveProductImagesPara(int productImagesId, int productId, int id, string stringId, string cobien);
    }
}
