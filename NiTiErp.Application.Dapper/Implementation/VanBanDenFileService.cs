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
    public class VanBanDenFileService : IVanBanDenFileService
    {
        private readonly IConfiguration _configuration;

        public VanBanDenFileService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task<Boolean> VanBanDenFileAUD(VanBanDenFileViewModel vanbandenfile, string parameters)
        {
            using (var sqlConnection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                await sqlConnection.OpenAsync();
                var dynamicParameters = new DynamicParameters();

                dynamicParameters.Add("@Id", vanbandenfile.Id);

                dynamicParameters.Add("@CodeId", vanbandenfile.CodeId);
                dynamicParameters.Add("@VanBanDenId", vanbandenfile.VanBanDenId);
                dynamicParameters.Add("@TenFile", vanbandenfile.TenFile);
                dynamicParameters.Add("@DuongDan", vanbandenfile.DuongDan);
                dynamicParameters.Add("@Stt", vanbandenfile.SoTrang);

                dynamicParameters.Add("@CreateDate", vanbandenfile.CreateDate);
                dynamicParameters.Add("@CreateBy", vanbandenfile.CreateBy);
                dynamicParameters.Add("@UpdateDate", vanbandenfile.UpdateDate);
                dynamicParameters.Add("@UpdateBy", vanbandenfile.UpdateBy);

                dynamicParameters.Add("@parameters", parameters);
                try
                {
                    var query = await sqlConnection.QueryAsync<VanBanDenFileViewModel>(
                        "VanBanDenFileAUD", dynamicParameters, commandType: CommandType.StoredProcedure);

                    return true;
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }

        public async Task<PagedResult<VanBanDenFileViewModel>> GetAllVanBanDenFilePaging(Int64 Id, string CodeId, Int64 VanBanDenId, string TenFile,
            string keyword, int page, int pageSize, string parameters)
        {
            using (var sqlConnection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                await sqlConnection.OpenAsync();
                var dynamicParameters = new DynamicParameters();

                dynamicParameters.Add("@Id", Id);
                dynamicParameters.Add("@CodeId", CodeId);
                dynamicParameters.Add("@VanBanDenId", VanBanDenId);
                dynamicParameters.Add("@TenFile", TenFile);
                dynamicParameters.Add("@ghichu", keyword);

                dynamicParameters.Add("@parameters", parameters);
                try
                {
                    var thongbao = await sqlConnection.QueryAsync<VanBanDenFileViewModel>(
                        "VanBanDenFileGetList", dynamicParameters, commandType: CommandType.StoredProcedure);

                    var query = thongbao.AsQueryable();

                    int totalRow = query.Count();

                    query = query.OrderByDescending(x => x.CreateDate)
                        .Skip((page - 1) * pageSize).Take(pageSize);

                    var data = query.ToList();

                    var paginationSet = new PagedResult<VanBanDenFileViewModel>()
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
     
    }
}
