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
    public class VanBanLoaiService : IVanBanLoaiService
    {
        private readonly IConfiguration _configuration;

        public VanBanLoaiService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task<PagedResult<VanBanLoaiViewModel>> GetAllVanBanLoaiPaging(string tenvanbanloai,
            string keyword, int page, int pageSize, int vanbanloaiid, string ghichu, string parameters)
        {
            using (var sqlConnection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                await sqlConnection.OpenAsync();
                var dynamicParameters = new DynamicParameters();

                dynamicParameters.Add("@tenvanbanloai", tenvanbanloai);
                dynamicParameters.Add("@keyword", keyword);
                dynamicParameters.Add("@vanbanloaiid", vanbanloaiid);
                dynamicParameters.Add("@ghichu", ghichu);

                dynamicParameters.Add("@parameters", parameters);
                try
                {
                    var hoso = await sqlConnection.QueryAsync<VanBanLoaiViewModel>(
                        "VanBanLoaiGetList", dynamicParameters, commandType: CommandType.StoredProcedure);

                    var query = hoso.AsQueryable();

                    int totalRow = query.Count();

                    query = query.OrderByDescending(x => x.CreateDate)
                        .Skip((page - 1) * pageSize).Take(pageSize);

                    var data = query.ToList();

                    var paginationSet = new PagedResult<VanBanLoaiViewModel>()
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

        public async Task<Boolean> VanBanLoaiAUD(VanBanLoaiViewModel vbl, string parameters)
        {
            using (var sqlConnection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                await sqlConnection.OpenAsync();
                var dynamicParameters = new DynamicParameters();

                dynamicParameters.Add("@Id", vbl.Id);

                dynamicParameters.Add("@Ten", vbl.Ten);
                dynamicParameters.Add("@MoTa", vbl.MoTa);
                dynamicParameters.Add("@Code", vbl.Code);
                dynamicParameters.Add("@Stt", vbl.Stt);
                dynamicParameters.Add("@ThoiGianBaoQuan", vbl.ThoiGianBaoQuan);

                dynamicParameters.Add("@CreateBy", vbl.CreateBy);
                dynamicParameters.Add("@CreateDate", vbl.CreateDate);
                dynamicParameters.Add("@UpdateDate", vbl.UpdateDate);
                dynamicParameters.Add("@UpdateBy", vbl.UpdateBy);

                dynamicParameters.Add("@parameters", parameters);
                try
                {
                    var query = await sqlConnection.QueryAsync<VanBanLoaiViewModel>(
                        "VanBanLoaiAUD", dynamicParameters, commandType: CommandType.StoredProcedure);

                    return true;
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }

        public async Task<List<VanBanLoaiViewModel>> VanBanLoaiGetList(string bangId, string id2, string id3, string parameters)
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
                    var query = await sqlConnection.QueryAsync<VanBanLoaiViewModel>(
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
