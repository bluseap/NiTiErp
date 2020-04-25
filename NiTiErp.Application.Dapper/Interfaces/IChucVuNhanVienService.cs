using System;
using System.Collections.Generic;
using System.Text;
using NiTiErp.Application.Dapper.ViewModels;
using System.Threading.Tasks;
using NiTiErp.Utilities.Dtos;

namespace NiTiErp.Application.Dapper.Interfaces
{
    public interface IChucVuNhanVienService
    {

        Task<Boolean> ChucVuNhanVienAUD(ChucVuNhanVienViewModel chucvu, string parameters);

        Task<PagedResult<ChucVuNhanVienViewModel>> GetAllChucVuPaging(string corporationId, string phongId, string keyword, int page, int pageSize,
            string hosoId, string hosoId2, string hosoId3, string chucvuId, string parameters);

        Task<List<ChucVuNhanVienViewModel>> ChucVuNhanVienGetList(string bangId, string id2, string id3, string parameters);
    }
}
