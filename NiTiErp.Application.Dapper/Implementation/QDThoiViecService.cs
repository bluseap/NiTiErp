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
    public class QDThoiViecService : IQDThoiViecService
    {
        private readonly IConfiguration _configuration;

        public QDThoiViecService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task<PagedResult<QDThoiViecViewModel>> GetAllThoiViecPaging(string corporationId, string phongId, string keyword, int page, int pageSize,
            string hosoId, string hosoId2, string hosoId3, string thoiviecId, string parameters)
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
                dynamicParameters.Add("@thoiviecId", thoiviecId);

                dynamicParameters.Add("@parameters", parameters);
                try
                {
                    var hoso = await sqlConnection.QueryAsync<QDThoiViecViewModel>(
                        "QDThoiViecGetList", dynamicParameters, commandType: CommandType.StoredProcedure);

                    var query = hoso.AsQueryable();

                    int totalRow = query.Count();

                    query = query.OrderByDescending(x => x.CreateDate)
                        .Skip((page - 1) * pageSize).Take(pageSize);

                    var data = query.ToList();

                    var paginationSet = new PagedResult<QDThoiViecViewModel>()
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

        public async Task<List<QDThoiViecViewModel>> GetListThoiViecPaging(string corporationId, string phongId, string keyword, int page, int pageSize,
            string hosoId, string hosoId2, string hosoId3, string thoiviecId, string parameters)
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
                dynamicParameters.Add("@thoiviecId", thoiviecId);

                dynamicParameters.Add("@parameters", parameters);
                try
                {
                    var thoiviec = await sqlConnection.QueryAsync<QDThoiViecViewModel>(
                        "QDThoiViecGetList", dynamicParameters, commandType: CommandType.StoredProcedure);

                    return thoiviec.AsList();

                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }

        public async Task<Boolean> QDThoiViecAUD(QDThoiViecViewModel thoiviec, string parameters)
        {
            using (var sqlConnection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                await sqlConnection.OpenAsync();
                var dynamicParameters = new DynamicParameters();

                dynamicParameters.Add("@Id", thoiviec.Id);
                dynamicParameters.Add("@HoSoNhanVienId", thoiviec.HoSoNhanVienId);

                dynamicParameters.Add("@LoaiQuyetDinhId", thoiviec.LoaiQuyetDinhId);
                dynamicParameters.Add("@LyDoQuyetDinh", thoiviec.LyDoQuyetDinh);

                dynamicParameters.Add("@GhiChuQuyetDinh", thoiviec.GhiChuQuyetDinh);
                dynamicParameters.Add("@SoQuyetDinh", thoiviec.SoQuyetDinh);
                dynamicParameters.Add("@NgayKyQuyetDinh", thoiviec.NgayKyQuyetDinh);
                dynamicParameters.Add("@TenNguoiKyQuyetDinh", thoiviec.TenNguoiKyQuyetDinh);
                dynamicParameters.Add("@NgayHieuLuc", thoiviec.NgayHieuLuc);
                dynamicParameters.Add("@NgayKetThuc", thoiviec.NgayKetThuc);

                dynamicParameters.Add("@CreateDate", thoiviec.CreateDate);
                dynamicParameters.Add("@CreateBy", thoiviec.CreateBy);
                dynamicParameters.Add("@UpdateDate", thoiviec.UpdateDate);
                dynamicParameters.Add("@UpdateBy", thoiviec.UpdateBy);

                dynamicParameters.Add("@parameters", parameters);
                try
                {
                    var query = await sqlConnection.QueryAsync<QDThoiViecViewModel>(
                        "QDThoiViecAUD", dynamicParameters, commandType: CommandType.StoredProcedure);

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
