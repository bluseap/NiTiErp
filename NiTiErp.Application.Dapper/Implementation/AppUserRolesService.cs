using Dapper;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Text;
using System.Threading.Tasks;
using NiTiErp.Application.Dapper.Interfaces;
using NiTiErp.Application.Dapper.ViewModels;


namespace NiTiErp.Application.Dapper.Implementation
{
    public class AppUserRolesService : IAppUserRolesService
    {
        private readonly IConfiguration _configuration;

        public AppUserRolesService(IConfiguration configuration)
        {
            _configuration = configuration;
        }
       
        public async Task<IEnumerable<AppUserRolesViewModel>> RemoveFromRolesAsync(string roleId, string userId)
        {           

            using (var sqlConnection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                await sqlConnection.OpenAsync();
                var dynamicParameters = new DynamicParameters();

                dynamicParameters.Add("@RoleId", roleId);
                dynamicParameters.Add("@UserId", userId);

                try
                {
                    return await sqlConnection.QueryAsync<AppUserRolesViewModel>(
                        "RemoveFromRolesAsync", dynamicParameters, commandType: CommandType.StoredProcedure);
                }
                catch (Exception ex)
                {
                    throw;
                }
            }
            
        }
    }
}
