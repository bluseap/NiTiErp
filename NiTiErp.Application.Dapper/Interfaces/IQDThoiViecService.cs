using NiTiErp.Application.Dapper.ViewModels;
using NiTiErp.Utilities.Dtos;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace NiTiErp.Application.Dapper.Interfaces
{
    public interface IQDThoiViecService
    {
        Task<PagedResult<QDThoiViecViewModel>> GetAllThoiViecPaging(string corporationId, string phongId, string keyword, int page, int pageSize,
            string hosoId, string hosoId2, string hosoId3, string thoiviecId, string parameters);

        Task<List<QDThoiViecViewModel>> GetListThoiViecPaging(string corporationId, string phongId, string keyword, int page, int pageSize,
            string hosoId, string hosoId2, string hosoId3, string thoiviecId, string parameters);

        Task<Boolean> QDThoiViecAUD(QDThoiViecViewModel thoiviec, string parameters);
    }
}
