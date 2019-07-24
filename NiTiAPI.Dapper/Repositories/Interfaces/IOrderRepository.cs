using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace NiTiAPI.Dapper.Repositories.Interfaces
{
    public interface IOrderRepository
    {
        Task<bool> CreateOrder(string orderXML, string CreateBy);
    }
}
