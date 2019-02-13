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
    public class VanBanDiFileService : IVanBanDiFileService
    {
        private readonly IConfiguration _configuration;

        public VanBanDiFileService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task<Boolean> VanBanDiFileAUD(VanBanDiFileViewModel vanbandifile, string parameters)
        {
            using (var sqlConnection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                await sqlConnection.OpenAsync();
                var dynamicParameters = new DynamicParameters();

                dynamicParameters.Add("@Id", vanbandifile.Id);

                dynamicParameters.Add("@CodeId", vanbandifile.CodeId);
                dynamicParameters.Add("@VanBanDiId", vanbandifile.VanBanDiId);
                dynamicParameters.Add("@TenFile", vanbandifile.TenFile);
                dynamicParameters.Add("@DuongDan", vanbandifile.DuongDan);
                dynamicParameters.Add("@Stt", vanbandifile.Stt);

                dynamicParameters.Add("@CreateDate", vanbandifile.CreateDate);
                dynamicParameters.Add("@CreateBy", vanbandifile.CreateBy);
                dynamicParameters.Add("@UpdateDate", vanbandifile.UpdateDate);
                dynamicParameters.Add("@UpdateBy", vanbandifile.UpdateBy);

                dynamicParameters.Add("@parameters", parameters);
                try
                {
                    var query = await sqlConnection.QueryAsync<VanBanDiFileViewModel>(
                        "VanBanDiFileAUD", dynamicParameters, commandType: CommandType.StoredProcedure);

                    return true;
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }

        public async Task<PagedResult<VanBanDiFileViewModel>> GetAllVanBanDiFilePaging(Int64 Id, string CodeId, Int64 VanBanDiId, string TenFile,
            string keyword, int page, int pageSize, string parameters)
        {
            using (var sqlConnection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                await sqlConnection.OpenAsync();
                var dynamicParameters = new DynamicParameters();

                dynamicParameters.Add("@Id", Id);
                dynamicParameters.Add("@CodeId", CodeId);
                dynamicParameters.Add("@VanBanDiId", VanBanDiId);
                dynamicParameters.Add("@TenFile", TenFile);
                dynamicParameters.Add("@ghichu", keyword);

                dynamicParameters.Add("@parameters", parameters);
                try
                {
                    var thongbao = await sqlConnection.QueryAsync<VanBanDiFileViewModel>(
                        "VanBanDiFileGetList", dynamicParameters, commandType: CommandType.StoredProcedure);

                    var query = thongbao.AsQueryable();

                    int totalRow = query.Count();

                    query = query.OrderByDescending(x => x.CreateDate)
                        .Skip((page - 1) * pageSize).Take(pageSize);

                    var data = query.ToList();

                    var paginationSet = new PagedResult<VanBanDiFileViewModel>()
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
