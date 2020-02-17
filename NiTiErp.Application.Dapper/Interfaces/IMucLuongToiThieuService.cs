using System;
using System.Collections.Generic;
using System.Text;
using NiTiErp.Application.Dapper.ViewModels;
using System.Threading.Tasks;
using NiTiErp.Utilities.Dtos;

namespace NiTiErp.Application.Dapper.Interfaces
{
    public interface IMucLuongToiThieuService
    {
        Task<PagedResult<MucLuongToiThieuViewModel>> GetAllMucLuongPaging(string corporationId, string phongId, string keyword, int page, int pageSize,
           string hosoId, string hosoId2, string hosoId3, string mucluongtoithieuId, string parameters);

        Task<Boolean> MucLuongTTAUD(MucLuongToiThieuViewModel mucluongtt, string parameters);

        //Task<List<MucLuongToiThieuViewModel>> MucLuongGetList(string corporationId, string id2, string id3, string parameters);
    }
}
