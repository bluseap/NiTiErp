using NiTiErp.Utilities.Dtos;
using System;
using System.Collections.Generic;
using System.Text;
using NiTiErp.Application.Dapper.ViewModels;
using System.Threading.Tasks;

namespace NiTiErp.Application.Dapper.Interfaces
{
    public interface IHopDongService
    {
        Task<PagedResult<HopDongViewModel>> GetAllHopDongPaging(string corporationId, string phongId, string keyword, 
            int page, int pageSize, string hosoId, string hosoId2, string hosoId3, string hopdongId, string parameters);

        Task<PagedResult<HopDongViewModel>> GetAllHopDongDatePaging(string corporationId, string phongId, string keyword,
            int page, int pageSize, string hosoId, string hosoId2, string hosoId3,
            DateTime tungay, DateTime denngay, DateTime ngaynhap, string dieukien,
            string hopdongId, string parameters);

        Task<Boolean> HopDongAUD(HopDongViewModel hopdong, string parameters);
    }
}
