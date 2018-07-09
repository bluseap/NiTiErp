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
    public class QDKhenThuongService : IQDKhenThuongService
    {
        private readonly IConfiguration _configuration;

        public QDKhenThuongService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task<PagedResult<QDKhenThuongViewModel>> GetAllKhenThuongPaging(string corporationId, string phongId, string keyword, int page, int pageSize,
            string hosoId, string hosoId2, string hosoId3, string khenthuongId, string parameters)
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
                dynamicParameters.Add("@khenthuongId", khenthuongId);

                dynamicParameters.Add("@parameters", parameters);
                try
                {
                    var hoso = await sqlConnection.QueryAsync<QDKhenThuongViewModel>(
                        "QDKhenThuongGetList", dynamicParameters, commandType: CommandType.StoredProcedure);

                    var query = hoso.AsQueryable();

                    int totalRow = query.Count();

                    query = query.OrderByDescending(x => x.CreateDate)
                        .Skip((page - 1) * pageSize).Take(pageSize);

                    var data = query.ToList();

                    var paginationSet = new PagedResult<QDKhenThuongViewModel>()
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

        public async Task<List<QDKhenThuongViewModel>> GetListKhenThuongPaging(string corporationId, string phongId, string keyword, int page, int pageSize,
            string hosoId, string hosoId2, string hosoId3, string khenthuongId, string parameters)
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
                dynamicParameters.Add("@khenthuongId", khenthuongId);

                dynamicParameters.Add("@parameters", parameters);
                try
                {
                    var khenthuong = await sqlConnection.QueryAsync<QDKhenThuongViewModel>(
                        "QDKhenThuongGetList", dynamicParameters, commandType: CommandType.StoredProcedure);

                    return khenthuong.AsList();
                    
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }

        public async Task<Boolean> QDKhenThuongAUD(QDKhenThuongViewModel khenthuong, string parameters)
        {
            using (var sqlConnection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                await sqlConnection.OpenAsync();
                var dynamicParameters = new DynamicParameters();

                dynamicParameters.Add("@Id", khenthuong.Id);
                dynamicParameters.Add("@HoSoNhanVienId", khenthuong.HoSoNhanVienId);

                dynamicParameters.Add("@LoaiQuyetDinhId", khenthuong.LoaiQuyetDinhId);
                dynamicParameters.Add("@LyDoQuyetDinh", khenthuong.LyDoQuyetDinh);
                dynamicParameters.Add("@TienKhenThuong", khenthuong.TienKhenThuong);
                dynamicParameters.Add("@HinhThucKhenThuongId", khenthuong.HinhThucKhenThuongId);
                dynamicParameters.Add("@GhiChuQuyetDinh", khenthuong.GhiChuQuyetDinh);
                dynamicParameters.Add("@SoQuyetDinh", khenthuong.SoQuyetDinh);
                dynamicParameters.Add("@NgayKyQuyetDinh", khenthuong.NgayKyQuyetDinh);
                dynamicParameters.Add("@TenNguoiKyQuyetDinh", khenthuong.TenNguoiKyQuyetDinh);
                dynamicParameters.Add("@NgayHieuLuc", khenthuong.NgayHieuLuc);
                dynamicParameters.Add("@NgayKetThuc", khenthuong.NgayKetThuc);
                
                dynamicParameters.Add("@CreateDate", khenthuong.CreateDate);
                dynamicParameters.Add("@CreateBy", khenthuong.CreateBy);
                dynamicParameters.Add("@UpdateDate", khenthuong.UpdateDate);
                dynamicParameters.Add("@UpdateBy", khenthuong.UpdateBy);

                dynamicParameters.Add("@parameters", parameters);
                try
                {
                    var query = await sqlConnection.QueryAsync<QDKhenThuongViewModel>(
                        "QDKhenThuongAUD", dynamicParameters, commandType: CommandType.StoredProcedure);

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
