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

        public async Task<List<VanBanDenXuLyViewModel>> VanBanDenXuLyGetId(long id, long vanbandenduyetId,
            Guid hosonhanvienxulyId, string tennhanvienxuly, DateTime tungaynhan, DateTime denngaynhan,
            DateTime tungayxuly, DateTime denngayxuly, string ghichu, bool IsXemDeBiet,
            bool IsChuyenLanhDao, bool IsSaiXuLy, bool IsSaiChuyenLanhDao, bool IsLanhDaoXem,
            string keyword, string parameters)
        {
            using (var sqlConnection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                await sqlConnection.OpenAsync();
                var dynamicParameters = new DynamicParameters();

                dynamicParameters.Add("@Id", id);
                dynamicParameters.Add("@VanBanDenDuyetId", vanbandenduyetId);
                dynamicParameters.Add("@HoSoNhanVienXuLyId", hosonhanvienxulyId);
                dynamicParameters.Add("@tennhanvienXuLy", tennhanvienxuly);
                dynamicParameters.Add("@tungaynhan", tungaynhan);
                dynamicParameters.Add("@denngaynhan", denngaynhan);
                dynamicParameters.Add("@tungayxuly", tungayxuly);
                dynamicParameters.Add("@denngayxuly", denngayxuly);
                dynamicParameters.Add("@ghichu", ghichu);
                dynamicParameters.Add("@IsXemDeBiet", IsXemDeBiet);
                dynamicParameters.Add("@IsChuyenLanhDao", IsChuyenLanhDao);
                dynamicParameters.Add("@IsSaiXuLy", IsSaiXuLy);
                dynamicParameters.Add("@IsSaiChuyenLanhDao", IsSaiChuyenLanhDao);
                dynamicParameters.Add("@IsLanhDaoXem", IsLanhDaoXem);
                dynamicParameters.Add("@keyword", keyword);                

                dynamicParameters.Add("@parameters", parameters);

                try
                {
                    var query = await sqlConnection.QueryAsync<VanBanDenXuLyViewModel>(
                        "VanBanDenXuLyGetList", dynamicParameters, commandType: CommandType.StoredProcedure);
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
