using System;
using System.Collections.Generic;
using System.Text;

using System.Threading.Tasks;
using NiTiErp.Application.Dapper.ViewModels;
using NiTiErp.Utilities.Dtos;

namespace NiTiErp.Application.Dapper.Interfaces
{
    public interface ICorporationService
    {
        Task<Boolean> CorporationAUD(CorporationViewModel corpo, string parameters);

        Task<PagedResult<CorporationViewModel>> GetAllCorPaging(string corporationId, string phongId, string keyword, int page, int pageSize,
            string hosoId, string hosoId2, string hosoId3, string parameters);

        Task<List<CorporationViewModel>> CorporationGetList(string corporationServiceId, string id2, string id3, string parameters);

    }  
}
