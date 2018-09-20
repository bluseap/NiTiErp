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
    public class DaoTaoNoiService : IDaoTaoNoiService
    {
        private readonly IConfiguration _configuration;

        public DaoTaoNoiService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task<PagedResult<DaoTaoNoiViewModel>> GetAllDaoTaoNoiPaging(int daotaonoiId, string keyword, int page, int pageSize,
            string daotaonoiId2, int status, string parameters)
        {
            using (var sqlConnection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                await sqlConnection.OpenAsync();
                var dynamicParameters = new DynamicParameters();

                dynamicParameters.Add("@daotaonoiId", daotaonoiId);                
                dynamicParameters.Add("@keyword", keyword);
                dynamicParameters.Add("@daotaonoiId2", daotaonoiId2);
                dynamicParameters.Add("@status", status);

                dynamicParameters.Add("@parameters", parameters);
                try
                {
                    var hoso = await sqlConnection.QueryAsync<DaoTaoNoiViewModel>(
                        "DaoTaoNoiGetList", dynamicParameters, commandType: CommandType.StoredProcedure);

                    var query = hoso.AsQueryable();

                    int totalRow = query.Count();

                    query = query.OrderByDescending(x => x.CreateDate)
                        .Skip((page - 1) * pageSize).Take(pageSize);

                    var data = query.ToList();

                    var paginationSet = new PagedResult<DaoTaoNoiViewModel>()
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

        public async Task<List<DaoTaoNoiViewModel>> DaoTaoNoiGetList(int daotaonoiId, string keyword, int page, int pageSize,
            string daotaonoiId2, int status, string parameters)
        {
            using (var sqlConnection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                await sqlConnection.OpenAsync();
                var dynamicParameters = new DynamicParameters();

                dynamicParameters.Add("@daotaonoiId", daotaonoiId);
                dynamicParameters.Add("@keyword", keyword);
                dynamicParameters.Add("@daotaonoiId2", daotaonoiId2);
                dynamicParameters.Add("@status", status);

                dynamicParameters.Add("@parameters", parameters);
                try
                {
                    var query = await sqlConnection.QueryAsync<DaoTaoNoiViewModel>(
                        "DaoTaoNoiGetList", dynamicParameters, commandType: CommandType.StoredProcedure);

                    return query.AsList();
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }

        public async Task<Boolean> DaoTaoNoiAUD(DaoTaoNoiViewModel daotaonoi, string parameters)
        {
            using (var sqlConnection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                await sqlConnection.OpenAsync();
                var dynamicParameters = new DynamicParameters();

                dynamicParameters.Add("@Id", daotaonoi.Id);
                dynamicParameters.Add("@TenTruong", daotaonoi.TenTruong);
                dynamicParameters.Add("@DiaChi", daotaonoi.DiaChi);
                dynamicParameters.Add("@SoDienThoai", daotaonoi.SoDienThoai);
                dynamicParameters.Add("@Email", daotaonoi.Email);
                dynamicParameters.Add("@TenHieuTruong", daotaonoi.TenHieuTruong);
                dynamicParameters.Add("@Hinh", daotaonoi.Hinh);    
              
                dynamicParameters.Add("@CreateDate", daotaonoi.CreateDate);
                dynamicParameters.Add("@CreateBy", daotaonoi.CreateBy);
                dynamicParameters.Add("@UpdateDate", daotaonoi.UpdateDate);
                dynamicParameters.Add("@UpdateBy", daotaonoi.UpdateBy);

                dynamicParameters.Add("@parameters", parameters);
                try
                {
                    var query = await sqlConnection.QueryAsync<DaoTaoNoiViewModel>(
                        "DaoTaoNoiAUD", dynamicParameters, commandType: CommandType.StoredProcedure);
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
