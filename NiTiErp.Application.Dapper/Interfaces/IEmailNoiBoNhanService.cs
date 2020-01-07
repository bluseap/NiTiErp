using NiTiErp.Application.Dapper.ViewModels;
using NiTiErp.Utilities.Dtos;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace NiTiErp.Application.Dapper.Interfaces
{
    public interface IEmailNoiBoNhanService
    {
        Task<PagedResult<EmailNoiBoNhanViewModel>> GetPaging(Guid CodeEmailNoiBoNhan,
            Guid NguoiNhan, int pageIndex, int pageSize);

        Boolean AddEmailNguoiNhan(Guid CodeEmailNoiBoNhan, Guid NguoiNhan,
            DateTime CreateDate, string CreateBy);
    }
}
