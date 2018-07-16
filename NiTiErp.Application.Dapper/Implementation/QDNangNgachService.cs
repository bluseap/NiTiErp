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
    public class QDNangNgachService : IQDNangNgachService
    {
        private readonly IConfiguration _configuration;

        public QDNangNgachService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task<PagedResult<QDNangNgachViewModel>> GetAllNangNgachPaging(string corporationId, string phongId, string keyword, int page, int pageSize,
            string hosoId, string hosoId2, string hosoId3, string nangngachId, string parameters)
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
                dynamicParameters.Add("@nangngachId", nangngachId);

                dynamicParameters.Add("@parameters", parameters);
                try
                {
                    var hoso = await sqlConnection.QueryAsync<QDNangNgachViewModel>(
                        "QDNangNgachGetList", dynamicParameters, commandType: CommandType.StoredProcedure);

                    var query = hoso.AsQueryable();

                    int totalRow = query.Count();

                    query = query.OrderByDescending(x => x.CreateDate)
                        .Skip((page - 1) * pageSize).Take(pageSize);

                    var data = query.ToList();

                    var paginationSet = new PagedResult<QDNangNgachViewModel>()
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

        public async Task<List<QDNangNgachViewModel>> GetListNangNgachPaging(string corporationId, string phongId, string keyword, int page, int pageSize,
            string hosoId, string hosoId2, string hosoId3, string nangngachId, string parameters)
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
                dynamicParameters.Add("@nangngachId", nangngachId);

                dynamicParameters.Add("@parameters", parameters);
                try
                {
                    var nangngach = await sqlConnection.QueryAsync<QDNangNgachViewModel>(
                        "QDNangNgachGetList", dynamicParameters, commandType: CommandType.StoredProcedure);

                    return nangngach.AsList();

                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }

        public async Task<Boolean> QDNangNgachAUD(QDNangNgachViewModel nangngach, string parameters)
        {
            using (var sqlConnection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                await sqlConnection.OpenAsync();
                var dynamicParameters = new DynamicParameters();

                dynamicParameters.Add("@Id", nangngach.Id);
                dynamicParameters.Add("@HoSoNhanVienId", nangngach.HoSoNhanVienId);

                dynamicParameters.Add("@LoaiQuyetDinhId", nangngach.LoaiQuyetDinhId);
                dynamicParameters.Add("@LyDoQuyetDinh", nangngach.LyDoQuyetDinh);
                //dynamicParameters.Add("@TienKhenThuong", khenthuong.TienKhenThuong);
                //dynamicParameters.Add("@HinhThucKhenThuongId", khenthuong.HinhThucKhenThuongId);
                dynamicParameters.Add("@GhiChuQuyetDinh", nangngach.GhiChuQuyetDinh);
                dynamicParameters.Add("@SoQuyetDinh", nangngach.SoQuyetDinh);
                dynamicParameters.Add("@NgayKyQuyetDinh", nangngach.NgayKyQuyetDinh);
                dynamicParameters.Add("@TenNguoiKyQuyetDinh", nangngach.TenNguoiKyQuyetDinh);
                dynamicParameters.Add("@NgayHieuLuc", nangngach.NgayHieuLuc);
                dynamicParameters.Add("@NgayKetThuc", nangngach.NgayKetThuc);

                dynamicParameters.Add("@HeSoLuongDanhMucCuId", nangngach.HeSoLuongDanhMucCuId);
                dynamicParameters.Add("@ChucVuNhanVienCuId", nangngach.ChucVuNhanVienCuId);
                dynamicParameters.Add("@HeSoCu", nangngach.HeSoCu);
                dynamicParameters.Add("@MucLuongCu", nangngach.MucLuongCu);
                dynamicParameters.Add("@BacLuongCuId", nangngach.BacLuongCuId);

                dynamicParameters.Add("@HeSoLuongDanhMucMoiId", nangngach.HeSoLuongDanhMucMoiId);
                dynamicParameters.Add("@ChucVuNhanVienMoiId", nangngach.ChucVuNhanVienMoiId);
                dynamicParameters.Add("@HeSoMoi", nangngach.HeSoMoi);
                dynamicParameters.Add("@MucLuongMoi", nangngach.MucLuongMoi);
                dynamicParameters.Add("@BacLuongMoiId", nangngach.BacLuongMoiId);

                dynamicParameters.Add("@CreateDate", nangngach.CreateDate);
                dynamicParameters.Add("@CreateBy", nangngach.CreateBy);
                dynamicParameters.Add("@UpdateDate", nangngach.UpdateDate);
                dynamicParameters.Add("@UpdateBy", nangngach.UpdateBy);

                dynamicParameters.Add("@parameters", parameters);
                try
                {
                    var query = await sqlConnection.QueryAsync<QDNangNgachViewModel>(
                        "QDNangNgachAUD", dynamicParameters, commandType: CommandType.StoredProcedure);

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
