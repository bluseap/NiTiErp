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
using NiTiErp.Utilities.Dtos;
using System.Linq;

namespace NiTiErp.Application.Dapper.Implementation
{
    public class VanBanDienTuService : IVanBanDienTuService
    {
        private readonly IConfiguration _configuration;

        public VanBanDienTuService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task<PagedResult<VanBanDienTuViewModel>> GetAllVanBanDienTuPaging(string corporationId, Int32 VanBanDienTuPhatHanhId,
            DateTime TuNgayPhatHanh, DateTime DenNgayPhatHanh, Int32 VanBanDienTuId, string SoKyHieuVanBan,
            string keyword, int page, int pageSize, string GhiChu, string parameters)
        {
            using (var sqlConnection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                await sqlConnection.OpenAsync();
                var dynamicParameters = new DynamicParameters();

                dynamicParameters.Add("@corporationId", corporationId);
                dynamicParameters.Add("@VanBanDienTuPhatHanhId", VanBanDienTuPhatHanhId);
                dynamicParameters.Add("@TuNgayPhatHanh", TuNgayPhatHanh);
                dynamicParameters.Add("@DenNgayPhatHanh", DenNgayPhatHanh);
                dynamicParameters.Add("@VanBanDienTuId", VanBanDienTuId);
                dynamicParameters.Add("@SoKyHieuVanBan", SoKyHieuVanBan);
                dynamicParameters.Add("@keyword", keyword);
                dynamicParameters.Add("@GhiChu", GhiChu);

                dynamicParameters.Add("@parameters", parameters);
                try
                {
                    var hoso = await sqlConnection.QueryAsync<VanBanDienTuViewModel>(
                        "VanBanDienTuGetList", dynamicParameters, commandType: CommandType.StoredProcedure);

                    var query = hoso.AsQueryable();

                    int totalRow = query.Count();

                    query = query.OrderByDescending(x => x.CreateDate)
                        .Skip((page - 1) * pageSize).Take(pageSize);

                    var data = query.ToList();

                    var paginationSet = new PagedResult<VanBanDienTuViewModel>()
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

        public async Task<List<VanBanDienTuViewModel>> VanBanDienTuGetList(string corporationId, Int32 VanBanDienTuPhatHanhId,
            DateTime TuNgayPhatHanh, DateTime DenNgayPhatHanh, Int32 VanBanDienTuId, string SoKyHieuVanBan,
            string keyword, string GhiChu, string parameters)
        {
            using (var sqlConnection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                await sqlConnection.OpenAsync();
                var dynamicParameters = new DynamicParameters();

                dynamicParameters.Add("@corporationId", corporationId);
                dynamicParameters.Add("@VanBanDienTuPhatHanhId", VanBanDienTuPhatHanhId);
                dynamicParameters.Add("@TuNgayPhatHanh", TuNgayPhatHanh);
                dynamicParameters.Add("@DenNgayPhatHanh", DenNgayPhatHanh);
                dynamicParameters.Add("@VanBanDienTuId", VanBanDienTuId);
                dynamicParameters.Add("@SoKyHieuVanBan", SoKyHieuVanBan);
                dynamicParameters.Add("@keyword", keyword);
                dynamicParameters.Add("@GhiChu", GhiChu);

                dynamicParameters.Add("@parameters", parameters);
                try
                {
                    var query = await sqlConnection.QueryAsync<VanBanDienTuViewModel>(
                        "VanBanDienTuGetList", dynamicParameters, commandType: CommandType.StoredProcedure); 

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
