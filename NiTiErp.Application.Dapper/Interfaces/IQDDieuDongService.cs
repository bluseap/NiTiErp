using NiTiErp.Application.Dapper.ViewModels;
using NiTiErp.Utilities.Dtos;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace NiTiErp.Application.Dapper.Interfaces
{
    public interface IQDDieuDongService
    {
        Task<PagedResult<QDDieuDongViewModel>> GetAllDieuDongPaging(string corporationId, string phongId, string keyword, int page, int pageSize,
            string hosoId, string hosoId2, string hosoId3, string dieudongId, string parameters);

        Task<List<QDDieuDongViewModel>> GetListDieuDongPaging(string corporationId, string phongId, string keyword, int page, int pageSize,
            string hosoId, string hosoId2, string hosoId3, string dieudongId, string parameters);

        Task<Boolean> QDDieuDongAUD(QDDieuDongViewModel dieudong, string parameters);
    }
}
