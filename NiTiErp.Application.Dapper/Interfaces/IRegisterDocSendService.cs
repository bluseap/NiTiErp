using NiTiErp.Application.Dapper.ViewModels;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace NiTiErp.Application.Dapper.Interfaces
{
    public interface IRegisterDocSendService
    {
        Task<bool> CreateRegisterDocSendVBDDId(long vanbandenduyetId, string firebasenotifiId, string createBy);
    }
}
