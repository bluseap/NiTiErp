using NiTiErp.Application.Dapper.ViewModels;
using NiTiErp.Utilities.Dtos;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace NiTiErp.Application.Dapper.Interfaces
{
    public interface IDaoTaoNoiService
    {
        Task<PagedResult<DaoTaoNoiViewModel>> GetAllDaoTaoNoiPaging(int daotaonoiId, string keyword, int page, int pageSize,
            string daotaonoiId2,  int status, string parameters);

        Task<List<DaoTaoNoiViewModel>> DaoTaoNoiGetList(int daotaonoiId, string keyword, int page, int pageSize,
            string daotaonoiId2,  int status, string parameters);

        Task<Boolean> DaoTaoNoiAUD(DaoTaoNoiViewModel daotaonoi, string parameters);
    }
}
