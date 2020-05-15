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

        Task<GiayDiDuongViewModel> GetGiayDiDuong(long id);

        Task<List<GiayDiDuongViewModel>> GetCodeGiayDD(Guid codegiaydiduong);

        Task<bool> SaveXML(string giaydiduongXML, Guid code, string username);

    }
}
