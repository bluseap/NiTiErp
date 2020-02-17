using NiTiErp.Application.Dapper.ViewModels;
using NiTiErp.Utilities.Dtos;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace NiTiErp.Application.Dapper.Interfaces
{
    public interface IVBDQuaTrinhXuLyService
    {

        Task<List<VBDQuaTrinhXuLyViewModel>> GetListVBDQuaTrinhXuLy(Guid hosonhanvienId, string corporationId, long vanbandenid,
            string keyword,  long vbdquatrinhxulyId, string ghichu, string parameters);


    }
}
