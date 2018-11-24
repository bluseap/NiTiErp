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
    public class ChiPhiKhoiTaoService : IChiPhiKhoiTaoService
    {
        private readonly IConfiguration _configuration;

        public ChiPhiKhoiTaoService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task<PagedResult<ChiPhiKhoiTaoViewModel>> GetAllChiPhiKhoiTaoPaging(int chiphikhoitaoId, string corporationId, string keyword, int page, int pageSize,
            int ChiPhiId, bool IsKyKhoiTao, DateTime KyKhoiTao, bool IsChuyenKy, string ghichu, string parameters)
        {
            using (var sqlConnection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                await sqlConnection.OpenAsync();
                var dynamicParameters = new DynamicParameters();

                dynamicParameters.Add("@chiphikhoitaoId", chiphikhoitaoId);
                dynamicParameters.Add("@corporationId", corporationId);
                dynamicParameters.Add("@keyword", keyword);
                dynamicParameters.Add("@ChiPhiId", ChiPhiId);
                dynamicParameters.Add("@IsKyKhoiTao", IsKyKhoiTao);
                dynamicParameters.Add("@KyKhoiTao", KyKhoiTao);
                dynamicParameters.Add("@IsChuyenKy", IsChuyenKy);
                dynamicParameters.Add("@ghichu", ghichu);

                dynamicParameters.Add("@parameters", parameters);
                try
                {
                    var daotaolop = await sqlConnection.QueryAsync<ChiPhiKhoiTaoViewModel>(
                        "ChiPhiKhoiTaoGetList", dynamicParameters, commandType: CommandType.StoredProcedure);

                    var query = daotaolop.AsQueryable();

                    int totalRow = query.Count();

                    query = query.OrderByDescending(x => x.CreateDate)
                        .Skip((page - 1) * pageSize).Take(pageSize);

                    var data = query.ToList();

                    var paginationSet = new PagedResult<ChiPhiKhoiTaoViewModel>()
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

        public async Task<List<ChiPhiKhoiTaoViewModel>> ChiPhiKhoiTaoGetList(int chiphikhoitaoId, string corporationId, string keyword, int page, int pageSize,
            int ChiPhiId, bool IsKyKhoiTao, DateTime KyKhoiTao, bool IsChuyenKy, string ghichu, string parameters)
        {
            using (var sqlConnection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                await sqlConnection.OpenAsync();
                var dynamicParameters = new DynamicParameters();

                dynamicParameters.Add("@chiphikhoitaoId", chiphikhoitaoId);
                dynamicParameters.Add("@corporationId", corporationId);
                dynamicParameters.Add("@keyword", keyword);
                dynamicParameters.Add("@ChiPhiId", ChiPhiId);
                dynamicParameters.Add("@IsKyKhoiTao", IsKyKhoiTao);
                dynamicParameters.Add("@KyKhoiTao", KyKhoiTao);
                dynamicParameters.Add("@IsChuyenKy", IsChuyenKy);
                dynamicParameters.Add("@ghichu", ghichu);

                dynamicParameters.Add("@parameters", parameters);
                try
                {
                    var query = await sqlConnection.QueryAsync<ChiPhiKhoiTaoViewModel>(
                        "ChiPhiKhoiTaoGetList", dynamicParameters, commandType: CommandType.StoredProcedure);

                    return query.AsList();
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }

        public async Task<Boolean> ChiPhiKhoiTaoAUD(ChiPhiKhoiTaoViewModel chiphikhoitao, string parameters)
        {
            using (var sqlConnection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                await sqlConnection.OpenAsync();
                var dynamicParameters = new DynamicParameters();

                dynamicParameters.Add("@Id", chiphikhoitao.Id);

                dynamicParameters.Add("@ChiPhiId", chiphikhoitao.ChiPhiId);
                dynamicParameters.Add("@IsKyKhoiTao", chiphikhoitao.IsKyKhoiTao);
                dynamicParameters.Add("@KyKhoiTao", chiphikhoitao.KyKhoiTao);
                dynamicParameters.Add("@IsChuyenKy", chiphikhoitao.IsChuyenKy);
                dynamicParameters.Add("@GhiChu", chiphikhoitao.GhiChu);
                
                dynamicParameters.Add("@Stt", chiphikhoitao.Stt);

                dynamicParameters.Add("@CreateDate", chiphikhoitao.CreateDate);
                dynamicParameters.Add("@CreateBy", chiphikhoitao.CreateBy);
                dynamicParameters.Add("@UpdateDate", chiphikhoitao.UpdateDate);
                dynamicParameters.Add("@UpdateBy", chiphikhoitao.UpdateBy);

                dynamicParameters.Add("@parameters", parameters);

                try
                {
                    var query = await sqlConnection.QueryAsync<ChiPhiKhoiTaoViewModel>(
                        "ChiPhiKhoiTaoAUD", dynamicParameters, commandType: CommandType.StoredProcedure);

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
