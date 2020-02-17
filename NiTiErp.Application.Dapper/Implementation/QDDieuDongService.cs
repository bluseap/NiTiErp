using Dapper;
using Microsoft.Extensions.Configuration;
using NiTiErp.Application.Dapper.Interfaces;
using NiTiErp.Application.Dapper.ViewModels;
using NiTiErp.Utilities.Dtos;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;

namespace NiTiErp.Application.Dapper.Implementation
{
    public class QDDieuDongService : IQDDieuDongService
    {
        private readonly IConfiguration _configuration;

        public QDDieuDongService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task<PagedResult<QDDieuDongViewModel>> GetAllDieuDongPaging(string corporationId, string phongId, string keyword, int page, int pageSize,
            string hosoId, string hosoId2, string hosoId3, string dieudongId, string parameters)
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
                dynamicParameters.Add("@hosoId3", hosoId3);
                dynamicParameters.Add("@dieudongId", dieudongId);

                dynamicParameters.Add("@parameters", parameters);
                try
                {
                    var hoso = await sqlConnection.QueryAsync<QDDieuDongViewModel>(
                        "QDDieuDongGetList", dynamicParameters, commandType: CommandType.StoredProcedure);

                    var query = hoso.AsQueryable();

                    int totalRow = query.Count();

                    query = query.OrderByDescending(x => x.CreateDate)
                        .Skip((page - 1) * pageSize).Take(pageSize);

                    var data = query.ToList();

                    var paginationSet = new PagedResult<QDDieuDongViewModel>()
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

        public async Task<List<QDDieuDongViewModel>> GetListDieuDongPaging(string corporationId, string phongId, string keyword, int page, int pageSize,
            string hosoId, string hosoId2, string hosoId3, string dieudongId, string parameters)
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
                dynamicParameters.Add("@hosoId3", hosoId3);
                dynamicParameters.Add("@dieudongId", dieudongId);

                dynamicParameters.Add("@parameters", parameters);
                try
                {
                    var dieudong = await sqlConnection.QueryAsync<QDDieuDongViewModel>(
                        "QDDieuDongGetList", dynamicParameters, commandType: CommandType.StoredProcedure);

                    return dieudong.AsList();

                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }

        public async Task<Boolean> QDDieuDongAUD(QDDieuDongViewModel dieudong, string parameters)
        {
            using (var sqlConnection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                await sqlConnection.OpenAsync();
                var dynamicParameters = new DynamicParameters();

                dynamicParameters.Add("@Id", dieudong.Id);
                dynamicParameters.Add("@HoSoNhanVienId", dieudong.HoSoNhanVienId);

                dynamicParameters.Add("@LoaiQuyetDinhId", dieudong.LoaiQuyetDinhId);
                dynamicParameters.Add("@LyDoQuyetDinh", dieudong.LyDoQuyetDinh);
                //dynamicParameters.Add("@TienKhenThuong", khenthuong.TienKhenThuong);
                //dynamicParameters.Add("@HinhThucKhenThuongId", khenthuong.HinhThucKhenThuongId);
                dynamicParameters.Add("@GhiChuQuyetDinh", dieudong.GhiChuQuyetDinh);
                dynamicParameters.Add("@SoQuyetDinh", dieudong.SoQuyetDinh);
                dynamicParameters.Add("@NgayKyQuyetDinh", dieudong.NgayKyQuyetDinh);
                dynamicParameters.Add("@TenNguoiKyQuyetDinh", dieudong.TenNguoiKyQuyetDinh);
                dynamicParameters.Add("@NgayHieuLuc", dieudong.NgayHieuLuc);
                dynamicParameters.Add("@NgayKetThuc", dieudong.NgayKetThuc);

                dynamicParameters.Add("@CorporationCuId", dieudong.CorporationCuId);
                dynamicParameters.Add("@PhongBanDanhMucCuId", dieudong.PhongBanDanhMucCuId);
                dynamicParameters.Add("@ChucVuNhanVienCuId", dieudong.ChucVuNhanVienCuId);

                dynamicParameters.Add("@CorporationMoiId", dieudong.CorporationMoiId);
                dynamicParameters.Add("@PhongBanDanhMucMoiId", dieudong.PhongBanDanhMucMoiId);
                dynamicParameters.Add("@ChucVuNhanVienMoiId", dieudong.ChucVuNhanVienMoiId);

                dynamicParameters.Add("@CreateDate", dieudong.CreateDate);
                dynamicParameters.Add("@CreateBy", dieudong.CreateBy);
                dynamicParameters.Add("@UpdateDate", dieudong.UpdateDate);
                dynamicParameters.Add("@UpdateBy", dieudong.UpdateBy);

                dynamicParameters.Add("@parameters", parameters);
                try
                {
                    var query = await sqlConnection.QueryAsync<QDDieuDongViewModel>(
                        "QDDieuDongAUD", dynamicParameters, commandType: CommandType.StoredProcedure);

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
