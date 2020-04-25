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
    public class VanBanDenXuLyFileService : IVanBanDenXuLyFileService
    {
        private readonly IConfiguration _configuration;

        public VanBanDenXuLyFileService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task<Boolean> VanBanDenXuLyFileAUD(VanBanDenXuLyFileViewModel vanbandenxulyfile, string parameters)
        {
            using (var sqlConnection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                await sqlConnection.OpenAsync();
                var dynamicParameters = new DynamicParameters();

                dynamicParameters.Add("@Id", vanbandenxulyfile.Id);
               
                dynamicParameters.Add("@VanBanDenXuLyId", vanbandenxulyfile.VanBanDenXuLyId);
                dynamicParameters.Add("@TenFile", vanbandenxulyfile.TenFile);
                dynamicParameters.Add("@DuongDan", vanbandenxulyfile.DuongDan);
                dynamicParameters.Add("@Stt", vanbandenxulyfile.Stt);

                dynamicParameters.Add("@CreateDate", vanbandenxulyfile.CreateDate);
                dynamicParameters.Add("@CreateBy", vanbandenxulyfile.CreateBy);
                dynamicParameters.Add("@UpdateDate", vanbandenxulyfile.UpdateDate);
                dynamicParameters.Add("@UpdateBy", vanbandenxulyfile.UpdateBy);

                dynamicParameters.Add("@parameters", parameters);
                try
                {
                    var query = await sqlConnection.QueryAsync<VanBanDenXuLyFileViewModel>(
                        "VanBanDenXuLyFileAUD", dynamicParameters, commandType: CommandType.StoredProcedure);

                    return true;
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }

        public async Task<PagedResult<VanBanDenXuLyFileViewModel>> GetAllVanBanDenXuLyFilePaging(long Id, long VanBanDenDuyetId, string TenFile,
            string keyword, int page, int pageSize, string parameters)
        {
            using (var sqlConnection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                await sqlConnection.OpenAsync();
                var dynamicParameters = new DynamicParameters();

                dynamicParameters.Add("@Id", Id);
               
                dynamicParameters.Add("@VanBanDenXuLyId", VanBanDenDuyetId);
                dynamicParameters.Add("@TenFile", TenFile);
                dynamicParameters.Add("@ghichu", keyword);

                dynamicParameters.Add("@parameters", parameters);
                try
                {
                    var thongbao = await sqlConnection.QueryAsync<VanBanDenXuLyFileViewModel>(
                        "VanBanDenXuLyFileGetList", dynamicParameters, commandType: CommandType.StoredProcedure);

                    var query = thongbao.AsQueryable();

                    int totalRow = query.Count();

                    query = query.OrderByDescending(x => x.CreateDate)
                        .Skip((page - 1) * pageSize).Take(pageSize);

                    var data = query.ToList();

                    var paginationSet = new PagedResult<VanBanDenXuLyFileViewModel>()
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
