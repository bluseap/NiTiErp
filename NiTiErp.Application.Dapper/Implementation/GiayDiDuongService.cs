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
    public class GiayDiDuongService : IGiayDiDuongService
    {
        private readonly IConfiguration _configuration;

        public GiayDiDuongService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task<PagedResult<GiayDiDuongViewModel>> ListGiayDiDuongKVPhong(string khuvucId, string maphongIc,
            string keyword, int pageIndex, int pageSize)
        {
            using (var sqlConnection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                await sqlConnection.OpenAsync();
                var dynamicParameters = new DynamicParameters();

                dynamicParameters.Add("@corporationId", khuvucId);
                dynamicParameters.Add("@MaPhongId", maphongIc);
                dynamicParameters.Add("@Keyword", keyword);
                dynamicParameters.Add("@pageIndex", pageIndex);
                dynamicParameters.Add("@pageSize", pageSize);

                dynamicParameters.Add("@totalRow", dbType: System.Data.DbType.Int32, direction: System.Data.ParameterDirection.Output);

                try
                {
                    var giaydiduong = await sqlConnection.QueryAsync<GiayDiDuongViewModel>(
                        "Get_GiayDiDuong_ByKhuVucPhong", dynamicParameters, commandType: CommandType.StoredProcedure);

                    var query = giaydiduong.AsQueryable();

                    int totalRow = query.Count();

                    query = query.OrderByDescending(x => x.CreateDate)
                        .Skip((pageIndex - 1) * pageSize).Take(pageSize);

                    var data = query.ToList();

                    var paginationSet = new PagedResult<GiayDiDuongViewModel>()
                    {
                        Results = data,
                        CurrentPage = pageIndex,
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
