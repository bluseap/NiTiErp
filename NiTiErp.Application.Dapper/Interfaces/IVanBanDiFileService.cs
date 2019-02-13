using NiTiErp.Application.Dapper.ViewModels;
using NiTiErp.Utilities.Dtos;
using System;
using System.Threading.Tasks;

namespace NiTiErp.Application.Dapper.Interfaces
{
    public interface IVanBanDiFileService
    {
        Task<Boolean> VanBanDiFileAUD(VanBanDiFileViewModel vanbandifile, string parameters);

        Task<PagedResult<VanBanDiFileViewModel>> GetAllVanBanDiFilePaging(Int64 Id, string CodeId, Int64 VanBanDiId, string TenFile,
            string keyword, int page, int pageSize, string parameters);
    }
}
