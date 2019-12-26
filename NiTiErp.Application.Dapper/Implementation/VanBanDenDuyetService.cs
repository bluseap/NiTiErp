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
    public class VanBanDenDuyetService : IVanBanDenDuyetService
    {
        private readonly IConfiguration _configuration;

        public VanBanDenDuyetService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task<Boolean> VanBanDenDuyetAUD(VanBanDenDuyetViewModel vanbandenduyet, string parameters)
        {
            using (var sqlConnection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                await sqlConnection.OpenAsync();
                var dynamicParameters = new DynamicParameters();

                dynamicParameters.Add("@Id", vanbandenduyet.Id);

                dynamicParameters.Add("@VanBanDenId", vanbandenduyet.VanBanDenId);
                dynamicParameters.Add("@HoSoNhanVienDuyetId", vanbandenduyet.HoSoNhanVienDuyetId);
                dynamicParameters.Add("@NgayNhanVanBan", vanbandenduyet.NgayNhanVanBan);
                dynamicParameters.Add("@NgaySaiNhanVanBan", vanbandenduyet.NgaySaiNhanVanBan);
                dynamicParameters.Add("@NgayDuyet", vanbandenduyet.NgayDuyet);
                dynamicParameters.Add("@HanXuLy", vanbandenduyet.HanXuLy);
                dynamicParameters.Add("@ButPheLanhDao", vanbandenduyet.ButPheLanhDao);
                dynamicParameters.Add("@GhiChu", vanbandenduyet.GhiChu);
                dynamicParameters.Add("@IsChuyenChuyenMon", vanbandenduyet.IsChuyenChuyenMon);
                dynamicParameters.Add("@VanBanPhoiHopXuLyId", vanbandenduyet.VanBanPhoiHopXuLyId);
                dynamicParameters.Add("@VanBanNhomXuLyId", vanbandenduyet.VanBanNhomXuLyId);
                dynamicParameters.Add("@NgayChuyenChuyenMon", vanbandenduyet.NgayChuyenChuyenMon);
                dynamicParameters.Add("@GhiChuChuyenChuyenMon", vanbandenduyet.GhiChuChuyenChuyenMon);
                dynamicParameters.Add("@IsSaiChuyenMon", vanbandenduyet.IsSaiChuyenMon);
                dynamicParameters.Add("@NgaySaiChuyenMon", vanbandenduyet.NgaySaiChuyenMon);
                dynamicParameters.Add("@GhiChuSaiChuyenMon", vanbandenduyet.GhiChuSaiChuyenMon);
                dynamicParameters.Add("@IsDuyetPhatHanh", vanbandenduyet.IsDuyetPhatHanh);
                dynamicParameters.Add("@NgayDuyetPhatHanh", vanbandenduyet.NgayDuyetPhatHanh);
                dynamicParameters.Add("@GhiChuPhatHanh", vanbandenduyet.GhiChuPhatHanh);
                dynamicParameters.Add("@IsDangXuLyXem", vanbandenduyet.IsDangXuLyXem);
                dynamicParameters.Add("@IsXuLyXem", vanbandenduyet.IsXuLyXem);
                dynamicParameters.Add("@Stt", vanbandenduyet.Stt);

                dynamicParameters.Add("@CreateBy", vanbandenduyet.CreateBy);
                dynamicParameters.Add("@CreateDate", vanbandenduyet.CreateDate);
                dynamicParameters.Add("@UpdateDate", vanbandenduyet.UpdateDate);
                dynamicParameters.Add("@UpdateBy", vanbandenduyet.UpdateBy);

                dynamicParameters.Add("@parameters", parameters);

                try
                {
                    var query = await sqlConnection.QueryAsync<VanBanDenDuyetViewModel>(
                        "VanBanDenDuyetAUD", dynamicParameters, commandType: CommandType.StoredProcedure);
                    return true;
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }

        public async Task<List<VanBanDenDuyetViewModel>> VanBanDenDuyetGetId(long id, long vanbandenId, 
            Guid hosonhanvienduyetId, string tennhanvienduyet, DateTime tungaynhan, DateTime denngaynhan,
            DateTime tungayduyet, DateTime denngayduyet, string butphelanhdao, bool isChuyenChuyenMon,
            int vanbanphoihopxulyId, int vanbannhomxulyId, bool issaiChuyenMon, bool isDuyetPhatHanh,
            int isDangXuLyXem, bool isXuLyXem, string keyWord, string ghiChu,
            string parameters)
        {
            using (var sqlConnection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                await sqlConnection.OpenAsync();
                var dynamicParameters = new DynamicParameters();

                dynamicParameters.Add("@Id", id);
                dynamicParameters.Add("@VanBanDenId", vanbandenId);
                dynamicParameters.Add("@HoSoNhanVienDuyetId", hosonhanvienduyetId);
                dynamicParameters.Add("@tennhanvienduyet", tennhanvienduyet);
                dynamicParameters.Add("@tungaynhan", tungaynhan);
                dynamicParameters.Add("@denngaynhan", denngaynhan);
                dynamicParameters.Add("@tungayduyet", tungayduyet);
                dynamicParameters.Add("@denngayduyet", denngayduyet);
                dynamicParameters.Add("@ButPheLanhDao", butphelanhdao);
                dynamicParameters.Add("@IsChuyenChuyenMon", isChuyenChuyenMon);
                dynamicParameters.Add("@VanBanPhoiHopXuLyId", vanbanphoihopxulyId);
                dynamicParameters.Add("@VanBanNhomXuLyId", vanbannhomxulyId);
                dynamicParameters.Add("@IsSaiChuyenMon", issaiChuyenMon);
                dynamicParameters.Add("@IsDuyetPhatHanh", isDuyetPhatHanh);
                dynamicParameters.Add("@IsDangXuLyXem", isDangXuLyXem);
                dynamicParameters.Add("@IsXuLyXem", isXuLyXem);
                dynamicParameters.Add("@keyword", keyWord);
                dynamicParameters.Add("@GhiChu", ghiChu);

                dynamicParameters.Add("@parameters", parameters);

                try
                {
                    var query = await sqlConnection.QueryAsync<VanBanDenDuyetViewModel>(
                        "VanBanDenDuyetGetList", dynamicParameters, commandType: CommandType.StoredProcedure);
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
