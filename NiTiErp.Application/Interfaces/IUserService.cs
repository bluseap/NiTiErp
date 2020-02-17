using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using NiTiErp.Application.ViewModels.System;
using NiTiErp.Utilities.Dtos;

namespace NiTiErp.Application.Interfaces
{
    public interface IUserService
    {
        Task<bool> AddAsync(AppUserViewModel userVm);

        Task DeleteAsync(string id);

        Task<List<AppUserViewModel>> GetAllAsync();

        PagedResult<AppUserViewModel> GetAllPagingAsync(string keyword, int page, int pageSize);
        PagedResult<AppUserViewModel> GetAllPagingAsyncCor(string keyword, int page, int pageSize, string corporationId);
        PagedResult<AppUserViewModel> GetAllPagingAsyncCorPhong(string keyword, int page, int pageSize, string corporationId, string phongbanId);

        Task<AppUserViewModel> GetById(string id);

        Task<AppUserViewModel> GetByUserName2Id(string id);


        Task UpdateAsync(AppUserViewModel userVm);
        Task EditPassAsync(AppUserViewModel userVm);

        Task<AppUserViewModel> GetUserName(string username);
    }
}
