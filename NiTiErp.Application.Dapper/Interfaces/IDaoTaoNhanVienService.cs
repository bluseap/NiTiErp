using NiTiErp.Application.Dapper.ViewModels;
using NiTiErp.Utilities.Dtos;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace NiTiErp.Application.Dapper.Interfaces
{
    public interface IDaoTaoNhanVienService
    {
        Task<PagedResult<DaoTaoNhanVienViewModel>> GetAllDaoTaoNhanVienPaging(Guid daotaonhanvienId, Guid hosoId,  Guid DaoTaoLopId,
            string CorporationId, string PhongBanDanhMucId, Guid daotaonhanvienId2, string keyword, int page, int pageSize  , string parameters);

        Task<List<DaoTaoNhanVienViewModel>> DaoTaoNhanVienGetList(Guid daotaonhanvienId, Guid hosoId, Guid DaoTaoLopId,
            string CorporationId, string PhongBanDanhMucId, Guid daotaonhanvienId2, string keyword, int page, int pageSize, string parameters);

        Task<List<DaoTaoNhanVienViewModel>> DaoTaoNhanVienListAUD(Guid daotaonhanvienId, Guid hosoId, Guid DaoTaoLopId, string userId, string parameters);

        Task<Boolean> DaoTaoNhanVienAUD(DaoTaoNhanVienViewModel daotaonhanvien, string parameters);
    }
}
