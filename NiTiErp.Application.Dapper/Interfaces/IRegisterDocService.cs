using NiTiErp.Application.Dapper.ViewModels;
using NiTiErp.Utilities.Dtos;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace NiTiErp.Application.Dapper.Interfaces
{
    public interface IRegisterDocService
    {
        Task<RegisterDocViewModel> GetById(long id);

        Task<PagedResult<RegisterDocViewModel>> GetAllPagingRegister(int corporationId,
            string keyword, int pageIndex, int pageSize);
    }
}
