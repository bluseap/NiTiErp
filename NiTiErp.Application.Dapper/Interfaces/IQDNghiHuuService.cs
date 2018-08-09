using NiTiErp.Application.Dapper.ViewModels;
using NiTiErp.Utilities.Dtos;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace NiTiErp.Application.Dapper.Interfaces
{
    public interface IQDNghiHuuService
    {
        Task<PagedResult<QDNghiHuuViewModel>> GetAllNghiHuuPaging(string corporationId, string phongId, string keyword, int page, int pageSize,
            string hosoId, string hosoId2, string hosoId3, string nghihuuId, string parameters);

        Task<Boolean> QDNghiHuuAUD(QDNghiHuuViewModel nghihuu, string parameters);
    }
}
