using System;
using System.Collections.Generic;
using System.Text;
using NiTiErp.Application.Dapper.ViewModels;
using System.Threading.Tasks;
using NiTiErp.Utilities.Dtos;

namespace NiTiErp.Application.Dapper.Interfaces
{
    public interface IVanBanNhomXuLyService
    {
        Task<Boolean> VanBanNhomXuLyAUD(VanBanNhomXuLyViewModel vanbancoquan, string parameters);

        Task<PagedResult<VanBanNhomXuLyViewModel>> GetAllVanBanNhomXuLyPaging(string tennhom, Guid hosonhanvienId,
            string keyword, int page, int pageSize, int vanbannhomxulyid, string ghichu, string parameters);

        Task<List<VanBanNhomXuLyViewModel>> VanBanNhomXuLyGetList(string tennhom, Guid hosonhanvienId,
            string keyword,  int vanbannhomxulyid, string ghichu, string parameters);

    }
}
