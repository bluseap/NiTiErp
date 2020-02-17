using NiTiErp.Application.Dapper.ViewModels;
using NiTiErp.Utilities.Dtos;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace NiTiErp.Application.Dapper.Interfaces
{
    public interface ISucKhoeNoiKhamService
    {
        Task<PagedResult<SucKhoeNoiKhamViewModel>> GetAllSucKhoeNoiKhamPaging(string noikhamId, string keyword, int page, int pageSize,
            string noikhamId2, string tennoikham, int status,  string parameters);

        Task<List<SucKhoeNoiKhamViewModel>> SucKhoeNoiKhamGetList(string noikhamId, string keyword, int page, int pageSize,
            string noikhamId2, string tennoikham, int status, string parameters);
               
        Task<Boolean> SucKhoeNoiKhamAUD(SucKhoeNoiKhamViewModel suckhoe, string parameters);
    }
}
