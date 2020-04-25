using NiTiErp.Application.Dapper.ViewModels;
using NiTiErp.Utilities.Dtos;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace NiTiErp.Application.Dapper.Interfaces
{
    public interface ISucKhoeService
    {
        Task<PagedResult<SucKhoeViewModel>> GetAllSucKhoePaging(int namKham, string corporationId, string phongId, string keyword, int page, int pageSize,
            string hosoId, string hosoId2, string suckhoeId, string parameters);

        Task<List<SucKhoeViewModel>> SucKhoeGetList(int namKham, string corporationId, string phongId, string keyword, string hosoId, string hosoId2, string suckhoeId, string parameters);

        //Task<IEnumerable<dynamic>> HoSoDataTable(string corporationId, string phongId, string keyword, string hosoId, string hosoId2, string hosoId3, string parameters);

        Task<Boolean> SucKhoeAUD(SucKhoeViewModel suckhoe, string parameters);
    }
}
