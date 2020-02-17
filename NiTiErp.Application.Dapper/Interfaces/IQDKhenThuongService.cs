using NiTiErp.Application.Dapper.ViewModels;
using NiTiErp.Utilities.Dtos;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace NiTiErp.Application.Dapper.Interfaces
{
    public interface IQDKhenThuongService
    {
        Task<PagedResult<QDKhenThuongViewModel>> GetAllKhenThuongPaging(string corporationId, string phongId, string keyword, int page, int pageSize,
            string hosoId, string hosoId2, string hosoId3, string khenthuongId, string parameters);

        Task<List<QDKhenThuongViewModel>> GetListKhenThuongPaging(string corporationId, string phongId, string keyword, int page, int pageSize,
            string hosoId, string hosoId2, string hosoId3, string khenthuongId, string parameters);

        Task<Boolean> QDKhenThuongAUD(QDKhenThuongViewModel khenthuong, string parameters);
    }
}
