using System;
using System.Collections.Generic;
using System.Text;
using NiTiErp.Application.Dapper.ViewModels;
using System.Threading.Tasks;
using NiTiErp.Utilities.Dtos;

namespace NiTiErp.Application.Dapper.Interfaces
{
    public interface IVBAutocompleteService
    {
        Task<List<VBAutocompleteViewModel>> VBAutoGetList(string codeXL, string tenChucVu, 
            string tenNhanVien, string trichYeu, string ghiChu, string parameters);

    }
}
