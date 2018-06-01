using System;
using System.Collections.Generic;
using System.Text;
using NiTiErp.Application.Dapper.ViewModels;
using System.Threading.Tasks;

namespace NiTiErp.Application.Dapper.Interfaces
{
    public interface ITonGiaoService
    {
        Task<List<TonGiaoViewModel>> TonGiaoGetList(string bangId, string id2, string id3, string parameters);
    }
}
