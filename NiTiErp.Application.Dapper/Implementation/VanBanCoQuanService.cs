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
    public class VanBanCoQuanService: IVanBanCoQuanService
    {
        private readonly IConfiguration _configuration;

        public VanBanCoQuanService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task<PagedResult<VanBanCoQuanViewModel>> GetAllVanBanCoQuanPaging(string tencoquan, string diachi,
            string keyword, int page, int pageSize, int vanbancoquanid, string ghichu, string parameters)
        {
            using (var sqlConnection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                await sqlConnection.OpenAsync();
                var dynamicParameters = new DynamicParameters();

                dynamicParameters.Add("@corporationId", tencoquan);
                dynamicParameters.Add("@nam", diachi);
                dynamicParameters.Add("@keyword", keyword);
                dynamicParameters.Add("@vanbancoquanid", vanbancoquanid);
                dynamicParameters.Add("@ghichu", ghichu);

                dynamicParameters.Add("@parameters", parameters);
                try
                {
                    var hoso = await sqlConnection.QueryAsync<VanBanCoQuanViewModel>(
                        "VanBanCoQuanGetList", dynamicParameters, commandType: CommandType.StoredProcedure);

                    var query = hoso.AsQueryable();

                    int totalRow = query.Count();

                    query = query.OrderByDescending(x => x.CreateDate)
                        .Skip((page - 1) * pageSize).Take(pageSize);

                    var data = query.ToList();

                    var paginationSet = new PagedResult<VanBanCoQuanViewModel>()
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

        public async Task<Boolean> VanBanCoQuanAUD(VanBanCoQuanViewModel vanbancoquan, string parameters)
        {
            using (var sqlConnection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                await sqlConnection.OpenAsync();
                var dynamicParameters = new DynamicParameters();

                dynamicParameters.Add("@Id", vanbancoquan.Id);

                dynamicParameters.Add("@Ten", vanbancoquan.Ten);
                dynamicParameters.Add("@DiaChi", vanbancoquan.DiaChi);
                dynamicParameters.Add("@SoDienThoai", vanbancoquan.SoDienThoai);
                dynamicParameters.Add("@Email", vanbancoquan.Email);
                dynamicParameters.Add("@MoTa", vanbancoquan.MoTa);               
                dynamicParameters.Add("@Stt", vanbancoquan.Stt);

                dynamicParameters.Add("@CreateBy", vanbancoquan.CreateBy);
                dynamicParameters.Add("@CreateDate", vanbancoquan.CreateDate);
                dynamicParameters.Add("@UpdateDate", vanbancoquan.UpdateDate);
                dynamicParameters.Add("@UpdateBy", vanbancoquan.UpdateBy);

                dynamicParameters.Add("@parameters", parameters);

                try
                {
                    var query = await sqlConnection.QueryAsync<VanBanCoQuanViewModel>(
                        "VanBanCoQuanAUD", dynamicParameters, commandType: CommandType.StoredProcedure);

                    return true;
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }

        public async Task<List<VanBanCoQuanViewModel>> VanBanCoQuanGetList(string bangId, string id2, string id3, string parameters)
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
                    var query = await sqlConnection.QueryAsync<VanBanCoQuanViewModel>(
                        "BangDanhMucGetList", dynamicParameters, commandType: CommandType.StoredProcedure); // @parameter: ChiPhiLoaiGetList

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
