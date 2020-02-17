using NiTiErp.Application.Dapper.ViewModels;
using NiTiErp.Utilities.Dtos;
using System;
using System.Threading.Tasks;

namespace NiTiErp.Application.Dapper.Interfaces
{
    public interface IVanBanDenXuLyFileService
    {
        Task<Boolean> VanBanDenXuLyFileAUD(VanBanDenXuLyFileViewModel vanbandenxulyfile, string parameters);

        Task<PagedResult<VanBanDenXuLyFileViewModel>> GetAllVanBanDenXuLyFilePaging(long Id, long VanBanDenDuyetId, string TenFile,
            string keyword, int page, int pageSize, string parameters);

    }
}
