using System;
using System.Collections.Generic;
using System.Text;

using System.Threading.Tasks;
using NiTiErp.Application.Dapper.ViewModels;

namespace NiTiErp.Application.Dapper.Interfaces
{
    public interface IFunctionService
    {
        Task<IEnumerable<FunctionViewModel>> GetListFunctionCanParameters(bool canRead, bool canCreate, 
            bool canUpdate, bool canDelete, string roleId, string notes, string parameters);
    }
}
