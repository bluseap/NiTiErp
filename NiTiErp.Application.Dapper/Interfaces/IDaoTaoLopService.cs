using NiTiErp.Application.Dapper.ViewModels;
using NiTiErp.Utilities.Dtos;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace NiTiErp.Application.Dapper.Interfaces
{
    public interface IDaoTaoLopService
    {
        Task<PagedResult<DaoTaoLopViewModel>> GetAllDaoTaoLopPaging(int namDaoTao, string daotaonoiId, string chuyenmon, string keyword, int page, int pageSize,
            Guid daotaolopId2, string daotaonoiId2, string parameters);

        Task<List<DaoTaoLopViewModel>> DaoTaoLopGetList(int namDaoTao, string daotaonoiId, string chuyenmon, string keyword, int page, int pageSize,
            Guid daotaolopId2, string daotaonoiId2, string parameters);        

        Task<Boolean> DaoTaoLopAUD(DaoTaoLopViewModel daotaolop, string parameters);
    }
}
