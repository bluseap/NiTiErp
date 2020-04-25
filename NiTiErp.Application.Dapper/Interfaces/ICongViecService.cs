using System;
using System.Collections.Generic;
using System.Text;
using NiTiErp.Application.Dapper.ViewModels;
using System.Threading.Tasks;
using NiTiErp.Utilities.Dtos;

namespace NiTiErp.Application.Dapper.Interfaces
{
    public interface ICongViecService
    {
        Task<PagedResult<CongViecViewModel>> GetAllCongViecPaging(string corporationId, string phongId, string keyword, int page, int pageSize,
            string hosoId, string hosoId2, string hosoId3, string congviecId,  string parameters);

        Task<Boolean> CongViecAUD(CongViecViewModel trinhdo, string parameters);
    }
}
