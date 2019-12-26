using System;
using System.Collections.Generic;
using System.Text;
using NiTiErp.Application.Dapper.ViewModels;
using System.Threading.Tasks;
using NiTiErp.Utilities.Dtos;

namespace NiTiErp.Application.Dapper.Interfaces
{
    public interface IVanBanDenXuLyService
    {
        Task<Boolean> VanBanDenXuLyAUD(VanBanDenXuLyViewModel vanbandenxuly, string parameters);

        Task<List<VanBanDenXuLyViewModel>> VanBanDenXuLyGetId(long id, long vanbandenduyetId,
            Guid hosonhanvienxulyId, string tennhanvienxuly, DateTime tungaynhan, DateTime denngaynhan,
            DateTime tungayxuly, DateTime denngayxuly, string ghichu, bool IsXemDeBiet,
            bool IsChuyenLanhDao, bool IsSaiXuLy, bool IsSaiChuyenLanhDao, bool IsLanhDaoXem,
            string keyword, string parameters);
    }
}
