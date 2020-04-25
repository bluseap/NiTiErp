using System;
using System.Collections.Generic;
using System.Text;
using NiTiErp.Application.Dapper.ViewModels;
using System.Threading.Tasks;
using NiTiErp.Utilities.Dtos;

namespace NiTiErp.Application.Dapper.Interfaces
{
    public interface IVanBanDenDuyetNVXLService
    {
        Task<Boolean> VanBanDenDuyetNVXLAUD(VanBanDenDuyetNVXLViewModel vanbandenduyetnvxl, string parameters);

        Task<List<VanBanDenDuyetNVXLViewModel>> VanBanDenDuyetNVXLAUDList(VanBanDenDuyetNVXLViewModel vanbandenduyetnvxl, string parameters);

        Task<PagedResult<VanBanDenDuyetNVXLViewModel>> GetAllVBDDNVXLPaging(long vanbandenid, long vanbandenduyetid, Guid hosonhanvienid,
            int vbphoihopxulyid, DateTime ngaynhanvanban,
            string keyword, int page, int pageSize, int vanbandenduyetnvxlid, string ghichu, string parameters);

        Task<List<VanBanDenDuyetNVXLViewModel>> VBDDNVXLGetList(long vanbandenid, long vanbandenduyetid, Guid hosonhanvienid,
            int vbphoihopxulyid, DateTime ngaynhanvanban,
            string keyword, int vanbandenduyetnvxlid, string ghichu, string parameters);
    }
}
