using System;
using System.Collections.Generic;
using System.Text;
using NiTiErp.Application.Dapper.ViewModels;
using System.Threading.Tasks;
using NiTiErp.Utilities.Dtos;

namespace NiTiErp.Application.Dapper.Interfaces
{
    public interface IVanBanLinhVucService
    {
        Task<Boolean> VanBanLinhVucAUD(VanBanLinhVucViewModel vblv, string parameters);

        Task<PagedResult<VanBanLinhVucViewModel>> GetAllVanBanLinhVucPaging(string tenvanbanlinhvuc,
            string keyword, int page, int pageSize, int vanbanlinhvucid, string ghichu, string parameters);

        Task<List<VanBanLinhVucViewModel>> VanBanLinhVucGetList(string bangId, string id2, string id3, string parameters);

    }
}
