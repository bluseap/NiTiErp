using NiTiErp.Application.Dapper.ViewModels;
using NiTiErp.Utilities.Dtos;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace NiTiErp.Application.Dapper.Interfaces
{
    public interface IQDKyLuatService
    {
        Task<PagedResult<QDKyLuatViewModel>> GetAllKyLuatPaging(string corporationId, string phongId, string keyword, int page, int pageSize,
            string hosoId, string hosoId2, string hosoId3, string kyluatId, string parameters);

        Task<List<QDKyLuatViewModel>> GetListKyLuatPaging(string corporationId, string phongId, string keyword, int page, int pageSize,
            string hosoId, string hosoId2, string hosoId3, string kyluatId, string parameters);

        Task<Boolean> QDKyLuatAUD(QDKyLuatViewModel kyluat, string parameters);
    }
}
