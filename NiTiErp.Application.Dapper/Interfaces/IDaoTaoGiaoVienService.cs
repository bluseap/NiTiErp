using NiTiErp.Application.Dapper.ViewModels;
using NiTiErp.Utilities.Dtos;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace NiTiErp.Application.Dapper.Interfaces
{
    public interface IDaoTaoGiaoVienService
    {
        Task<PagedResult<DaoTaoGiaoVienViewModel>> GetAllDaoTaoGiaoVienPaging(int namDaoTao, string daotaonoiId, string chuyenmon, string keyword, int page, int pageSize,
            Guid daotaogiaovienId2, Guid daotaolopId2, string parameters);

        Task<List<DaoTaoGiaoVienViewModel>> DaoTaoGiaoVienGetList(int namDaoTao, string daotaonoiId, string chuyenmon, string keyword, int page, int pageSize,
            Guid daotaogiaovienId2, Guid daotaolopId2, string parameters);

        Task<Boolean> DaoTaoGiaoVienAUD(DaoTaoGiaoVienViewModel daotaogiaovien, string parameters);
    }
}
