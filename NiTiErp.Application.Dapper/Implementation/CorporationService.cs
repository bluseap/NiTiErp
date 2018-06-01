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
    public class CorporationService : ICorporationService
    {
        private readonly IConfiguration _configuration;

        public CorporationService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task<List<CorporationViewModel>> CorporationGetList(string corporationServiceId, string id2, string id3, string parameters)
        {
            using (var sqlConnection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                await sqlConnection.OpenAsync();
                var dynamicParameters = new DynamicParameters();

                dynamicParameters.Add("@corporationServiceId", corporationServiceId);
                dynamicParameters.Add("@id2", id2);
                dynamicParameters.Add("@id3", id3);
                dynamicParameters.Add("@parameters", parameters);

                try
                {
                    var query = await sqlConnection.QueryAsync<CorporationViewModel>(
                        "CorporationGetList", dynamicParameters, commandType: CommandType.StoredProcedure);

                    return query.AsList();                    
                }
                catch (Exception ex)
                {
                    throw;
                }
            }
        }


    }
}
