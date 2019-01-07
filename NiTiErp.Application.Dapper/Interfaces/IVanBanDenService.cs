using System;
using System.Collections.Generic;
using System.Text;
using NiTiErp.Application.Dapper.ViewModels;
using System.Threading.Tasks;
using NiTiErp.Utilities.Dtos;


namespace NiTiErp.Application.Dapper.Interfaces
{
    public interface IVanBanDenService
    {
        Task<Boolean> VanBanDenAUD(VanBanDenViewModel vanbanden, string parameters);

        Int32 GetCountVanBan(string corporation, string parameter);

        Task<PagedResult<VanBanDenViewModel>> GetAllVanBanDenPaging  ( string corporationId ,	int vanbanlinhvucId ,
    int vanbanloaiId ,    int vanbancoquanbanhanhId ,	DateTime ngaybanhanhvanbanden ,    DateTime ngaydencuavanban ,
    int vanbandensoId ,    int sovanbanden ,		string sokyhieuvanbanden ,	string nguoikyvanbanden ,
	bool isvanbandientu ,    int vanbandientuId ,	bool isphathanhvanbanden ,    DateTime ngayphathanhvanbanden ,
	string noiphathanhvanban ,	Guid nguoiduyetvanbanden , int vanbankhanId,  int vanbanmatId ,   bool islanhdaoxem ,
    string ttxuly ,  string ttduyet ,  string ttdangxuly,
    string keyword, int page, int pageSize, Int64 vanbandenId, string tenfile, string ghichu, string parameters);

        Task<List<VanBanDenViewModel>> VanBanDennGetList(string corporationId, int vanbanlinhvucId,
    int vanbanloaiId, int vanbancoquanbanhanhId, DateTime ngaybanhanhvanbanden, DateTime ngaydencuavanban,
    int vanbandensoId, int sovanbanden, string sokyhieuvanbanden, string nguoikyvanbanden,
    bool isvanbandientu, int vanbandientuId, bool isphathanhvanbanden, DateTime ngayphathanhvanbanden,
    string noiphathanhvanban, Guid nguoiduyetvanbanden, int vanbankhanId, int vanbanmatId, bool islanhdaoxem,
    string ttxuly, string ttduyet, string ttdangxuly,
    string keyword, int page, int pageSize, Int64 vanbandenId, string tenfile, string ghichu, string parameters);

    }
}
