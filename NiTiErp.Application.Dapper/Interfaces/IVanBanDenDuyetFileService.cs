using NiTiErp.Application.Dapper.ViewModels;
using NiTiErp.Utilities.Dtos;
using System;
using System.Threading.Tasks;

namespace NiTiErp.Application.Dapper.Interfaces
{
    public interface IVanBanDenDuyetFileService
    {
        Task<Boolean> VanBanDenDuyetFileAUD(VanBanDenDuyetFileViewModel vanbandenduyetfile, string parameters);

        Task<PagedResult<VanBanDenDuyetFileViewModel>> GetAllVanBanDenDuyetFilePaging(long Id, string CodeId, long VanBanDenDuyetId, string TenFile,
            string keyword, int page, int pageSize, string parameters);
    }
}
