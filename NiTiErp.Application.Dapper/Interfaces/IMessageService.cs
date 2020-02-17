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

        Task<List<MessageViewModel>> MessageGetList(string fromUser, string toUser, long Id,
            DateTime timeMessage, int totalBootomRow, string notes, string parameters);

        Task<PagedResult<MessageViewModel>> GetMessagePaging(string fromUser, string toUser,
            DateTime timeMessage, int totalBootomRow, string notes,
            string keyword, int page, int pageSize, long MessagesId, string ghichu, string parameters);


    }
}
