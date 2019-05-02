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
    public class VanBanPHXLService : IVanBanPHXLService
    {
        private readonly IConfiguration _configuration;

        public VanBanPHXLService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task<PagedResult<VanBanPHXLViewModel>> GetAllVanBanPHXLPaging(string tenphoihopxuly,
            string keyword, int page, int pageSize, int phoihopxulyid, string ghichu, string parameters)
        {
            using (var sqlConnection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                await sqlConnection.OpenAsync();
                var dynamicParameters = new DynamicParameters();

                dynamicParameters.Add("@tenphoihopxuly", tenphoihopxuly);
                dynamicParameters.Add("@keyword", keyword);
                dynamicParameters.Add("@phoihopxulyid", phoihopxulyid);
                dynamicParameters.Add("@ghichu", ghichu);

                dynamicParameters.Add("@parameters", parameters);
                try
                {
                    var hoso = await sqlConnection.QueryAsync<VanBanPHXLViewModel>(
                        "VanBanPHXLGetList", dynamicParameters, commandType: CommandType.StoredProcedure);

                    var query = hoso.AsQueryable();

                    int totalRow = query.Count();

                    query = query.OrderByDescending(x => x.CreateDate)
                        .Skip((page - 1) * pageSize).Take(pageSize);

                    var data = query.ToList();

                    var paginationSet = new PagedResult<VanBanPHXLViewModel>()
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

        public async Task<Boolean> VanBanPHXLAUD(VanBanPHXLViewModel vanbanphxl, string parameters)
        {
            using (var sqlConnection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                await sqlConnection.OpenAsync();
                var dynamicParameters = new DynamicParameters();

                dynamicParameters.Add("@Id", vanbanphxl.Id);

                dynamicParameters.Add("@Ten", vanbanphxl.Ten);
                dynamicParameters.Add("@MoTa", vanbanphxl.MoTa);
                dynamicParameters.Add("@Code", vanbanphxl.Code);
                dynamicParameters.Add("@Stt", vanbanphxl.Stt);

                dynamicParameters.Add("@CreateBy", vanbanphxl.CreateBy);
                dynamicParameters.Add("@CreateDate", vanbanphxl.CreateDate);
                dynamicParameters.Add("@UpdateDate", vanbanphxl.UpdateDate);
                dynamicParameters.Add("@UpdateBy", vanbanphxl.UpdateBy);

                dynamicParameters.Add("@parameters", parameters);
                try
                {
                    var query = await sqlConnection.QueryAsync<VanBanPHXLViewModel>(
                        "VanBanPHXLAUD", dynamicParameters, commandType: CommandType.StoredProcedure);

                    return true;
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }

        public async Task<List<VanBanPHXLViewModel>> VanBanPHXLGetList(string bangId, string id2, string id3, string parameters)
        {
            using (var sqlConnection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                await sqlConnection.OpenAsync();
                var dynamicParameters = new DynamicParameters();

                dynamicParameters.Add("@bangId", bangId);
                dynamicParameters.Add("@id2", id2);
                dynamicParameters.Add("@id3", id3);
                dynamicParameters.Add("@parameters", parameters);

                try
                {
                    var query = await sqlConnection.QueryAsync<VanBanPHXLViewModel>(
                        "BangDanhMucGetList", dynamicParameters, commandType: CommandType.StoredProcedure); 

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
