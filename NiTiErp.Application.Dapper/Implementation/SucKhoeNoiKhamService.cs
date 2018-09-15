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
    public class SucKhoeNoiKhamService : ISucKhoeNoiKhamService
    {
        private readonly IConfiguration _configuration;

        public SucKhoeNoiKhamService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task<PagedResult<SucKhoeNoiKhamViewModel>> GetAllSucKhoeNoiKhamPaging(string noikhamId, string keyword, int page, int pageSize,
            string noikhamId2, string tennoikham, int status, string parameters)
        {
            using (var sqlConnection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                await sqlConnection.OpenAsync();
                var dynamicParameters = new DynamicParameters();

                dynamicParameters.Add("@noikhamId", noikhamId);
                dynamicParameters.Add("@tennoikham", tennoikham);
                dynamicParameters.Add("@keyword", keyword);
                dynamicParameters.Add("@noikhamId2", noikhamId2);
                dynamicParameters.Add("@status", status);               

                dynamicParameters.Add("@parameters", parameters);
                try
                {
                    var hoso = await sqlConnection.QueryAsync<SucKhoeNoiKhamViewModel>(
                        "SucKhoeNoiKhamGetList", dynamicParameters, commandType: CommandType.StoredProcedure);

                    var query = hoso.AsQueryable();

                    int totalRow = query.Count();

                    query = query.OrderByDescending(x => x.CreateDate)
                        .Skip((page - 1) * pageSize).Take(pageSize);

                    var data = query.ToList();

                    var paginationSet = new PagedResult<SucKhoeNoiKhamViewModel>()
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

        public async Task<List<SucKhoeNoiKhamViewModel>> SucKhoeNoiKhamGetList(string noikhamId, string keyword, int page, int pageSize,
            string noikhamId2, string tennoikham, int status, string parameters)
        {
            using (var sqlConnection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                await sqlConnection.OpenAsync();
                var dynamicParameters = new DynamicParameters();

                dynamicParameters.Add("@noikhamId", noikhamId);
                dynamicParameters.Add("@tennoikham", tennoikham);
                dynamicParameters.Add("@keyword", keyword);
                dynamicParameters.Add("@noikhamId2", noikhamId2);
                dynamicParameters.Add("@status", status);

                dynamicParameters.Add("@parameters", parameters);
                try
                {
                    var query = await sqlConnection.QueryAsync<SucKhoeNoiKhamViewModel>(
                        "SucKhoeNoiKhamGetList", dynamicParameters, commandType: CommandType.StoredProcedure);

                    return query.AsList();
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }

        public async Task<Boolean> SucKhoeNoiKhamAUD(SucKhoeNoiKhamViewModel suckhoe, string parameters)
        {
            using (var sqlConnection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                await sqlConnection.OpenAsync();
                var dynamicParameters = new DynamicParameters();

                dynamicParameters.Add("@Id", suckhoe.Id);
                dynamicParameters.Add("@TenNoiKham", suckhoe.TenNoiKham);
                dynamicParameters.Add("@DiaChiNoiKham", suckhoe.DiaChiNoiKham);
                dynamicParameters.Add("@SoDienThoai", suckhoe.SoDienThoai);
                dynamicParameters.Add("@Email", suckhoe.Email);
                dynamicParameters.Add("@MaSoThue", suckhoe.MaSoThue);
                dynamicParameters.Add("@TenInHoaDon", suckhoe.TenInHoaDon);
                dynamicParameters.Add("@DiaChiInHoaDon", suckhoe.DiaChiInHoaDon);
                dynamicParameters.Add("@GhiChu", suckhoe.GhiChu);

                dynamicParameters.Add("@Status", suckhoe.Status);               
                
                dynamicParameters.Add("@Stt", suckhoe.Stt);
                dynamicParameters.Add("@CreateDate", suckhoe.CreateDate);
                dynamicParameters.Add("@CreateBy", suckhoe.CreateBy);               
                dynamicParameters.Add("@UpdateDate", suckhoe.UpdateDate);
                dynamicParameters.Add("@UpdateBy", suckhoe.UpdateBy);

                dynamicParameters.Add("@parameters", parameters);
                try
                {
                    var query = await sqlConnection.QueryAsync<SucKhoeNoiKhamViewModel>(
                        "SucKhoeNoiKhamAUD", dynamicParameters, commandType: CommandType.StoredProcedure);
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
