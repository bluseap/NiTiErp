using System;
using System.Collections.Generic;
using System.Text;
using NiTiErp.Application.Dapper.ViewModels;
using System.Threading.Tasks;
using NiTiErp.Utilities.Dtos;

namespace NiTiErp.Application.Dapper.Interfaces
{
    public interface IVanBanDenSoService
    {
        Task<Boolean> VanBanDenSoAUD(VanBanDenSoViewModel vanbandenso, string parameters);

        Task<PagedResult<VanBanDenSoViewModel>> GetAllVanBanDenSoPaging(int nam, string corporationId, int vanbandenid, 
            string keyword, int page, int pageSize, string ghichu, string parameters);

        Task<List<VanBanDenSoViewModel>> VanBanDenSoGetList(string corporationid, int nam, string keyword, 
            int vanbandenid, string ghichu, string parameters);

        Task<List<VanBanDenViewModel>> VBDenSoExcel(string corporationid, DateTime tungay,
            DateTime denngay, string trangthai, string ghichu, string makv, string parameters);

    }
}
