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
    public class QuanLyVanBanService: IQuanLyVanBanService
    {
        private readonly IConfiguration _configuration;

        public QuanLyVanBanService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task<PagedResult<QuanLyVanBanViewModel>> GetAllQuanLyVanBanPaging(string makv, int namhinhthanh, string SoVaKyHieu,
            DateTime thoigianbatdau, DateTime thoigianketthuc, decimal tongsovanban, decimal tongsotrang,
            string keyword, int page, int pageSize, long quanlyvanbanid, string ghichu, string parameters)
        {
            using (var sqlConnection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                await sqlConnection.OpenAsync();
                var dynamicParameters = new DynamicParameters();

                dynamicParameters.Add("@corporationId", makv);
                dynamicParameters.Add("@namhinhthanh", namhinhthanh);
                dynamicParameters.Add("@SoVaKyHieu", SoVaKyHieu);
                dynamicParameters.Add("@thoigianbatdau", thoigianbatdau);
                dynamicParameters.Add("@thoigianketthuc", thoigianketthuc);
                dynamicParameters.Add("@tongsovanban", tongsovanban);
                dynamicParameters.Add("@tongsotrang", tongsotrang);

                dynamicParameters.Add("@keyword", keyword);
                dynamicParameters.Add("@quanlyvanbanid", quanlyvanbanid);
                dynamicParameters.Add("@ghichu", ghichu);

                dynamicParameters.Add("@parameters", parameters);
                try
                {
                    var hoso = await sqlConnection.QueryAsync<QuanLyVanBanViewModel>(
                        "QuanLyVanBanGetList", dynamicParameters, commandType: CommandType.StoredProcedure);

                    var query = hoso.AsQueryable();

                    int totalRow = query.Count();

                    query = query.OrderByDescending(x => x.CreateDate)
                        .Skip((page - 1) * pageSize).Take(pageSize);

                    var data = query.ToList();

                    var paginationSet = new PagedResult<QuanLyVanBanViewModel>()
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

        public async Task<List<QuanLyVanBanViewModel>> QuanLyVanBanGetList(string makv, int namhinhthanh, string SoVaKyHieu,
            DateTime thoigianbatdau, DateTime thoigianketthuc, decimal tongsovanban, decimal tongsotrang,
            string keyword, int page, int pageSize, long quanlyvanbanid, string ghichu, string parameters)
        {
            using (var sqlConnection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                await sqlConnection.OpenAsync();
                var dynamicParameters = new DynamicParameters();

                dynamicParameters.Add("@corporationId", makv);
                dynamicParameters.Add("@namhinhthanh", namhinhthanh);
                dynamicParameters.Add("@SoVaKyHieu", SoVaKyHieu);
                dynamicParameters.Add("@thoigianbatdau", thoigianbatdau);
                dynamicParameters.Add("@thoigianketthuc", thoigianketthuc);
                dynamicParameters.Add("@tongsovanban", tongsovanban);
                dynamicParameters.Add("@tongsotrang", tongsotrang);

                dynamicParameters.Add("@keyword", keyword);
                dynamicParameters.Add("@quanlyvanbanid", quanlyvanbanid);
                dynamicParameters.Add("@ghichu", ghichu);

                dynamicParameters.Add("@parameters", parameters);

                try
                {
                    var query = await sqlConnection.QueryAsync<QuanLyVanBanViewModel>(
                        "QuanLyVanBanGetList", dynamicParameters, commandType: CommandType.StoredProcedure);

                    return query.AsList();
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }

        public async Task<Boolean> QuanLyVanBanAUD(QuanLyVanBanViewModel qlvb, string parameters)
        {
            using (var sqlConnection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                await sqlConnection.OpenAsync();
                var dynamicParameters = new DynamicParameters();

                dynamicParameters.Add("@Id", qlvb.Id);

                dynamicParameters.Add("@Corporation", qlvb.Corporation);
                dynamicParameters.Add("@NamHinhThanh", qlvb.NamHinhThanh);
                dynamicParameters.Add("@SoVaKyHieu", qlvb.SoVaKyHieu);
                dynamicParameters.Add("@TieuDe", qlvb.TieuDe);
                dynamicParameters.Add("@ThoiHanBaoQuan", qlvb.ThoiHanBaoQuan);
                dynamicParameters.Add("@CheDoSuDung", qlvb.CheDoSuDung);
                dynamicParameters.Add("@NguoiLap", qlvb.NguoiLap);
                dynamicParameters.Add("@LanguageId", qlvb.LanguageId);
                dynamicParameters.Add("@ThoiGianBatDau", qlvb.ThoiGianBatDau);
                dynamicParameters.Add("@ThoiGianKetThuc", qlvb.ThoiGianKetThuc);
                dynamicParameters.Add("@TongSoVBTrongHoSo", qlvb.TongSoVBTrongHoSo);
                dynamicParameters.Add("@TongSoTrangTrongHoSo", qlvb.TongSoTrangTrongHoSo);
                dynamicParameters.Add("@GhiChu", qlvb.GhiChu);
                dynamicParameters.Add("@Stt", qlvb.Stt);

                dynamicParameters.Add("@CreateBy", qlvb.CreateBy);
                dynamicParameters.Add("@CreateDate", qlvb.CreateDate);
                dynamicParameters.Add("@UpdateDate", qlvb.UpdateDate);
                dynamicParameters.Add("@UpdateBy", qlvb.UpdateBy);

                dynamicParameters.Add("@parameters", parameters);
                try
                {
                    var query = await sqlConnection.QueryAsync<QuanLyVanBanViewModel>(
                        "QuanLyVanBanAUD", dynamicParameters, commandType: CommandType.StoredProcedure);
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
