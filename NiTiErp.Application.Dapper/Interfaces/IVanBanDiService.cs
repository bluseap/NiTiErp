using System;
using System.Collections.Generic;
using System.Text;
using NiTiErp.Application.Dapper.ViewModels;
using System.Threading.Tasks;
using NiTiErp.Utilities.Dtos;

namespace NiTiErp.Application.Dapper.Interfaces
{
    public interface IVanBanDiService
    {
        Task<Boolean> VanBanDiAUD(VanBanDiViewModel vanbandi, string parameters);

        long GetCountVanBanDi(string corporation, string parameter);

        //long GetCountVanBanUser(string corporation, string username, string parameter);

        Task<PagedResult<VanBanDiViewModel>> GetAllVanBanDiPaging(string corporationId, int vanbanlinhvucId,
    int vanbanloaiId, int vanbancoquanbanhanhId, DateTime ngaybanhanhvanbandi, DateTime ngaydicuavanban,
    int vanbandisoId, int sovanbandi, string sokyhieuvanbandi, string nguoikyvanbandi,
    bool isvanbandientu, int vanbandientuId, bool isphathanhvanbandi, DateTime ngayphathanhvanbandi,
    string noiphathanhvanban, Guid nguoiduyetvanbandi, int vanbankhanId, int vanbanmatId, bool islanhdaoxem,
    string ttchoxuly, string ttchoduyet, string ttchuaphathanh,
    string keyword, int page, int pageSize, Int64 vanbandenId, string tenfile, string ghichu, string parameters);

        Task<List<VanBanDiViewModel>> VanBanDiGetList(string corporationId, int vanbanlinhvucId,
    int vanbanloaiId, int vanbancoquanbanhanhId, DateTime ngaybanhanhvanbandi, DateTime ngaydicuavanban,
    int vanbandisoId, int sovanbandi, string sokyhieuvanbandi, string nguoikyvanbandi,
    bool isvanbandientu, int vanbandientuId, bool isphathanhvanbandi, DateTime ngayphathanhvanbandi,
    string noiphathanhvanban, Guid nguoiduyetvanbandi, int vanbankhanId, int vanbanmatId, bool islanhdaoxem,
    string ttchoxuly, string ttchoduyet, string ttchuaphathanh,
    string keyword, int page, int pageSize, Int64 vanbandenId, string tenfile, string ghichu, string parameters);


    }
}
