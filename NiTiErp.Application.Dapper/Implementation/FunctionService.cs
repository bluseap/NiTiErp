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

namespace NiTiErp.Application.Dapper.Implementation
{
    public class FunctionService : IFunctionService
    {
        private readonly IConfiguration _configuration;

        public FunctionService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task<IEnumerable<FunctionViewModel>> GetListFunctionCanParameters(bool canRead, 
            bool canCreate, bool canUpdate, bool canDelete, string roleId, string notes, string parameters)
        {
            using (var sqlConnection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                await sqlConnection.OpenAsync();
                var dynamicParameters = new DynamicParameters();

                dynamicParameters.Add("@canRead", canRead);
                dynamicParameters.Add("@canCreate", canCreate);
                dynamicParameters.Add("@canUpdate", canUpdate);
                dynamicParameters.Add("@canDelete", canDelete);
                dynamicParameters.Add("@roleId", roleId);
                dynamicParameters.Add("@notes", notes); 
                dynamicParameters.Add("@parameters", parameters);

                try
                {
                    return await sqlConnection.QueryAsync<FunctionViewModel>(
                        "GetListFunctionCanParameters", dynamicParameters, commandType: CommandType.StoredProcedure);
                }
                catch (Exception ex)
                {
                    throw;
                }
            }

        }

        
    }
}
