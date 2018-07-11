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
    public class QDBoNhiemService : IQDBoNhiemService
    {
        private readonly IConfiguration _configuration;

        public QDBoNhiemService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task<PagedResult<QDBoNhiemViewModel>> GetAllBoNhiemPaging(string corporationId, string phongId, string keyword, int page, int pageSize,
            string hosoId, string hosoId2, string hosoId3, string bonhiemId, string parameters)
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
                dynamicParameters.Add("@bonhiemId", bonhiemId);

                dynamicParameters.Add("@parameters", parameters);
                try
                {
                    var hoso = await sqlConnection.QueryAsync<QDBoNhiemViewModel>(
                        "QDBoNhiemGetList", dynamicParameters, commandType: CommandType.StoredProcedure);

                    var query = hoso.AsQueryable();

                    int totalRow = query.Count();

                    query = query.OrderByDescending(x => x.CreateDate)
                        .Skip((page - 1) * pageSize).Take(pageSize);

                    var data = query.ToList();

                    var paginationSet = new PagedResult<QDBoNhiemViewModel>()
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

        public async Task<List<QDBoNhiemViewModel>> GetListBoNhiemPaging(string corporationId, string phongId, string keyword, int page, int pageSize,
            string hosoId, string hosoId2, string hosoId3, string bonhiemId, string parameters)
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
                dynamicParameters.Add("@bonhiemId", bonhiemId);

                dynamicParameters.Add("@parameters", parameters);
                try
                {
                    var bonhiem = await sqlConnection.QueryAsync<QDBoNhiemViewModel>(
                        "QDBoNhiemGetList", dynamicParameters, commandType: CommandType.StoredProcedure);

                    return bonhiem.AsList();

                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }

        public async Task<Boolean> QDBoNhiemAUD(QDBoNhiemViewModel bonhiem, string parameters)
        {
            using (var sqlConnection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                await sqlConnection.OpenAsync();
                var dynamicParameters = new DynamicParameters();

                dynamicParameters.Add("@Id", bonhiem.Id);
                dynamicParameters.Add("@HoSoNhanVienId", bonhiem.HoSoNhanVienId);

                dynamicParameters.Add("@LoaiQuyetDinhId", bonhiem.LoaiQuyetDinhId);
                dynamicParameters.Add("@LyDoQuyetDinh", bonhiem.LyDoQuyetDinh);
                //dynamicParameters.Add("@TienKhenThuong", khenthuong.TienKhenThuong);
                //dynamicParameters.Add("@HinhThucKhenThuongId", khenthuong.HinhThucKhenThuongId);
                dynamicParameters.Add("@GhiChuQuyetDinh", bonhiem.GhiChuQuyetDinh);
                dynamicParameters.Add("@SoQuyetDinh", bonhiem.SoQuyetDinh);
                dynamicParameters.Add("@NgayKyQuyetDinh", bonhiem.NgayKyQuyetDinh);
                dynamicParameters.Add("@TenNguoiKyQuyetDinh", bonhiem.TenNguoiKyQuyetDinh);
                dynamicParameters.Add("@NgayHieuLuc", bonhiem.NgayHieuLuc);
                dynamicParameters.Add("@NgayKetThuc", bonhiem.NgayKetThuc);

                dynamicParameters.Add("@CreateDate", bonhiem.CreateDate);
                dynamicParameters.Add("@CreateBy", bonhiem.CreateBy);
                dynamicParameters.Add("@UpdateDate", bonhiem.UpdateDate);
                dynamicParameters.Add("@UpdateBy", bonhiem.UpdateBy);

                dynamicParameters.Add("@parameters", parameters);
                try
                {
                    var query = await sqlConnection.QueryAsync<QDBoNhiemViewModel>(
                        "QDBoNhiemAUD", dynamicParameters, commandType: CommandType.StoredProcedure);

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
