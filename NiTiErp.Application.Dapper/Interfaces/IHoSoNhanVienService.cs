using System;
using System.Collections.Generic;
using System.Text;
using NiTiErp.Application.Dapper.ViewModels;
using System.Threading.Tasks;
using NiTiErp.Utilities.Dtos;

namespace NiTiErp.Application.Dapper.Interfaces
{
    public interface IHoSoNhanVienService
    {
        Task<PagedResult<HoSoNhanVienViewModel>> GetAllHoSoNhanVienPaging(string corporationId, string phongId, string keyword, int page, int pageSize, 
            string hosoId, string hosoId2, string hosoId3, string parameters);

        Task<List<HoSoNhanVienViewModel>> HoSoNhanVienGetList(string corporationId, string id2, string id3, string parameters);
        
        Task<Boolean> HoSoNhanVienAUD(HoSoNhanVienViewModel hosonhanvien, string parameters);        

        //bool UpdateHoSoNhanVien(HoSoNhanVienViewModel hosonhanvien);

        //bool DeleteHoSoNhanVien(HoSoNhanVienViewModel hosonhanvien);

    }
}
