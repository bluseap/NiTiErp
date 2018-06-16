using NiTiErp.Utilities.Dtos;
using System;
using System.Collections.Generic;
using System.Text;
using NiTiErp.Application.Dapper.ViewModels;
using System.Threading.Tasks;

namespace NiTiErp.Application.Dapper.Interfaces
{
    public interface IDangDoanService
    {
        Task<PagedResult<DangDoanViewModel>> GetAllDangDoanPaging(string corporationId, string phongId, string keyword, int page, int pageSize,
            string hosoId, string hosoId2, string hosoId3, string dangId, string doanId, string congdoanId, 
            string cachmangId, string quandoiId, string parameters);

        Task<Boolean> DangDoanAUD(DangDoanViewModel dangdoan, string parameters);

    }
}
