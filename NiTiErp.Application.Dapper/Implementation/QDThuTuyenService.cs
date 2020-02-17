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
    public class QDThuTuyenService : IQDThuTuyenService
    {
        private readonly IConfiguration _configuration;

        public QDThuTuyenService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task<PagedResult<QDThuTuyenViewModel>> GetAllThuTuyenPaging(string corporationId, string phongId, string keyword, int page, int pageSize,
            string hosoId, string hosoId2, string hosoId3, string thutuyenId, string parameters)
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
                dynamicParameters.Add("@thutuyenId", thutuyenId);

                dynamicParameters.Add("@parameters", parameters);
                try
                {
                    var hoso = await sqlConnection.QueryAsync<QDThuTuyenViewModel>(
                        "QDThuTuyenGetList", dynamicParameters, commandType: CommandType.StoredProcedure);

                    var query = hoso.AsQueryable();

                    int totalRow = query.Count();

                    query = query.OrderByDescending(x => x.CreateDate)
                        .Skip((page - 1) * pageSize).Take(pageSize);

                    var data = query.ToList();

                    var paginationSet = new PagedResult<QDThuTuyenViewModel>()
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

        public async Task<List<QDThuTuyenViewModel>> GetListThuTuyenPaging(string corporationId, string phongId, string keyword, int page, int pageSize,
            string hosoId, string hosoId2, string hosoId3, string thutuyenId, string parameters)
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
                dynamicParameters.Add("@thutuyenId", thutuyenId);

                dynamicParameters.Add("@parameters", parameters);
                try
                {
                    var thoiviec = await sqlConnection.QueryAsync<QDThuTuyenViewModel>(
                        "QDThuTuyenGetList", dynamicParameters, commandType: CommandType.StoredProcedure);

                    return thoiviec.AsList();

                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }

        public async Task<Boolean> QDThuTuyenAUD(QDThuTuyenViewModel thutuyen, string parameters)
        {
            using (var sqlConnection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                await sqlConnection.OpenAsync();
                var dynamicParameters = new DynamicParameters();

                dynamicParameters.Add("@Id", thutuyen.Id);
                dynamicParameters.Add("@HoSoNhanVienId", thutuyen.HoSoNhanVienId);

                dynamicParameters.Add("@LoaiQuyetDinhId", thutuyen.LoaiQuyetDinhId);
                dynamicParameters.Add("@LyDoQuyetDinh", thutuyen.LyDoQuyetDinh);

                dynamicParameters.Add("@GhiChuQuyetDinh", thutuyen.GhiChuQuyetDinh);
                dynamicParameters.Add("@SoQuyetDinh", thutuyen.SoQuyetDinh);
                dynamicParameters.Add("@NgayKyQuyetDinh", thutuyen.NgayKyQuyetDinh);
                dynamicParameters.Add("@TenNguoiKyQuyetDinh", thutuyen.TenNguoiKyQuyetDinh);
                dynamicParameters.Add("@NgayHieuLuc", thutuyen.NgayHieuLuc);
                dynamicParameters.Add("@NgayKetThuc", thutuyen.NgayKetThuc);

                dynamicParameters.Add("@CreateDate", thutuyen.CreateDate);
                dynamicParameters.Add("@CreateBy", thutuyen.CreateBy);
                dynamicParameters.Add("@UpdateDate", thutuyen.UpdateDate);
                dynamicParameters.Add("@UpdateBy", thutuyen.UpdateBy);

                dynamicParameters.Add("@parameters", parameters);
                try
                {
                    var query = await sqlConnection.QueryAsync<QDThuTuyenViewModel>(
                        "QDThuTuyenAUD", dynamicParameters, commandType: CommandType.StoredProcedure);

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
