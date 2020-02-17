using NiTiErp.Application.Dapper.ViewModels;
using NiTiErp.Utilities.Dtos;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace NiTiErp.Application.Dapper.Interfaces
{
    public interface IQDNangNgachService
    {
        Task<PagedResult<QDNangNgachViewModel>> GetAllNangNgachPaging(string corporationId, string phongId, string keyword, int page, int pageSize,
            string hosoId, string hosoId2, string hosoId3, string nangngachId, string parameters);

        Task<List<QDNangNgachViewModel>> GetListNangNgachPaging(string corporationId, string phongId, string keyword, int page, int pageSize,
            string hosoId, string hosoId2, string hosoId3, string nangngachId, string parameters);

        Task<Boolean> QDNangNgachAUD(QDNangNgachViewModel khenthuong, string parameters);
    }
}
