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
    public class RegisterDocService : IRegisterDocService
    {
        private readonly string _connectionString;

        public RegisterDocService(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DbConnectionStringErp");
        }

        public async Task<RegisterDocViewModel> GetById(long id)
        {
            using (var conn = new SqlConnection(_connectionString))
            {
                if (conn.State == System.Data.ConnectionState.Closed)
                    conn.Open();
                var paramaters = new DynamicParameters();
                paramaters.Add("@id", id);

                var result = await conn.QueryAsync<RegisterDocViewModel>("Get_RegisterDoc_ById", paramaters, null, null, System.Data.CommandType.StoredProcedure);
                return result.Single();
            }
        }

        public async Task<PagedResult<RegisterDocViewModel>> GetAllPagingRegister(int corporationId,
            string keyword, int pageIndex, int pageSize)
        {
            using (var conn = new SqlConnection(_connectionString))
            {
                if (conn.State == System.Data.ConnectionState.Closed)
                    conn.Open();
                var paramaters = new DynamicParameters();
                paramaters.Add("@corporationId", corporationId);
                paramaters.Add("@keyword", keyword);
                paramaters.Add("@pageIndex", pageIndex);
                paramaters.Add("@pageSize", pageSize);

                paramaters.Add("@totalRow", dbType: System.Data.DbType.Int32, direction: System.Data.ParameterDirection.Output);

                var result = await conn.QueryAsync<RegisterDocViewModel>("Get_RegisterDoc_AllPaging", paramaters, null, null, System.Data.CommandType.StoredProcedure);

                int totalRow = paramaters.Get<int>("@totalRow");

                var pagedResult = new PagedResult<RegisterDocViewModel>()
                {
                    Results = result.ToList(),
                    CurrentPage = pageIndex,
                    RowCount = totalRow,
                    PageSize = pageSize
                };
                return pagedResult;
            }
        }

    }
}
