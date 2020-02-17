using NiTiErp.Application.Dapper.ViewModels;
using NiTiErp.Utilities.Dtos;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace NiTiErp.Application.Dapper.Interfaces
{
    public interface IQDBoNhiemService
    {
        Task<PagedResult<QDBoNhiemViewModel>> GetAllBoNhiemPaging(string corporationId, string phongId, string keyword, int page, int pageSize,
            string hosoId, string hosoId2, string hosoId3, string bonhiemId, string parameters);

        Task<List<QDBoNhiemViewModel>> GetListBoNhiemPaging(string corporationId, string phongId, string keyword, int page, int pageSize,
            string hosoId, string hosoId2, string hosoId3, string bonhiemId, string parameters);

        Task<Boolean> QDBoNhiemAUD(QDBoNhiemViewModel bonhiem, string parameters);
    }
}
