using NiTiErp.Application.Dapper.ViewModels;
using NiTiErp.Utilities.Dtos;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace NiTiErp.Application.Dapper.Interfaces
{
    public interface IEmailNoiBoService
    {
        Task<PagedResult<EmailNoiBoViewModel>> GetPagingNhan(string NguoiNhan, int pageIndex, int pageSize);

        Task<EmailNoiBoViewModel> GetByEmailNoiBoNhan(long id);

        Boolean SentEmail(Guid CodeEmailNoiBoNhan, Guid CodeEmailNoiBoNhanFile, string NguoiGui,
            string TieuDe, string NoiDung, DateTime CreateDate, string CreateBy);

        Boolean IsViewEmail(long emailNoiBoNhanId, string CreateBy);

    }
}
