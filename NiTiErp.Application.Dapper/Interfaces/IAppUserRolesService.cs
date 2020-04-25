using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using NiTiErp.Application.Dapper.ViewModels;

namespace NiTiErp.Application.Dapper.Interfaces
{
    public interface IAppUserRolesService
    {
        Task<IEnumerable<AppUserRolesViewModel>> RemoveFromRolesAsync(string roleId, string userId);
    }
}
