using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using NiTiAPI.Dapper.Models;
using NiTiAPI.Dapper.ViewModels;
using NiTiAPI.Utilities.Dtos;

namespace NiTiAPI.Dapper.Repositories.Interfaces
{
    public interface IProductRepository
    {
        Task<ProductViewModel> GetById(long id, string culture);

        Task<PagedResult<ProductViewModel>> GetPagingProduct(string keyword, int corporationId, int categoryId,
            int pageIndex, int pageSize, string culture);


        Task<IEnumerable<Product>> GetAllAsync(string culture);

        Task<Product> GetByIdAsync(int id, string culture);

        Task<PagedResult<Product>> GetPaging(string keyword, string culture, int categoryId, int pageIndex, int pageSize);

        Task<int> Create(string culture, Product product);

        Task Update(string culture, int id, Product product);

        Task Delete(int id);

        Task<List<ProductAttributeViewModel>> GetAttributes(int id, string culture);

        Task<PagedResult<Product>> SearchByAttributes(string keyword, string culture,
            int categoryId,string size, int pageIndex, int pageSize);


    }
}
