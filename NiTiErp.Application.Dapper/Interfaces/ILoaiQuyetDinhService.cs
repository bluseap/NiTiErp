using System;
using System.Collections.Generic;
using System.Text;
using NiTiErp.Application.Dapper.ViewModels;
using System.Threading.Tasks;

namespace NiTiErp.Application.Dapper.Interfaces
{
    public interface ILoaiQuyetDinhService
    {
        Task<List<LoaiQuyetDinhViewModel>> LoaiQuyetDinhGetList(string bangId, string id2, string id3, string parameters);
    }
}
