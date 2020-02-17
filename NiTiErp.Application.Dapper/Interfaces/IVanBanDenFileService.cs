using NiTiErp.Application.Dapper.ViewModels;
using NiTiErp.Utilities.Dtos;
using System;
using System.Threading.Tasks;

namespace NiTiErp.Application.Dapper.Interfaces
{
    public interface IVanBanDenFileService
    {
        Task<Boolean> VanBanDenFileAUD(VanBanDenFileViewModel vanbandenfile, string parameters);

        Task<PagedResult<VanBanDenFileViewModel>> GetAllVanBanDenFilePaging(Int64 Id, string CodeId, Int64 VanBanDenId, string TenFile,
            string keyword, int page, int pageSize, string parameters);
    }
}
