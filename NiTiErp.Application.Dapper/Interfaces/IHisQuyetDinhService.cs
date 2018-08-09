using NiTiErp.Utilities.Dtos;
using System;
using System.Collections.Generic;
using System.Text;
using NiTiErp.Application.Dapper.ViewModels;
using System.Threading.Tasks;

namespace NiTiErp.Application.Dapper.Interfaces
{
    public interface IHisQuyetDinhService
    {
        Task<PagedResult<HisQuyetDinhViewModel>> GetAllHisQuyetDinhPaging(string corporationId, string phongId, string keyword, int page, int pageSize,
            string hosoId, string hosoId2, string hosoId3,
            string quyetdinhId, string quyetdinhId2, DateTime tungay, DateTime denngay, int status,
            string parameters);
    }
}
