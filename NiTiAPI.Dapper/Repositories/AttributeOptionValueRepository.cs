using Dapper;
using Microsoft.Extensions.Configuration;
using NiTiAPI.Dapper.Repositories.Interfaces;
using NiTiAPI.Dapper.ViewModels;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Text;
using System.Threading.Tasks;

namespace NiTiAPI.Dapper.Repositories
{
    public class AttributeOptionValueRepository : IAttributeOptionValueRepository
    {
        private readonly string _connectionString;

        public AttributeOptionValueRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DbConnectionString");
        }       

        public async Task<List<AttributeOptionValueViewModel>> GetListByAttribute(int attributeId, string language)
        {
            using (var conn = new SqlConnection(_connectionString))
            {
                if (conn.State == System.Data.ConnectionState.Closed)
                    conn.Open();
                var paramaters = new DynamicParameters();
                paramaters.Add("@attributeId", attributeId);
                paramaters.Add("@language", language);

                var result = await conn.QueryAsync<AttributeOptionValueViewModel>("Get_AttributeOptionValue_ByAttributeId",
                    paramaters, null, null, System.Data.CommandType.StoredProcedure);
                return result.AsList();
            }
        }

    }
}
