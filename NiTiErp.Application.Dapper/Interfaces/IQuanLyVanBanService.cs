using System;
using System.Collections.Generic;
using System.Text;
using NiTiErp.Application.Dapper.ViewModels;
using System.Threading.Tasks;
using NiTiErp.Utilities.Dtos;

namespace NiTiErp.Application.Dapper.Interfaces
{
    public interface IQuanLyVanBanService
    {
        Task<Boolean> QuanLyVanBanAUD(QuanLyVanBanViewModel qlvb, string parameters);

        Task<PagedResult<QuanLyVanBanViewModel>> GetAllQuanLyVanBanPaging(string makv, int namhinhthanh, string SoVaKyHieu, 
            DateTime thoigianbatdau, DateTime thoigianketthuc, decimal tongsovanban, decimal tongsotrang,
            string keyword, int page, int pageSize, long quanlyvanbanid, string ghichu, string parameters);

        Task<List<QuanLyVanBanViewModel>> QuanLyVanBanGetList(string makv, int namhinhthanh, string SoVaKyHieu,
            DateTime thoigianbatdau, DateTime thoigianketthuc, decimal tongsovanban, decimal tongsotrang,
            string keyword, int page, int pageSize, long quanlyvanbanid, string ghichu, string parameters);
    }
}
