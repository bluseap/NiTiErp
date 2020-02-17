using NiTiErp.Application.Dapper.ViewModels;
using NiTiErp.Utilities.Dtos;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace NiTiErp.Application.Dapper.Interfaces
{
    public interface IHinhThucKyLuatService
    {
        Task<List<HinhThucKyLuatViewModel>> HinhThucKyLuatGetList(string bangId, string id2, string id3, string parameters);
    }
}
