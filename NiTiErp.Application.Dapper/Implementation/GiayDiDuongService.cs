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
                    
                    int totalRow = dynamicParameters.Get<int>("@totalRow");                    

                    var pagedResult = new PagedResult<GiayDiDuongViewModel>()
                    {
                        Results = query.ToList(),
                        RowCount = totalRow,
                        CurrentPage = pageIndex,
                        PageSize = pageSize
                    };
                    return pagedResult;                   
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }

        public async Task<GiayDiDuongViewModel> GetGiayDiDuong(long id)
        {
            using (var sqlConnection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                await sqlConnection.OpenAsync();
                var dynamicParameters = new DynamicParameters();

                dynamicParameters.Add("@Id", id);

                try
                {
                    var query = await sqlConnection.QueryAsync<GiayDiDuongViewModel>(
                        "Get_GiayDiDuong_ById", dynamicParameters, commandType: CommandType.StoredProcedure);
                    return query.Single();
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }

        public async Task<List<GiayDiDuongViewModel>> GetCodeGiayDD(Guid codegiaydiduong)
        {
            using (var sqlConnection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                await sqlConnection.OpenAsync();
                var dynamicParameters = new DynamicParameters();

                dynamicParameters.Add("@codegiaydiduong", codegiaydiduong);

                try
                {
                    var query = await sqlConnection.QueryAsync<GiayDiDuongViewModel>(
                        "Get_GiayDiDuong_ByCode", dynamicParameters, commandType: CommandType.StoredProcedure);
                    return query.AsList();
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }

        public async Task<bool> SaveXML(string giaydiduongXML, Guid code, string username)
        {
            using (var sqlConnection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                await sqlConnection.OpenAsync();
                var dynamicParameters = new DynamicParameters();

                dynamicParameters.Add("@giaydiduongXML", giaydiduongXML);
                dynamicParameters.Add("@code", code);
                dynamicParameters.Add("@CreateBy", username);               

                try
                {
                    var query = await sqlConnection.QueryAsync<GiayDiDuongViewModel>(
                        "Create_GiayDiDuongXML", dynamicParameters, commandType: CommandType.StoredProcedure);
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
