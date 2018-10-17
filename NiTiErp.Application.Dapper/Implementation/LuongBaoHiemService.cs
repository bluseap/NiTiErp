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
    public class LuongBaoHiemService: ILuongBaoHiemService
    {
        private readonly IConfiguration _configuration;

        public LuongBaoHiemService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task<Boolean> LuongBaoHiemAUD(LuongBaoHiemViewModel luongbaohiem, string parameters)
        {
            using (var sqlConnection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                await sqlConnection.OpenAsync();
                var dynamicParameters = new DynamicParameters();

                dynamicParameters.Add("@Id", luongbaohiem.Id);

                dynamicParameters.Add("@nam", luongbaohiem.Nam);
                dynamicParameters.Add("@thang", luongbaohiem.Thang);

                dynamicParameters.Add("@HoSoNhanVienId", luongbaohiem.HoSoNhanVienId); 

                dynamicParameters.Add("@SoNgay", luongbaohiem.SoNgay);
                dynamicParameters.Add("@SoGioCong", luongbaohiem.SoGioCong);
                dynamicParameters.Add("@MucLuong", luongbaohiem.MucLuong);
                dynamicParameters.Add("@TienBaoHiem", luongbaohiem.TienBaoHiem);
                dynamicParameters.Add("@IsChuyenKy", luongbaohiem.IsChuyenKy);

                dynamicParameters.Add("@Ngay01", luongbaohiem.Ngay01);
                dynamicParameters.Add("@Ngay02", luongbaohiem.Ngay02);
                dynamicParameters.Add("@Ngay03", luongbaohiem.Ngay03);
                dynamicParameters.Add("@Ngay04", luongbaohiem.Ngay04);
                dynamicParameters.Add("@Ngay05", luongbaohiem.Ngay05);
                dynamicParameters.Add("@Ngay06", luongbaohiem.Ngay06);
                dynamicParameters.Add("@Ngay07", luongbaohiem.Ngay07);
                dynamicParameters.Add("@Ngay08", luongbaohiem.Ngay08);
                dynamicParameters.Add("@Ngay09", luongbaohiem.Ngay09);
                dynamicParameters.Add("@Ngay10", luongbaohiem.Ngay10);
                dynamicParameters.Add("@Ngay11", luongbaohiem.Ngay11);
                dynamicParameters.Add("@Ngay12", luongbaohiem.Ngay12);
                dynamicParameters.Add("@Ngay13", luongbaohiem.Ngay13);
                dynamicParameters.Add("@Ngay14", luongbaohiem.Ngay14);
                dynamicParameters.Add("@Ngay15", luongbaohiem.Ngay15);
                dynamicParameters.Add("@Ngay16", luongbaohiem.Ngay16);
                dynamicParameters.Add("@Ngay17", luongbaohiem.Ngay17);
                dynamicParameters.Add("@Ngay18", luongbaohiem.Ngay18);
                dynamicParameters.Add("@Ngay19", luongbaohiem.Ngay19);
                dynamicParameters.Add("@Ngay20", luongbaohiem.Ngay20);
                dynamicParameters.Add("@Ngay21", luongbaohiem.Ngay21);
                dynamicParameters.Add("@Ngay22", luongbaohiem.Ngay22);
                dynamicParameters.Add("@Ngay23", luongbaohiem.Ngay23);
                dynamicParameters.Add("@Ngay24", luongbaohiem.Ngay24);
                dynamicParameters.Add("@Ngay25", luongbaohiem.Ngay25);
                dynamicParameters.Add("@Ngay26", luongbaohiem.Ngay26);
                dynamicParameters.Add("@Ngay27", luongbaohiem.Ngay27);
                dynamicParameters.Add("@Ngay28", luongbaohiem.Ngay28);
                dynamicParameters.Add("@Ngay29", luongbaohiem.Ngay29);
                dynamicParameters.Add("@Ngay30", luongbaohiem.Ngay30);
                dynamicParameters.Add("@Ngay31", luongbaohiem.Ngay31);

                dynamicParameters.Add("@GhiChu", luongbaohiem.GhiChu);

                dynamicParameters.Add("@CreateDate", luongbaohiem.CreateDate);
                dynamicParameters.Add("@CreateBy", luongbaohiem.CreateBy);
                dynamicParameters.Add("@UpdateDate", luongbaohiem.UpdateDate);
                dynamicParameters.Add("@UpdateBy", luongbaohiem.UpdateBy);

                dynamicParameters.Add("@parameters", parameters);
                try
                {
                    var query = await sqlConnection.QueryAsync<LuongBaoHiemViewModel>(
                        "LuongBaoHiemAUD", dynamicParameters, commandType: CommandType.StoredProcedure);

                    return true;
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }

        public async Task<Boolean> LuongBaoHiemAUDXML(LuongBaoHiemViewModel luongbaohiemdm, string parameters)
        {
            using (var sqlConnection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                await sqlConnection.OpenAsync();
                var dynamicParameters = new DynamicParameters();

                dynamicParameters.Add("@StringXML", luongbaohiemdm.StringXML);

                dynamicParameters.Add("@parameters", parameters);
                try
                {
                    var query = await sqlConnection.QueryAsync<LuongBaoHiemViewModel>(
                        "LuongBaoHiemAUDXML", dynamicParameters, commandType: CommandType.StoredProcedure);

                    return true;
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }

        public async Task<List<LuongBaoHiemViewModel>> LuongBaoHiemGetList(Int64 luongbaohiemId, int nam, int thang, string corporationId, string phongId, 
            string chucvuId, Guid hosoId, string hesoluongdanhmucId, string bacluongId, string ngayId1, string ngayId2, string keyword, string parameters)
        {
            using (var sqlConnection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                await sqlConnection.OpenAsync();
                var dynamicParameters = new DynamicParameters();

                dynamicParameters.Add("@luongbaohiemId", luongbaohiemId);
                dynamicParameters.Add("@nam", nam);
                dynamicParameters.Add("@thang", thang);
                dynamicParameters.Add("@corporationId", corporationId);
                dynamicParameters.Add("@phongId", phongId);
                dynamicParameters.Add("@chucvuId", chucvuId);
                dynamicParameters.Add("@hosoId", hosoId);
                dynamicParameters.Add("@hesoluongdanhmucId", hesoluongdanhmucId);
                dynamicParameters.Add("@bacluongId", bacluongId);
                dynamicParameters.Add("@ngayId1", ngayId1);
                dynamicParameters.Add("@ngayId2", ngayId2);
                dynamicParameters.Add("@keyword", keyword);

                dynamicParameters.Add("@parameters", parameters);
                try
                {
                    var query = await sqlConnection.QueryAsync<LuongBaoHiemViewModel>(
                        "LuongBaoHiemGetList", dynamicParameters, commandType: CommandType.StoredProcedure);

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
