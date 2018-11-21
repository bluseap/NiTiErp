using NiTiErp.Application.Dapper.ViewModels;
using NiTiErp.Utilities.Dtos;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace NiTiErp.Application.Dapper.Interfaces
{
    public interface IChiPhiKhoiTaoService
    {
        Task<PagedResult<ChiPhiKhoiTaoViewModel>> GetAllChiPhiKhoiTaoPaging(int chiphikhoitaoId, string corporationId, string keyword, int page, int pageSize,
            int ChiPhiId, bool IsKyKhoiTao, DateTime KyKhoiTao, bool IsChuyenKy, string ghichu, string parameters);

        Task<List<ChiPhiKhoiTaoViewModel>> ChiPhiKhoiTaoGetList(int chiphikhoitaoId, string corporationId, string keyword, int page, int pageSize,
            int ChiPhiId, bool IsKyKhoiTao, DateTime KyKhoiTao, bool IsChuyenKy, string ghichu, string parameters);

        Task<Boolean> ChiPhiKhoiTaoAUD(ChiPhiKhoiTaoViewModel chiphikhoitao, string parameters);

    }
}
