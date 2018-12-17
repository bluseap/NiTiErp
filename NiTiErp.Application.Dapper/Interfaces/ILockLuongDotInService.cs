using System;
using System.Collections.Generic;
using System.Text;
using NiTiErp.Application.Dapper.ViewModels;
using System.Threading.Tasks;


namespace NiTiErp.Application.Dapper.Interfaces
{
    public interface ILockLuongDotInService
    {
        Task<List<LockLuongDotInViewModel>> LockLuongDotInGetList(int lockluongId, string corporationId, string dotinId, DateTime lockDate, bool IsLockLuongDotInKy,
            bool IsLockKhoiTao, string keyWord, string parameters);

        Task<Boolean> LockLuongDotInAUD(LockLuongDotInViewModel hesoluongdm, string parameters);

        Task<Boolean> LockLuongDotInAUDXML(LockLuongDotInViewModel lockluongVm, string parameters);

        Task<Boolean> LockLuongDotInKhoiTao(LockLuongDotInViewModel lockluongVm, string parameters);
       

    }
}
