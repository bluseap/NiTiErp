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
    public class TrinhDoService : ITrinhDoService
    {
        private readonly IConfiguration _configuration;

        public TrinhDoService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task<PagedResult<TrinhDoViewModel>> GetAllTrinhDoPaging(string corporationId, string phongId, string keyword, int page, int pageSize,
            string hosoId, string hosoId2, string hosoId3, string trinhdoId, string parameters)
        {
            using (var sqlConnection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                await sqlConnection.OpenAsync();
                var dynamicParameters = new DynamicParameters();

                dynamicParameters.Add("@corporationId", corporationId);
                dynamicParameters.Add("@phongId", phongId);
                dynamicParameters.Add("@keyword", keyword);
                dynamicParameters.Add("@hosoId", hosoId);
                dynamicParameters.Add("@hosoId2", hosoId2);
                dynamicParameters.Add("@hosoId3", hosoId3);
                dynamicParameters.Add("@trinhdoId", trinhdoId);

                dynamicParameters.Add("@parameters", parameters);
                try
                {
                    var hoso = await sqlConnection.QueryAsync<TrinhDoViewModel>(
                        "TrinhDoGetList", dynamicParameters, commandType: CommandType.StoredProcedure);

                    var query = hoso.AsQueryable();

                    int totalRow = query.Count();

                    query = query.OrderByDescending(x => x.CreateDate)
                        .Skip((page - 1) * pageSize).Take(pageSize);

                    var data = query.ToList();

                    var paginationSet = new PagedResult<TrinhDoViewModel>()
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

        public async Task<Boolean> TrinhDoAUD(TrinhDoViewModel trinhdo, string parameters)
        {
            using (var sqlConnection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                await sqlConnection.OpenAsync();
                var dynamicParameters = new DynamicParameters();

                dynamicParameters.Add("@Id", trinhdo.Id);
                dynamicParameters.Add("@HoSoNhanVienId", trinhdo.HoSoNhanVienId);
                dynamicParameters.Add("@LoaiBangDanhMucId", trinhdo.LoaiBangDanhMucId);
                dynamicParameters.Add("@ChuyenNganh", trinhdo.ChuyenNganh);
                dynamicParameters.Add("@LoaiDaoTaoDanhMucId", trinhdo.LoaiDaoTaoDanhMucId);
                dynamicParameters.Add("@XepLoaiDanhMucId", trinhdo.XepLoaiDanhMucId);
                dynamicParameters.Add("@NamCapBang", trinhdo.NamCapBang);
                dynamicParameters.Add("@TenTruong", trinhdo.TenTruong);
                dynamicParameters.Add("@GhiChu", trinhdo.GhiChu);
                dynamicParameters.Add("@HinhBangMatPath1", trinhdo.HinhBangMatPath1);
                dynamicParameters.Add("@HinhBangMatPath2", trinhdo.HinhBangMatPath2);
                dynamicParameters.Add("@CreateDate", trinhdo.CreateDate);
                dynamicParameters.Add("@CreateBy", trinhdo.CreateBy);
                dynamicParameters.Add("@UpdateDate", trinhdo.UpdateDate);
                dynamicParameters.Add("@UpdareBy", trinhdo.UpdateBy);  

                dynamicParameters.Add("@parameters", parameters);
                try
                {
                    var query = await sqlConnection.QueryAsync<TrinhDoViewModel>(
                        "TrinhDoAUD", dynamicParameters, commandType: CommandType.StoredProcedure);

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
