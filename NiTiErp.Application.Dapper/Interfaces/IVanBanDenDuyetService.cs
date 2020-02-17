using System;
using System.Collections.Generic;
using System.Text;
using NiTiErp.Application.Dapper.ViewModels;
using System.Threading.Tasks;
using NiTiErp.Utilities.Dtos;

namespace NiTiErp.Application.Dapper.Interfaces
{
    public interface IVanBanDenDuyetService
    {
        Task<Boolean> VanBanDenDuyetAUD(VanBanDenDuyetViewModel vanbandenduyet, string parameters);

        Task<List<VanBanDenDuyetViewModel>> VanBanDenDuyetGetId(long id, long vanbandenId,
            Guid hosonhanvienduyetId, string tennhanvienduyet, DateTime tungaynhan, DateTime denngaynhan,
            DateTime tungayduyet, DateTime denngayduyet, string butphelanhdao, bool isChuyenChuyenMon,
            int vanbanphoihopxulyId, int vanbannhomxulyId, bool issaiChuyenMon, bool isDuyetPhatHanh,
            int isDangXuLyXem, bool isXuLyXem, string keyWord, string ghiChu,
            string parameters);

    }
}
        