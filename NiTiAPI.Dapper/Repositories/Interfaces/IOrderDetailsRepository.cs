using NiTiAPI.Dapper.ViewModels;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace NiTiAPI.Dapper.Repositories.Interfaces
{
    public interface IOrderDetailsRepository
    {
        Task<List<OrderDetailsViewModel>> GetListOrderDetails(long orderId, string languageId);

        Task<bool> CreateOrderDetailsXML(string lisetOrderXML, string userName, string languageId);
    }
}
