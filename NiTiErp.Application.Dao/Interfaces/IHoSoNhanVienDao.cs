using System;
using System.Collections.Generic;
using System.Data;
using System.Text;

namespace NiTiErp.Application.Dao.Interfaces
{
    public interface IHoSoNhanVienDao
    {
        DataSet HoSoNhanVienGetList(string corporationId, string phongId, string keyword,
            string hosoId, string hosoId2, string hosoId3, string parameters);
    }
}
