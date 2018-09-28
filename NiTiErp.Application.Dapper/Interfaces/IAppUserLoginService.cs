using System;
using System.Collections.Generic;
using System.Text;
using NiTiErp.Application.Dapper.ViewModels;
using System.Threading.Tasks;
using NiTiErp.Utilities.Dtos;

namespace NiTiErp.Application.Dapper.Interfaces
{
    public interface IAppUserLoginService
    {
        Task<PagedResult<AppUserLoginViewModel>> GetAllAppUserPaging(string corporationId, string keyword, int page, int pageSize,
            string userId, string userName, string fullName, string parameters);

        Task<List<AppUserLoginViewModel>> GetListAppUserPaging(string corporationId, string keyword, int page, int pageSize,
            string userId, string userName, string fullName, string parameters);

        Task<Boolean> AppUserLoginAUD(AppUserLoginViewModel appuser, string parameters);

    }
}
