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
    public class VanBanDenDuyetFileService : IVanBanDenDuyetFileService
    {
        private readonly IConfiguration _configuration;

        public VanBanDenDuyetFileService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task<Boolean> VanBanDenDuyetFileAUD(VanBanDenDuyetFileViewModel vanbandenduyetfile, string parameters)
        {
            using (var sqlConnection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                await sqlConnection.OpenAsync();
                var dynamicParameters = new DynamicParameters();

                dynamicParameters.Add("@Id", vanbandenduyetfile.Id);

                dynamicParameters.Add("@CodeId", vanbandenduyetfile.CodeId);
                dynamicParameters.Add("@VanBanDenDuyetId", vanbandenduyetfile.VanBanDenDuyetId);
                dynamicParameters.Add("@TenFile", vanbandenduyetfile.TenFile);
                dynamicParameters.Add("@DuongDan", vanbandenduyetfile.DuongDan);
                dynamicParameters.Add("@Stt", vanbandenduyetfile.Stt);

                dynamicParameters.Add("@CreateDate", vanbandenduyetfile.CreateDate);
                dynamicParameters.Add("@CreateBy", vanbandenduyetfile.CreateBy);
                dynamicParameters.Add("@UpdateDate", vanbandenduyetfile.UpdateDate);
                dynamicParameters.Add("@UpdateBy", vanbandenduyetfile.UpdateBy);

                dynamicParameters.Add("@parameters", parameters);
                try
                {
                    var query = await sqlConnection.QueryAsync<VanBanDenDuyetFileViewModel>(
                        "VanBanDenDuyetFileAUD", dynamicParameters, commandType: CommandType.StoredProcedure);
                    return true;
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }

        public async Task<PagedResult<VanBanDenDuyetFileViewModel>> GetAllVanBanDenDuyetFilePaging(long Id, string CodeId, long VanBanDenDuyetId, string TenFile,
            string keyword, int page, int pageSize, string parameters)
        {
            using (var sqlConnection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                await sqlConnection.OpenAsync();
                var dynamicParameters = new DynamicParameters();

                dynamicParameters.Add("@Id", Id);
                dynamicParameters.Add("@CodeId", CodeId);
                dynamicParameters.Add("@VanBanDenDuyetId", VanBanDenDuyetId);
                dynamicParameters.Add("@TenFile", TenFile);
                dynamicParameters.Add("@ghichu", keyword);

                dynamicParameters.Add("@parameters", parameters);
                try
                {
                    var thongbao = await sqlConnection.QueryAsync<VanBanDenDuyetFileViewModel>(
                        "VanBanDenDuyetFileGetList", dynamicParameters, commandType: CommandType.StoredProcedure);

                    var query = thongbao.AsQueryable();

                    int totalRow = query.Count();

                    query = query.OrderByDescending(x => x.CreateDate)
                        .Skip((page - 1) * pageSize).Take(pageSize);

                    var data = query.ToList();

                    var paginationSet = new PagedResult<VanBanDenDuyetFileViewModel>()
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
