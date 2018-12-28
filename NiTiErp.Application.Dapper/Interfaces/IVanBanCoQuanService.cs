using System;
using System.Collections.Generic;
using System.Text;
using NiTiErp.Application.Dapper.ViewModels;
using System.Threading.Tasks;
using NiTiErp.Utilities.Dtos;

namespace NiTiErp.Application.Dapper.Interfaces
{
    public interface IVanBanCoQuanService
    {
        Task<Boolean> VanBanCoQuanAUD(VanBanCoQuanViewModel vanbancoquan, string parameters);

        Task<PagedResult<VanBanCoQuanViewModel>> GetAllVanBanCoQuanPaging(string tencoquan, string diachi,
            string keyword, int page, int pageSize, int vanbancoquanid, string ghichu,  string parameters);

        Task<List<VanBanCoQuanViewModel>> VanBanCoQuanGetList(string bangId, string id2, string id3, string parameters);
    }
}
