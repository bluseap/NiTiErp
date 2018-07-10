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
    public class QDKyLuatService : IQDKyLuatService
    {
        private readonly IConfiguration _configuration;

        public QDKyLuatService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task<PagedResult<QDKyLuatViewModel>> GetAllKyLuatPaging(string corporationId, string phongId, string keyword, int page, int pageSize,
            string hosoId, string hosoId2, string hosoId3, string kyluatId, string parameters)
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
                dynamicParameters.Add("@kyluatId", kyluatId);

                dynamicParameters.Add("@parameters", parameters);
                try
                {
                    var kyluat = await sqlConnection.QueryAsync<QDKyLuatViewModel>(
                        "QDKyLuatGetList", dynamicParameters, commandType: CommandType.StoredProcedure);

                    var query = kyluat.AsQueryable();

                    int totalRow = query.Count();

                    query = query.OrderByDescending(x => x.CreateDate)
                        .Skip((page - 1) * pageSize).Take(pageSize);

                    var data = query.ToList();

                    var paginationSet = new PagedResult<QDKyLuatViewModel>()
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

        public async Task<List<QDKyLuatViewModel>> GetListKyLuatPaging(string corporationId, string phongId, string keyword, int page, int pageSize,
            string hosoId, string hosoId2, string hosoId3, string kyluatId, string parameters)
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
                dynamicParameters.Add("@kyluatId", kyluatId);

                dynamicParameters.Add("@parameters", parameters);
                try
                {
                    var kyluat = await sqlConnection.QueryAsync<QDKyLuatViewModel>(
                        "QDKyLuatGetList", dynamicParameters, commandType: CommandType.StoredProcedure);

                    return kyluat.AsList();

                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }

        public async Task<Boolean> QDKyLuatAUD(QDKyLuatViewModel kyluat, string parameters)
        {
            using (var sqlConnection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                await sqlConnection.OpenAsync();
                var dynamicParameters = new DynamicParameters();

                dynamicParameters.Add("@Id", kyluat.Id);
                dynamicParameters.Add("@HoSoNhanVienId", kyluat.HoSoNhanVienId);

                dynamicParameters.Add("@LoaiQuyetDinhId", kyluat.LoaiQuyetDinhId);
                dynamicParameters.Add("@LyDoQuyetDinh", kyluat.LyDoQuyetDinh);
                dynamicParameters.Add("@TienKyLuat", kyluat.TienKyLuat);                
                dynamicParameters.Add("@HinhThucKyLuatId", kyluat.HinhThucKyLuatId);
                dynamicParameters.Add("@GhiChuQuyetDinh", kyluat.GhiChuQuyetDinh);
                dynamicParameters.Add("@SoQuyetDinh", kyluat.SoQuyetDinh);
                dynamicParameters.Add("@NgayKyQuyetDinh", kyluat.NgayKyQuyetDinh);
                dynamicParameters.Add("@TenNguoiKyQuyetDinh", kyluat.TenNguoiKyQuyetDinh);
                dynamicParameters.Add("@NgayHieuLuc", kyluat.NgayHieuLuc);
                dynamicParameters.Add("@NgayKetThuc", kyluat.NgayKetThuc);

                dynamicParameters.Add("@CreateDate", kyluat.CreateDate);
                dynamicParameters.Add("@CreateBy", kyluat.CreateBy);
                dynamicParameters.Add("@UpdateDate", kyluat.UpdateDate);
                dynamicParameters.Add("@UpdateBy", kyluat.UpdateBy);

                dynamicParameters.Add("@parameters", parameters);
                try
                {
                    var query = await sqlConnection.QueryAsync<QDKyLuatViewModel>(
                        "QDKyLuatAUD", dynamicParameters, commandType: CommandType.StoredProcedure);

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
