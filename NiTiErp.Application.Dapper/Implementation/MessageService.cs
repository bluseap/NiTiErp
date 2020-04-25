using System;
using System.Collections.Generic;
using System.Text;

using Dapper;
using Microsoft.Extensions.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Threading.Tasks;
using NiTiErp.Application.Dapper.Interfaces;
using NiTiErp.Application.Dapper.ViewModels;
using NiTiErp.Utilities.Dtos;
using System.Linq;

namespace NiTiErp.Application.Dapper.Implementation
{
    public class MessageService : IMessageService
    {
        private readonly IConfiguration _configuration;

        public MessageService(IConfiguration configuration)
        {
            _configuration = configuration;
        }        

        public async Task<Boolean> MessageAUD(MessageViewModel message, string parameters)
        {
            using (var sqlConnection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                await sqlConnection.OpenAsync();
                var dynamicParameters = new DynamicParameters();

                dynamicParameters.Add("@Id", message.Id);

                dynamicParameters.Add("@FormAppUserId", message.FormAppUserId);
                dynamicParameters.Add("@ToAppUserId", message.ToAppUserId);
                dynamicParameters.Add("@RoomId", message.RoomId);
                dynamicParameters.Add("@TextMessage", message.TextMessage);
                dynamicParameters.Add("@TimeMessage", message.TimeMessage);
                dynamicParameters.Add("@Color", message.Color);
                dynamicParameters.Add("@Notes", message.Notes);
                dynamicParameters.Add("@Status", message.Status);                

                dynamicParameters.Add("@CreateBy", message.CreateBy);
                dynamicParameters.Add("@CreateDate", message.CreateDate);
                dynamicParameters.Add("@UpdateDate", message.UpdateDate);
                dynamicParameters.Add("@UpdateBy", message.UpdateBy);

                dynamicParameters.Add("@parameters", parameters);
                try
                {
                    var query = await sqlConnection.QueryAsync<MessageViewModel>(
                        "MessagesAUD", dynamicParameters, commandType: CommandType.StoredProcedure);

                    return true;
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }

        public async Task<List<MessageViewModel>> MessageGetList(string fromUser, string toUser, long Id,
            DateTime timeMessage, int totalBootomRow, string notes, string parameters)
        {
            using (var sqlConnection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                await sqlConnection.OpenAsync();
                var dynamicParameters = new DynamicParameters();

                dynamicParameters.Add("@Id", Id);
                dynamicParameters.Add("@FormAppUserId", fromUser);
                dynamicParameters.Add("@ToAppUserId", toUser);

                dynamicParameters.Add("@TimeMessage", timeMessage);
                dynamicParameters.Add("@totalBootomRow", totalBootomRow);
                dynamicParameters.Add("@notes", notes);

                dynamicParameters.Add("@parameters", parameters);
                try
                {
                    var query = await sqlConnection.QueryAsync<MessageViewModel>(
                        "MessagesGetList", dynamicParameters, commandType: CommandType.StoredProcedure);                  
                    return query.AsList();
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }

        public async Task<PagedResult<MessageViewModel>> GetMessagePaging(string fromUser, string toUser,
            DateTime timeMessage, int totalBootomRow, string notes,
            string keyword, int page, int pageSize, long MessagesId, string ghichu, string parameters)
        {
            using (var sqlConnection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                await sqlConnection.OpenAsync();
                var dynamicParameters = new DynamicParameters();

                dynamicParameters.Add("@Id", MessagesId);
                dynamicParameters.Add("@FormAppUserId", fromUser);
                dynamicParameters.Add("@ToAppUserId", toUser);

                dynamicParameters.Add("@TimeMessage", timeMessage);
                dynamicParameters.Add("@totalBootomRow", totalBootomRow);
                dynamicParameters.Add("@notes", notes);

                dynamicParameters.Add("@parameters", parameters);
                try
                {
                    var hoso = await sqlConnection.QueryAsync<MessageViewModel>(
                        "MessagesGetList", dynamicParameters, commandType: CommandType.StoredProcedure);

                    var query = hoso.AsQueryable();

                    int totalRow = query.Count();

                    query = query.OrderByDescending(x => x.CreateDate)
                        .Skip((page - 1) * pageSize).Take(pageSize);

                    var data = query.ToList();

                    var paginationSet = new PagedResult<MessageViewModel>()
                    {
                        Results = data,
                        CurrentPage = page,
                        RowCount = totalRow,
                        PageSize = pageSize
                    };
                    return paginationSet;
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }

    }
}
