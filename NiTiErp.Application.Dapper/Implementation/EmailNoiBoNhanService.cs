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
    public class EmailNoiBoNhanService : IEmailNoiBoNhanService
    {
        private readonly IConfiguration _configuration;

        public EmailNoiBoNhanService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task<PagedResult<EmailNoiBoNhanViewModel>> GetPaging(Guid CodeEmailNoiBoNhan,
            Guid NguoiNhan, int pageIndex, int pageSize)
        {
            using (var sqlConnection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                await sqlConnection.OpenAsync();
                var dynamicParameters = new DynamicParameters();

                dynamicParameters.Add("@CodeEmailNoiBoNhan", CodeEmailNoiBoNhan);
                dynamicParameters.Add("@NguoiNhan", NguoiNhan);

                try
                {
                    var hoso = await sqlConnection.QueryAsync<EmailNoiBoNhanViewModel>(
                        "Get_EmailNoiBoNhan_ByNoiBoNguoiNhan", dynamicParameters, commandType: CommandType.StoredProcedure);

                    var query = hoso.AsQueryable();

                    int totalRow = query.Count();

                    query = query.OrderByDescending(x => x.CreateDate)
                        .Skip((pageIndex - 1) * pageSize).Take(pageSize);

                    var data = query.ToList();

                    var paginationSet = new PagedResult<EmailNoiBoNhanViewModel>()
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

        public int GetEmailCountByNguoiNhan(string nguoinhan)
        {  
            using (var sqlConnection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                sqlConnection.Open();

                var paramaters = new DynamicParameters();

                paramaters.Add("@AppUserName", nguoinhan);
                
                try
                {
                    var query = sqlConnection.Query<EmailNoiBoNhanViewModel>
                        ("Get_EmailNoiBoNhan_ByAppUserNameCountNoView", paramaters, commandType: CommandType.StoredProcedure);

                    return query.Count();
                }
                catch (Exception ex)
                {
                    throw ex;
                }

            }
        }

        public Boolean AddEmailNguoiNhan(Guid CodeEmailNoiBoNhan, Guid NguoiNhan,
            DateTime CreateDate, string CreateBy)
        {
            using (var sqlConnection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                sqlConnection.OpenAsync();
                var dynamicParameters = new DynamicParameters();

                dynamicParameters.Add("@CodeEmailNoiBoNhan", CodeEmailNoiBoNhan);
                dynamicParameters.Add("@NguoiNhan", NguoiNhan);

                dynamicParameters.Add("@CreateDate", CreateDate);
                dynamicParameters.Add("@CreateBy", CreateBy);

                try
                {
                    var query = sqlConnection.Query<EmailNoiBoNhanViewModel>(
                        "Create_EmailNoiBoNhan", dynamicParameters, commandType: CommandType.StoredProcedure);

                    return true;
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }

        public Boolean DeleteEmailNhanById(long Id, DateTime CreateDate, string CreateBy)
        {
            using (var sqlConnection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                sqlConnection.OpenAsync();
                var dynamicParameters = new DynamicParameters();

                dynamicParameters.Add("@Id", Id);

                dynamicParameters.Add("@UpdateDate", CreateDate);
                dynamicParameters.Add("@UpdateBy", CreateBy);

                try
                {
                    var query = sqlConnection.Query<EmailNoiBoNhanViewModel>(
                        "Delete_EmailNoiBoNhan_ById", dynamicParameters, commandType: CommandType.StoredProcedure);

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
