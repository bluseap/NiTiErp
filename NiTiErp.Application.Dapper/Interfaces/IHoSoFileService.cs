using NiTiErp.Application.Dapper.ViewModels;
using NiTiErp.Utilities.Dtos;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace NiTiErp.Application.Dapper.Interfaces
{
    public interface IHoSoFileService
    {
        Task<PagedResult<HoSoFileViewModel>> GetAllHoSoFilePaging(string corporationId, string phongId, string keyword, int page, int pageSize,
            string hosoId, string hosoId2, string hosoId3, string hosofileId, string parameters);

        Task<Boolean> HoSoFileAUD(HoSoFileViewModel hosofile, string parameters);
    }
}
