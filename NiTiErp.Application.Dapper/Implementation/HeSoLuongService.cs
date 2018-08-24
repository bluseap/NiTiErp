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

namespace NiTiErp.Application.Dapper.Implementation
{
    public class HeSoLuongService : IHeSoLuongService
    {
        private readonly IConfiguration _configuration;

        public HeSoLuongService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task<Boolean> HeSoLuongDMAUD(HeSoLuongViewModel hesoluongdm, string parameters)
        {
            using (var sqlConnection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                await sqlConnection.OpenAsync();
                var dynamicParameters = new DynamicParameters();

                dynamicParameters.Add("@Id", hesoluongdm.Id);

                dynamicParameters.Add("@ChucVuNhanVienId", hesoluongdm.ChucVuNhanVienId);
                dynamicParameters.Add("@HeSo", hesoluongdm.HeSo);
                dynamicParameters.Add("@MucLuong", hesoluongdm.MucLuong);
                dynamicParameters.Add("@BacLuongId", hesoluongdm.@BacLuongId);
                dynamicParameters.Add("@MucLuongToiThieuId", hesoluongdm.MucLuongToiThieuId);
                dynamicParameters.Add("@Stt", hesoluongdm.Stt);

                dynamicParameters.Add("@CreateDate", hesoluongdm.CreateDate);
                dynamicParameters.Add("@CreateBy", hesoluongdm.CreateBy);
                dynamicParameters.Add("@UpdateDate", hesoluongdm.UpdateDate);
                dynamicParameters.Add("@UpdateBy", hesoluongdm.UpdateBy);

                dynamicParameters.Add("@parameters", parameters);
                try
                {
                    var query = await sqlConnection.QueryAsync<HeSoLuongViewModel>(
                        "HeSoLuongAUD", dynamicParameters, commandType: CommandType.StoredProcedure);

                    return true;
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }

        public async Task<List<HeSoLuongViewModel>> HeSoLuongGetList(string corporationId, string phongId, string keyword, string hosoId,
            string hosoId2, string hesoluongId, string chucVuId, string bacluongId, string luongtoithieuId, string parameters)
        {
            using (var sqlConnection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                await sqlConnection.OpenAsync();
                var dynamicParameters = new DynamicParameters();

                dynamicParameters.Add("@corporationId", corporationId);
                dynamicParameters.Add("@phongId", phongId);
                dynamicParameters.Add("@keyword", keyword);
                dynamicParameters.Add("@hosoId", hosoId);
                dynamicParameters.Add("@hosoId2", hosoId2);
                dynamicParameters.Add("@hesoluongId", hesoluongId);
                dynamicParameters.Add("@chucVuId", chucVuId);
                dynamicParameters.Add("@bacluongId", bacluongId);
                dynamicParameters.Add("@luongtoithieuId", luongtoithieuId);

                dynamicParameters.Add("@parameters", parameters);
                try
                {
                    var query = await sqlConnection.QueryAsync<HeSoLuongViewModel>(
                        "HeSoLuongGetList", dynamicParameters, commandType: CommandType.StoredProcedure);

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
