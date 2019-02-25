using NiTiErp.Application.Dapper.ViewModels;
using NiTiErp.Utilities.Dtos;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace NiTiErp.Application.Dapper.Interfaces
{
    public interface IVBDiQuaTrinhXuLyService
    {
        Task<List<VBDiQuaTrinhXuLyViewModel>> GetListVBDiQuaTrinhXuLy(Guid hosonhanvienId, string corporationId, long vanbandiid,
            string keyword, long vbdiquatrinhxulyId, string ghichu, string parameters);
    }
}
