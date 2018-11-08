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
    public class ChiPhiService : IChiPhiService
    {
        private readonly IConfiguration _configuration;

        public ChiPhiService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task<PagedResult<ChiPhiViewModel>> GetAllChiPhiPaging(int chiphiId, string corporationId, string keyword, int page, int pageSize,
           bool IsChiPhiTang, int ChiPhiLoaiId, int ChiPhiBangDanhMucId, string ghichu2, string ghichu3, string parameters)
        {
            using (var sqlConnection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                await sqlConnection.OpenAsync();
                var dynamicParameters = new DynamicParameters();

                dynamicParameters.Add("@chiphiId", chiphiId);
                dynamicParameters.Add("@corporationId", corporationId);
                dynamicParameters.Add("@keyword", keyword);
                dynamicParameters.Add("@IsChiPhiTang", IsChiPhiTang);
                dynamicParameters.Add("@ChiPhiLoaiId", ChiPhiLoaiId);
                dynamicParameters.Add("@ChiPhiBangDanhMucId", ChiPhiBangDanhMucId);
                dynamicParameters.Add("@ghichu2", ghichu2);
                dynamicParameters.Add("@ghichu3", ghichu3);               

                dynamicParameters.Add("@parameters", parameters);
                try
                {
                    var daotaolop = await sqlConnection.QueryAsync<ChiPhiViewModel>(
                        "ChiPhiGetList", dynamicParameters, commandType: CommandType.StoredProcedure);

                    var query = daotaolop.AsQueryable();

                    int totalRow = query.Count();

                    query = query.OrderByDescending(x => x.CreateDate)
                        .Skip((page - 1) * pageSize).Take(pageSize);

                    var data = query.ToList();

                    var paginationSet = new PagedResult<ChiPhiViewModel>()
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

        public async Task<List<ChiPhiViewModel>> ChiPhiGetList(int chiphiId, string corporationId, string keyword, int page, int pageSize,
           bool IsChiPhiTang, int ChiPhiLoaiId, int ChiPhiBangDanhMucId, string ghichu2, string ghichu3, string parameters)
        {
            using (var sqlConnection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                await sqlConnection.OpenAsync();
                var dynamicParameters = new DynamicParameters();

                dynamicParameters.Add("@chiphiId", chiphiId);
                dynamicParameters.Add("@corporationId", corporationId);
                dynamicParameters.Add("@keyword", keyword);
                dynamicParameters.Add("@IsChiPhiTang", IsChiPhiTang);
                dynamicParameters.Add("@ChiPhiLoaiId", ChiPhiLoaiId);
                dynamicParameters.Add("@ChiPhiBangDanhMucId", ChiPhiBangDanhMucId);
                dynamicParameters.Add("@ghichu2", ghichu2);
                dynamicParameters.Add("@ghichu3", ghichu3);

                dynamicParameters.Add("@parameters", parameters);
                try
                {
                    var query = await sqlConnection.QueryAsync<ChiPhiViewModel>(
                        "ChiPhiGetList", dynamicParameters, commandType: CommandType.StoredProcedure);

                    return query.AsList();
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }

        public async Task<Boolean> ChiPhiAUD(ChiPhiViewModel chiphi, string parameters)
        {
            using (var sqlConnection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                await sqlConnection.OpenAsync();
                var dynamicParameters = new DynamicParameters();

                dynamicParameters.Add("@Id", chiphi.Id);

                dynamicParameters.Add("@CorporationId", chiphi.CorporationId);
                dynamicParameters.Add("@TenChiPhi", chiphi.TenChiPhi);
                dynamicParameters.Add("@IsChiPhiTang", chiphi.IsChiPhiTang);
                dynamicParameters.Add("@ChiPhiLoaiId", chiphi.ChiPhiLoaiId);
                dynamicParameters.Add("@ChiPhiKhac", chiphi.ChiPhiKhac);
                dynamicParameters.Add("@ChiPhiBangDanhMucId", chiphi.ChiPhiBangDanhMucId);
                dynamicParameters.Add("@GhiChu", chiphi.GhiChu);

                dynamicParameters.Add("@Stt", chiphi.Stt);

                dynamicParameters.Add("@CreateDate", chiphi.CreateDate);
                dynamicParameters.Add("@CreateBy", chiphi.CreateBy);
                dynamicParameters.Add("@UpdateDate", chiphi.UpdateDate);
                dynamicParameters.Add("@UpdateBy", chiphi.UpdateBy);

                dynamicParameters.Add("@parameters", parameters);

                try
                {
                    var query = await sqlConnection.QueryAsync<ChiPhiViewModel>(
                        "ChiPhiAUD", dynamicParameters, commandType: CommandType.StoredProcedure);

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
