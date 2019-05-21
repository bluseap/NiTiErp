using NiTiAPI.Dapper.ViewModels;
using NiTiAPI.Utilities.Dtos;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace NiTiAPI.Dapper.Repositories.Interfaces
{
    public interface IRoleRepository
    {
        Task<RoleViewModel> GetById(Guid id);

        Task<List<RoleViewModel>> GetListRole();

        Task<PagedResult<RoleViewModel>> GetPaging(string keyword, int coporationId, int pageIndex, int pageSize);

        Task<Boolean> Create(RoleViewModel corporation);

        Task<Boolean> Update(RoleViewModel corporation);

        Task<Boolean> Delete(Guid id, string username);
    }
}
