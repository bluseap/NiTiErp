using NiTiErp.Application.Dapper.ViewModels;
using NiTiErp.Utilities.Dtos;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace NiTiErp.Application.Dapper.Interfaces
{
    public interface IChiPhiLuongService
    {
        Task<PagedResult<ChiPhiLuongViewModel>> GetAllChiPhiLuongPaging(Int64 chiphitanggiamId, int nam, int thang, string corporationId
            , string phongdanhmucId, string keyword, Guid hosonhanvienId, int chiphiId, int luongdotinkyId, decimal tongtienchiphitanggiam
            , bool IsChiPhiTang, int ChiPhiLoaiId, int ChiPhiBangDanhMucId, bool IsChuyenKy, string ghichu, int page, int pageSize, string parameters);

        List<ChiPhiLuongViewModel> GetListChiPhiLuong(Int64 chiphitanggiamId, int nam, int thang, string corporationId
            , string phongdanhmucId, string keyword, Guid hosonhanvienId, int chiphiId, int luongdotinkyId, decimal tongtienchiphitanggiam
            , bool IsChiPhiTang, int ChiPhiLoaiId, int ChiPhiBangDanhMucId, bool IsChuyenKy, string ghichu, int page, int pageSize, string parameters);

        Task<List<ChiPhiLuongViewModel>> ChiPhiLuongListAUD(string Id, Guid HoSoNhanVienId, string userId, DateTime createDate, string parameters);

        Task<Boolean> ChiPhiTangGiamAUD(ChiPhiLuongViewModel chiphiluong, string parameters);

    }
}
