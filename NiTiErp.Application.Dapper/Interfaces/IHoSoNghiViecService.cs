using NiTiErp.Application.Dapper.ViewModels;
using NiTiErp.Utilities.Dtos;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace NiTiErp.Application.Dapper.Interfaces
{
    public interface IHoSoNghiViecService
    {
        Task<PagedResult<HoSoNghiViecViewModel>> GetAllHoSoNghiViecPaging(string corporationId, string phongId, string keyword, int page, int pageSize,
            string hosoId, string hosoId2, string hosoId3, string hosonghiviecId, string parameters);      

        Task<Boolean> HoSoNghiViecAUD(HoSoNghiViecViewModel hosonghiviec, string parameters);
    }
}
