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
        #region DbConnectionString Database NiTiErp
        Task<RegisterDocViewModel> GetById(long id);

        Task<List<RegisterDocViewModel>> GetByAppUserIdCode(Guid appuserId, string code);

        Task<PagedResult<RegisterDocViewModel>> GetAllPagingRegister(int corporationId,
            string keyword, int pageIndex, int pageSize);

        Task<List<RegisterDocViewModel>> GetByVBDDuyetId(long vanbandenduyetid);

        #endregion

        #region connect stringErp Database NiTiErp
        Task<RegisterDocViewModel> GetByIdErp(long id);

        Task<PagedResult<RegisterDocViewModel>> GetAllPagingRegisterErp(int corporationId,
            string keyword, int pageIndex, int pageSize);

        Task<bool> CreateRegisterDoc(string firebasenotifiId, string username,
            string softId, string softName, string platformImei);
        #endregion

    }
}
