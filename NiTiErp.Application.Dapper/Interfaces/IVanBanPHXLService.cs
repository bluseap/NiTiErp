using System;
using System.Collections.Generic;
using System.Text;
using NiTiErp.Application.Dapper.ViewModels;
using System.Threading.Tasks;
using NiTiErp.Utilities.Dtos;


namespace NiTiErp.Application.Dapper.Interfaces
{
    public interface IVanBanPHXLService
    {
        Task<Boolean> VanBanPHXLAUD(VanBanPHXLViewModel vbphxl, string parameters);

        Task<PagedResult<VanBanPHXLViewModel>> GetAllVanBanPHXLPaging(string tenphoihopxuly, 
            string keyword, int page, int pageSize, int phoihopxulyid, string ghichu, string parameters);

        Task<List<VanBanPHXLViewModel>> VanBanPHXLGetList(string bangId, string id2, string id3, string parameters);
    }
}
