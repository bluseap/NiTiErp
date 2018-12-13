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
    public class LockLuongDotInService : ILockLuongDotInService
    {
        private readonly IConfiguration _configuration;

        public LockLuongDotInService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task<Boolean> LockLuongDotInAUD(LockLuongDotInViewModel lockluongVm, string parameters)
        {
            using (var sqlConnection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                await sqlConnection.OpenAsync();
                var dynamicParameters = new DynamicParameters();

                dynamicParameters.Add("@Id", lockluongVm.Id);

                dynamicParameters.Add("@IsLockLuongDotInKy", lockluongVm.IsLockLuongDotInKy);
                dynamicParameters.Add("@IsLockKhoiTao", lockluongVm.IsLockKhoiTao);

                dynamicParameters.Add("@CreateDate", lockluongVm.CreateDate);
                dynamicParameters.Add("@CreateBy", lockluongVm.CreateBy);
                dynamicParameters.Add("@UpdateDate", lockluongVm.UpdateDate);
                dynamicParameters.Add("@UpdateBy", lockluongVm.UpdateBy);

                dynamicParameters.Add("@parameters", parameters);
                try
                {
                    var query = await sqlConnection.QueryAsync<LockLuongDotInViewModel>(
                        "LockLuongDotInAUD", dynamicParameters, commandType: CommandType.StoredProcedure);
                    return true;
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }

        public async Task<Boolean> LockLuongDotInAUDXML(LockLuongDotInViewModel lockluongVm, string parameters)
        {
            using (var sqlConnection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                await sqlConnection.OpenAsync();
                var dynamicParameters = new DynamicParameters();

                dynamicParameters.Add("@StringXML", lockluongVm.StringXML);

                dynamicParameters.Add("@parameters", parameters);
                try
                {
                    var query = await sqlConnection.QueryAsync<LockLuongDotInViewModel>(
                        "LockLuongDotInAUDXML", dynamicParameters, commandType: CommandType.StoredProcedure);

                    return true;
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }

        public async Task<List<LockLuongDotInViewModel>> LockLuongDotInGetList(int lockluongId, string corporationId, string dotinId, DateTime lockDate, 
            bool IsLockLuongDotInKy, bool IsLockKhoiTao, string keyWord, string parameters)
        {
            using (var sqlConnection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                await sqlConnection.OpenAsync();
                var dynamicParameters = new DynamicParameters();

                dynamicParameters.Add("@Id", lockluongId);
                dynamicParameters.Add("@corporationId", corporationId);
                dynamicParameters.Add("@dotinId", dotinId);
                dynamicParameters.Add("@lockDate", lockDate);
                dynamicParameters.Add("@IsLockLuongDotInKy", IsLockLuongDotInKy);
                dynamicParameters.Add("@IsLockKhoiTao", IsLockKhoiTao);
                dynamicParameters.Add("@keyWord", keyWord);

                dynamicParameters.Add("@parameters", parameters);
                try
                {
                    var query = await sqlConnection.QueryAsync<LockLuongDotInViewModel>(
                        "LockLuongDotInGetList", dynamicParameters, commandType: CommandType.StoredProcedure);

                    return query.AsList();
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }

    }
}
