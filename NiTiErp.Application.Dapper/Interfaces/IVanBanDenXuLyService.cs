using System;
using System.Collections.Generic;
using System.Text;
using NiTiErp.Application.Dapper.ViewModels;
using System.Threading.Tasks;
using NiTiErp.Utilities.Dtos;

namespace NiTiErp.Application.Dapper.Interfaces
{
    public interface IVanBanDenXuLyService
    {
        Task<Boolean> VanBanDenXuLyAUD(VanBanDenXuLyViewModel vanbandenxuly, string parameters);
    }
}
