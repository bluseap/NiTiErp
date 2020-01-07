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
    public class EmailNoiBoNhanFileService : IEmailNoiBoNhanFileService
    {
        private readonly IConfiguration _configuration;

        public EmailNoiBoNhanFileService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task<PagedResult<EmailNoiBoNhanFileViewModel>> GetPagingByCodeNhanFile(
            Guid CodeEmailNoiBoNhanFile, int pageIndex, int pageSize)
        {
            using (var sqlConnection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                await sqlConnection.OpenAsync();
                var dynamicParameters = new DynamicParameters();

                dynamicParameters.Add("@CodeEmailNoiBoNhanFile", CodeEmailNoiBoNhanFile);               

                try
                {
                    var hoso = await sqlConnection.QueryAsync<EmailNoiBoNhanFileViewModel>(
                        "Get_EmailNoiBoNhanFile_ByNoiBoNhanFile", dynamicParameters, commandType: CommandType.StoredProcedure);

                    var query = hoso.AsQueryable();

                    int totalRow = query.Count();

                    query = query.OrderByDescending(x => x.CreateDate)
                        .Skip((pageIndex - 1) * pageSize).Take(pageSize);

                    var data = query.ToList();

                    var paginationSet = new PagedResult<EmailNoiBoNhanFileViewModel>()
                    {
                        Results = data,
                        CurrentPage = pageIndex,
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

        public Boolean AddEmailNhanFileByCodeNhanFile(Guid CodeEmailNoiBoNhanFile, 
            string TenFile, string DuongDan, DateTime CreateDate, string CreateBy)
        {
            using (var sqlConnection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                sqlConnection.OpenAsync();
                var dynamicParameters = new DynamicParameters();

                dynamicParameters.Add("@CodeEmailNoiBoNhanFile", CodeEmailNoiBoNhanFile);
                dynamicParameters.Add("@TenFile", TenFile);
                dynamicParameters.Add("@DuongDan", DuongDan);

                dynamicParameters.Add("@CreateDate", CreateDate);
                dynamicParameters.Add("@CreateBy", CreateBy);               
                
                try
                {
                    var query = sqlConnection.Query<EmailNoiBoNhanFileViewModel>(
                        "Create_EmailNoiBoNhanFile_ByCodeNhanFile", dynamicParameters, commandType: CommandType.StoredProcedure);

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
