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
    public class VanBanDenXuLyService : IVanBanDenXuLyService
    {
        private readonly IConfiguration _configuration;

        public VanBanDenXuLyService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task<Boolean> VanBanDenXuLyAUD(VanBanDenXuLyViewModel vanbandenxuly, string parameters)
        {
            using (var sqlConnection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                await sqlConnection.OpenAsync();
                var dynamicParameters = new DynamicParameters();

                dynamicParameters.Add("@Id", vanbandenxuly.Id);

                dynamicParameters.Add("@NgayBatDauXuLy", vanbandenxuly.NgayBatDauXuLy);
                dynamicParameters.Add("@NgayXuLy", vanbandenxuly.NgayXuLy);
                dynamicParameters.Add("@GhiChuXuLy", vanbandenxuly.GhiChuXuLy);
                dynamicParameters.Add("@NgayXemDeBiet", vanbandenxuly.NgayXemDeBiet);
                dynamicParameters.Add("@GhiChuXemDeBiet", vanbandenxuly.GhiChuXemDeBiet);
                dynamicParameters.Add("@NgayChuyenLanhDao", vanbandenxuly.NgayChuyenLanhDao);
                dynamicParameters.Add("@GhiChuChuyenLanhDao", vanbandenxuly.GhiChuChuyenLanhDao);
                dynamicParameters.Add("@NgaySaiXyLy", vanbandenxuly.NgaySaiXyLy);
                dynamicParameters.Add("@GhiChuSaiXuLy", vanbandenxuly.GhiChuSaiXuLy);
                dynamicParameters.Add("@NgaySaiChuyenLanhDao", vanbandenxuly.NgaySaiChuyenLanhDao);
                dynamicParameters.Add("@GhiChuSaiChuyenLanhDao", vanbandenxuly.GhiChuSaiChuyenLanhDao);
                dynamicParameters.Add("@NgayLanhDaoXem", vanbandenxuly.NgayLanhDaoXem);

                dynamicParameters.Add("@CreateBy", vanbandenxuly.CreateBy);
                dynamicParameters.Add("@CreateDate", vanbandenxuly.CreateDate);
                dynamicParameters.Add("@UpdateDate", vanbandenxuly.UpdateDate);
                dynamicParameters.Add("@UpdateBy", vanbandenxuly.UpdateBy);

                dynamicParameters.Add("@parameters", parameters);

                try
                {
                    var query = await sqlConnection.QueryAsync<VanBanDenXuLyViewModel>(
                        "VanBanDenXuLyAUD", dynamicParameters, commandType: CommandType.StoredProcedure);
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
