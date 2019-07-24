using Dapper;
using Microsoft.Extensions.Configuration;
using NiTiAPI.Dapper.Repositories.Interfaces;
using NiTiAPI.Dapper.ViewModels;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Text;
using System.Threading.Tasks;

namespace NiTiAPI.Dapper.Repositories
{
    public class OrderRepository : IOrderRepository
    {
        private readonly string _connectionString;

        public OrderRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DbConnectionString");
        }

        public async Task<bool> CreateOrder(string orderXML, string CreateBy)
        {
            using (var conn = new SqlConnection(_connectionString))
            {
                if (conn.State == System.Data.ConnectionState.Closed)
                    conn.Open();

                var paramaters = new DynamicParameters();

                paramaters.Add("@orderXML", orderXML);
                paramaters.Add("@CreateBy", CreateBy); 

                try
                {
                    await conn.QueryAsync<OrderViewModel>(
                        "Create_OrderXML", paramaters, commandType: CommandType.StoredProcedure);
                    return true;
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }

    }
}
