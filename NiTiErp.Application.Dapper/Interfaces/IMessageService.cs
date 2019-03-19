using System;
using System.Collections.Generic;
using System.Text;
using NiTiErp.Application.Dapper.ViewModels;
using System.Threading.Tasks;
using NiTiErp.Utilities.Dtos;

namespace NiTiErp.Application.Dapper.Interfaces
{
    public interface IMessageService
    {
        Task<Boolean> MessageAUD(MessageViewModel message, string parameters);

        Task<List<MessageViewModel>> MessageGetList(Guid fromUser, Guid toUser, long Id,
            DateTime timeMessage, int totalBootomRow, string notes, string parameters);

        //Task<PagedResult<MessageViewModel>> GetAllVanBanPHXLPaging(string tenphoihopxuly,
        //    string keyword, int page, int pageSize, int phoihopxulyid, string ghichu, string parameters);


    }
}
