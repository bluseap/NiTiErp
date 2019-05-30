using NiTiAPI.Dapper.ViewModels;
using NiTiAPI.Utilities.Dtos;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace NiTiAPI.Dapper.Repositories.Interfaces
{
    public interface ICategoriesRepository
    {
        Task<CategoriesViewModel> GetById(int id);

        Task<List<CategoriesViewModel>> GetListCategory();

        Task<PagedResult<CategoriesViewModel>> GetPaging(string keyword, int coporationId, int pageIndex, int pageSize);

        Task<bool> Create(CategoriesViewModel category);

        Task<bool> Update(CategoriesViewModel category);

        Task<bool> UpdateParent(int fromParent, int toParent, int parameter, string username);

        Task<bool> Delete(int id, string username);
    }
}
