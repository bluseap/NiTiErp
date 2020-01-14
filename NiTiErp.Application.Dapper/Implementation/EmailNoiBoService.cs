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
    public class EmailNoiBoService : IEmailNoiBoService
    {
        private readonly IConfiguration _configuration;

        public EmailNoiBoService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task<PagedResult<EmailNoiBoViewModel>> GetPagingNhan(string NguoiNhan, int pageIndex, int pageSize)
        {
            using (var sqlConnection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                await sqlConnection.OpenAsync();
                var dynamicParameters = new DynamicParameters();

                dynamicParameters.Add("@NguoiNhan", NguoiNhan);                

                try
                {
                    var hoso = await sqlConnection.QueryAsync<EmailNoiBoViewModel>(
                        "Get_EmailNoiBo_ByNguoiNhan", dynamicParameters, commandType: CommandType.StoredProcedure);

                    var query = hoso.AsQueryable();

                    int totalRow = query.Count();

                    query = query.OrderByDescending(x => x.CreateDate)
                        .Skip((pageIndex - 1) * pageSize).Take(pageSize);

                    var data = query.ToList();

                    var paginationSet = new PagedResult<EmailNoiBoViewModel>()
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

        public async Task<PagedResult<EmailNoiBoViewModel>> GetPagingGui(string NguoiGui, int pageIndex, int pageSize)
        {
            using (var sqlConnection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                await sqlConnection.OpenAsync();
                var dynamicParameters = new DynamicParameters();

                dynamicParameters.Add("@NguoiGui", NguoiGui);

                try
                {
                    var hoso = await sqlConnection.QueryAsync<EmailNoiBoViewModel>(
                        "Get_EmailNoiBo_ByNguoiGui", dynamicParameters, commandType: CommandType.StoredProcedure);

                    var query = hoso.AsQueryable();

                    int totalRow = query.Count();

                    query = query.OrderByDescending(x => x.CreateDate)
                        .Skip((pageIndex - 1) * pageSize).Take(pageSize);

                    var data = query.ToList();

                    var paginationSet = new PagedResult<EmailNoiBoViewModel>()
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

        public async Task<EmailNoiBoViewModel> GetByEmailNoiBoNhan(long id)
        {
            using (var sqlConnection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                await sqlConnection.OpenAsync();
                var dynamicParameters = new DynamicParameters();

                dynamicParameters.Add("@Id", id);                

                try
                {
                    var query = await sqlConnection.QueryAsync<EmailNoiBoViewModel>(
                        "Get_EmailNoiBo_ByEmailNoiBoNhanId", dynamicParameters, commandType: CommandType.StoredProcedure);
                    return query.Single();
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }

        public async Task<EmailNoiBoViewModel> GetByEmailNoiBo(long id)
        {
            using (var sqlConnection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                await sqlConnection.OpenAsync();
                var dynamicParameters = new DynamicParameters();

                dynamicParameters.Add("@Id", id);

                try
                {
                    var query = await sqlConnection.QueryAsync<EmailNoiBoViewModel>(
                        "Get_EmailNoiBo_ById", dynamicParameters, commandType: CommandType.StoredProcedure);
                    return query.Single();
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }

        public Boolean SentEmail(Guid CodeEmailNoiBoNhan, Guid CodeEmailNoiBoNhanFile, string NguoiGui, 
            string TieuDe, string NoiDung, DateTime CreateDate, string CreateBy)
        {
            using (var sqlConnection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                sqlConnection.OpenAsync();
                var dynamicParameters = new DynamicParameters();

                dynamicParameters.Add("@CodeEmailNoiBoNhan", CodeEmailNoiBoNhan); 
                dynamicParameters.Add("@CodeEmailNoiBoNhanFile", CodeEmailNoiBoNhanFile);
                dynamicParameters.Add("@NguoiGui", NguoiGui);
                dynamicParameters.Add("@TieuDe", TieuDe);
                dynamicParameters.Add("@NoiDung", NoiDung);

                dynamicParameters.Add("@CreateDate", CreateDate);
                dynamicParameters.Add("@CreateBy", CreateBy);

                try
                {
                    var query = sqlConnection.Query<EmailNoiBoViewModel>(
                        "Create_EmailNoiBo", dynamicParameters, commandType: CommandType.StoredProcedure);

                    return true;
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }

        public Boolean IsViewEmail(long emailNoiBoNhanId, string CreateBy)
        {
            using (var sqlConnection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                sqlConnection.OpenAsync();
                var dynamicParameters = new DynamicParameters();

                dynamicParameters.Add("@EmailNoiBoNhanId", emailNoiBoNhanId);               
                dynamicParameters.Add("@CreateBy", CreateBy);

                try
                {
                    var query = sqlConnection.Query<EmailNoiBoViewModel>(
                        "Update_EmailNoiBo_ByNhanIdViewEmail", dynamicParameters, commandType: CommandType.StoredProcedure);

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
