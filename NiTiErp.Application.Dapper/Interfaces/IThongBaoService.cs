using NiTiErp.Application.Dapper.ViewModels;
using NiTiErp.Utilities.Dtos;
using System;
using System.Threading.Tasks;

namespace NiTiErp.Application.Dapper.Interfaces
{
    public interface IThongBaoService
    {
        Task<Boolean> ThongBaoAUD(ThongBaoViewModel thongbao, string parameters);

        Task<PagedResult<ThongBaoViewModel>> GetAllThongBaoPaging(string corporationId, string phongId, string keyword, int page, int pageSize,
            string hosoId, string hosoId2, string hosoId3, string thongbaoId, string noidat, string parameters);

        //Task<List<ThongBaoViewModel>> ThongBaoGetList(string bangId, string id2, string id3, string parameters);
    }
}