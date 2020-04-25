using NiTiErp.Application.Dapper.ViewModels;
using NiTiErp.Utilities.Dtos;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace NiTiErp.Application.Dapper.Interfaces
{
    public interface IVanBanDienTuService
    {       

        Task<PagedResult<VanBanDienTuViewModel>> GetAllVanBanDienTuPaging(string corporationId, Int32 VanBanDienTuPhatHanhId,
            DateTime TuNgayPhatHanh, DateTime DenNgayPhatHanh, Int32 VanBanDienTuId, string SoKyHieuVanBan,
            string keyword, int page, int pageSize, string GhiChu, string parameters);

        Task<List<VanBanDienTuViewModel>> VanBanDienTuGetList(string corporationId, Int32 VanBanDienTuPhatHanhId,
            DateTime TuNgayPhatHanh, DateTime DenNgayPhatHanh, Int32 VanBanDienTuId, string SoKyHieuVanBan,
            string keyword, string GhiChu, string parameters);

    }
}
