using NiTiErp.Application.Dapper.ViewModels;
using NiTiErp.Utilities.Dtos;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace NiTiErp.Application.Dapper.Interfaces
{
    public interface IChiPhiService
    {
        Task<PagedResult<ChiPhiViewModel>> GetAllChiPhiPaging(int chiphiId, string corporationId, string keyword, int page, int pageSize,
           bool IsChiPhiTang, int ChiPhiLoaiId, int ChiPhiBangDanhMucId, string ghichu2, string ghichu3, string parameters);

        Task<List<ChiPhiViewModel>> ChiPhiGetList(int chiphiId, string corporationId, string keyword, int page, int pageSize,
           bool IsChiPhiTang, int ChiPhiLoaiId, int ChiPhiBangDanhMucId, string ghichu2, string ghichu3, string parameters);

        Task<Boolean> ChiPhiAUD(ChiPhiViewModel chiphi, string parameters);
    }
}
