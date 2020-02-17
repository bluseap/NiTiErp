using NiTiErp.Application.Dapper.ViewModels;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace NiTiErp.Application.Dapper.Interfaces
{
    public interface ILuongBaoHiemService
    {
        Task<List<LuongBaoHiemViewModel>> LuongBaoHiemGetList(Int64 luongbaohiemId, int nam, int thang, string corporationId, string phongId, string chucvuId,
            Guid hosoId, string hesoluongdanhmucId, string bacluongId, string ngayId1, string ngayId2,   string keyword, string parameters);

        Task<Boolean> LuongBaoHiemAUD(LuongBaoHiemViewModel luongbaohiemdm, string parameters);

        Task<Boolean> LuongBaoHiemAUDXML(LuongBaoHiemViewModel luongbaohiemdm, string parameters);

    }
}
