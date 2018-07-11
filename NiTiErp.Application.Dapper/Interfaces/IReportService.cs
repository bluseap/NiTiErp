using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using NiTiErp.Application.Dapper.ViewModels;

namespace NiTiErp.Application.Dapper.Interfaces
{
    public interface IReportService
    {
        Task<IEnumerable<RevenueReportViewModel>> GetReportAsync(string fromDate, string toDate);

        Task<IEnumerable<RevenueReportViewModel>> SumHoSoNhanVienPara(string corporationId, string phongId, string chucvuId, string trinhdoId,
            string hosoId1, string hosoId2, string hosoId3, string tungay, string denngay, string parameters);
        
    }
}
