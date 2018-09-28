using Dapper;
using Microsoft.Extensions.Configuration;
using NiTiErp.Application.Dapper.Interfaces;
using NiTiErp.Application.Dapper.ViewModels;
using NiTiErp.Utilities.Dtos;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;

namespace NiTiErp.Application.Dapper.Implementation
{
    public class AppUserLoginService : IAppUserLoginService
    {

        private readonly IConfiguration _configuration;

        public AppUserLoginService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task<PagedResult<AppUserLoginViewModel>> GetAllAppUserPaging(string corporationId, string keyword, int page, int pageSize,
            string userId, string userName, string fullName, string parameters)
        {
            using (var sqlConnection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                await sqlConnection.OpenAsync();
                var dynamicParameters = new DynamicParameters();

                dynamicParameters.Add("@corporationId", corporationId);               
                dynamicParameters.Add("@keyword", keyword);
                dynamicParameters.Add("@userId", userId);
                dynamicParameters.Add("@userName", userName);
                dynamicParameters.Add("@fullName", fullName);

                dynamicParameters.Add("@parameters", parameters);
                try
                {
                    var appuser = await sqlConnection.QueryAsync<AppUserLoginViewModel>(
                        "AppUserLoginGetList", dynamicParameters, commandType: CommandType.StoredProcedure);

                    var query = appuser.AsQueryable();

                    int totalRow = query.Count();

                    query = query.OrderByDescending(x => x.CreateDate)
                        .Skip((page - 1) * pageSize).Take(pageSize);

                    var data = query.ToList();

                    var paginationSet = new PagedResult<AppUserLoginViewModel>()
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

        public async Task<List<AppUserLoginViewModel>> GetListAppUserPaging(string corporationId, string keyword, int page, int pageSize,
            string userId, string userName, string fullName, string parameters)
        {
            using (var sqlConnection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                await sqlConnection.OpenAsync();
                var dynamicParameters = new DynamicParameters();

                dynamicParameters.Add("@corporationId", corporationId);
                dynamicParameters.Add("@keyword", keyword);
                dynamicParameters.Add("@userId", userId);
                dynamicParameters.Add("@userName", userName);
                dynamicParameters.Add("@fullName", fullName);

                dynamicParameters.Add("@parameters", parameters);
                try
                {
                    var appuser = await sqlConnection.QueryAsync<AppUserLoginViewModel>(
                        "AppUserLoginGetList", dynamicParameters, commandType: CommandType.StoredProcedure);

                    return appuser.AsList();

                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }

        public async Task<Boolean> AppUserLoginAUD(AppUserLoginViewModel appuser, string parameters)
        {
            using (var sqlConnection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                await sqlConnection.OpenAsync();
                var dynamicParameters = new DynamicParameters();

                dynamicParameters.Add("@Id", appuser.Id);
                dynamicParameters.Add("@UserName", appuser.UserName);

                dynamicParameters.Add("@LoginIpAddress", appuser.LoginIpAddress);
                dynamicParameters.Add("@LoginIp", appuser.LoginIp);
                dynamicParameters.Add("@LoginNameIp", appuser.LoginNameIp);
                dynamicParameters.Add("@LoginIp6Address", appuser.LoginIp6Address);
                dynamicParameters.Add("@LoginLocalIp6Adress", appuser.LoginLocalIp6Adress);
                dynamicParameters.Add("@LoginMacIp", appuser.LoginMacIp);

                dynamicParameters.Add("@CreateDate", appuser.CreateDate);
                dynamicParameters.Add("@CreateBy", appuser.CreateBy);               

                dynamicParameters.Add("@parameters", parameters);
                try
                {
                    var query = await sqlConnection.QueryAsync<AppUserLoginViewModel>(
                        "AppUserLoginAUD", dynamicParameters, commandType: CommandType.StoredProcedure);

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
