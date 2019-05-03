using System;
using System.Collections.Generic;
using System.Text;
using NiTiErp.Application.Dapper.ViewModels;
using System.Threading.Tasks;
using NiTiErp.Utilities.Dtos;

namespace NiTiErp.Application.Dapper.Interfaces
{
    public interface IVanBanLoaiService
    {
        Task<Boolean> VanBanLoaiAUD(VanBanLoaiViewModel vbl, string parameters);

        Task<PagedResult<VanBanLoaiViewModel>> GetAllVanBanLoaiPaging(string tenvanbanloai,
            string keyword, int page, int pageSize, int vanbanloaiid, string ghichu, string parameters);

        Task<List<VanBanLoaiViewModel>> VanBanLoaiGetList(string bangId, string id2, string id3, string parameters);
    }
}
