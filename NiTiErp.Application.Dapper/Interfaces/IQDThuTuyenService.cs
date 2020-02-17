using NiTiErp.Application.Dapper.ViewModels;
using NiTiErp.Utilities.Dtos;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace NiTiErp.Application.Dapper.Interfaces
{
    public interface IQDThuTuyenService
    {
        Task<PagedResult<QDThuTuyenViewModel>> GetAllThuTuyenPaging(string corporationId, string phongId, string keyword, int page, int pageSize,
            string hosoId, string hosoId2, string hosoId3, string thutuyenId, string parameters);

        Task<List<QDThuTuyenViewModel>> GetListThuTuyenPaging(string corporationId, string phongId, string keyword, int page, int pageSize,
            string hosoId, string hosoId2, string hosoId3, string thutuyenId, string parameters);

        Task<Boolean> QDThuTuyenAUD(QDThuTuyenViewModel thutuyen, string parameters);
    }
}
