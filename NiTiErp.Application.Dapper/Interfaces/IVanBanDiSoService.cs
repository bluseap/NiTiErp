using System;
using System.Collections.Generic;
using System.Text;
using NiTiErp.Application.Dapper.ViewModels;
using System.Threading.Tasks;
using NiTiErp.Utilities.Dtos;

namespace NiTiErp.Application.Dapper.Interfaces
{
    public interface IVanBanDiSoService
    {
        Task<Boolean> VanBanDiSoAUD(VanBanDiSoViewModel vanbandiso, string parameters);

        Task<PagedResult<VanBanDiSoViewModel>> GetAllVanBanDiSoPaging(int nam, string corporationId, int vanbandiid,
            string keyword, int page, int pageSize, string ghichu, string parameters);

        Task<List<VanBanDiSoViewModel>> VanBanDiSoGetList(string corporationid, int nam, string keyword,
            int vanbandiid, string ghichu, string parameters);

        Task<List<VanBanDiViewModel>> VBDiSoExcel(string corporationid, DateTime tungay,
           DateTime denngay, string trangthai, string ghichu, string makv, string parameters);
    }
}
