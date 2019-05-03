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
    public class VanBanLinhVucService: IVanBanLinhVucService
    {
        private readonly IConfiguration _configuration;

        public VanBanLinhVucService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task<PagedResult<VanBanLinhVucViewModel>> GetAllVanBanLinhVucPaging(string tenvanbanlinhvuc,
            string keyword, int page, int pageSize, int vanbanlinhvucid, string ghichu, string parameters)
        {
            using (var sqlConnection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                await sqlConnection.OpenAsync();
                var dynamicParameters = new DynamicParameters();

                dynamicParameters.Add("@tenvanlinhvuc", tenvanbanlinhvuc);
                dynamicParameters.Add("@keyword", keyword);
                dynamicParameters.Add("@vanbanlinhvucid", vanbanlinhvucid);
                dynamicParameters.Add("@ghichu", ghichu);

                dynamicParameters.Add("@parameters", parameters);
                try
                {
                    var hoso = await sqlConnection.QueryAsync<VanBanLinhVucViewModel>(
                        "VanBanLinhVucGetList", dynamicParameters, commandType: CommandType.StoredProcedure);

                    var query = hoso.AsQueryable();

                    int totalRow = query.Count();

                    query = query.OrderByDescending(x => x.CreateDate)
                        .Skip((page - 1) * pageSize).Take(pageSize);

                    var data = query.ToList();

                    var paginationSet = new PagedResult<VanBanLinhVucViewModel>()
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

        public async Task<Boolean> VanBanLinhVucAUD(VanBanLinhVucViewModel vblv, string parameters)
        {
            using (var sqlConnection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                await sqlConnection.OpenAsync();
                var dynamicParameters = new DynamicParameters();

                dynamicParameters.Add("@Id", vblv.Id);

                dynamicParameters.Add("@Ten", vblv.Ten);
                dynamicParameters.Add("@MoTa", vblv.MoTa);
                dynamicParameters.Add("@Code", vblv.Code);
                dynamicParameters.Add("@Stt", vblv.Stt);
                
                dynamicParameters.Add("@CreateBy", vblv.CreateBy);
                dynamicParameters.Add("@CreateDate", vblv.CreateDate);
                dynamicParameters.Add("@UpdateDate", vblv.UpdateDate);
                dynamicParameters.Add("@UpdateBy", vblv.UpdateBy);

                dynamicParameters.Add("@parameters", parameters);
                try
                {
                    var query = await sqlConnection.QueryAsync<VanBanLinhVucViewModel>(
                        "VanBanLinhVucAUD", dynamicParameters, commandType: CommandType.StoredProcedure);

                    return true;
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }

        public async Task<List<VanBanLinhVucViewModel>> VanBanLinhVucGetList(string bangId, string id2, string id3, string parameters)
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
                    var query = await sqlConnection.QueryAsync<VanBanLinhVucViewModel>(
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
