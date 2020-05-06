using System;
using System.Collections.Generic;
using System.Text;
using NiTiErp.Application.Dapper.ViewModels;
using System.Threading.Tasks;
using NiTiErp.Utilities.Dtos;

namespace NiTiErp.Application.Dapper.Interfaces
{
    public interface IGiayDiDuongService
    {
        Task<PagedResult<GiayDiDuongViewModel>> ListGiayDiDuongKVPhong(string khuvucId, string maphongIc, 
            string keyword, int page, int pageSize);

    }
}
