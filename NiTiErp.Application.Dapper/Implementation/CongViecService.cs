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
    public class CongViecService : ICongViecService
    {
        private readonly IConfiguration _configuration;

        public CongViecService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task<PagedResult<CongViecViewModel>> GetAllCongViecPaging(string corporationId, string phongId, string keyword, int page, int pageSize,
            string hosoId, string hosoId2, string hosoId3, string congviecId, string parameters)
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

                dynamicParameters.Add("@congviecId", congviecId);

                dynamicParameters.Add("@parameters", parameters);
                try
                {
                    var dangdoan = await sqlConnection.QueryAsync<CongViecViewModel>(
                        "CongViecGetList", dynamicParameters, commandType: CommandType.StoredProcedure);

                    var query = dangdoan.AsQueryable();

                    int totalRow = query.Count();

                    query = query.OrderByDescending(x => x.CreateDate)
                        .Skip((page - 1) * pageSize).Take(pageSize);

                    var data = query.ToList();

                    var paginationSet = new PagedResult<CongViecViewModel>()
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

        public async Task<Boolean> CongViecAUD(CongViecViewModel congviec, string parameters)
        {
            using (var sqlConnection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                await sqlConnection.OpenAsync();
                var dynamicParameters = new DynamicParameters();

                dynamicParameters.Add("@Id", congviec.Id);
                dynamicParameters.Add("@HoSoNhanVienId", congviec.HoSoNhanVienId);
                dynamicParameters.Add("@CorporationId", congviec.CorporationId);

                dynamicParameters.Add("@PhongDanhMucId", congviec.PhongDanhMucId);
                dynamicParameters.Add("@ChucVuCongTyId", congviec.ChucVuCongTyId);
                dynamicParameters.Add("@CongTacChinh", congviec.CongTacChinh);
                dynamicParameters.Add("@SoQuyetDinh", congviec.SoQuyetDinh);
                dynamicParameters.Add("@TenQuyetDinh", congviec.TenQuyetDinh);
                dynamicParameters.Add("@NgayKy", congviec.NgayKy);
                dynamicParameters.Add("@NgayHieuLuc", congviec.NgayHieuLuc);
                dynamicParameters.Add("@NgayKetThuc", congviec.NgayKetThuc);
                dynamicParameters.Add("@TenNguoiKy", congviec.TenNguoiKy);

                dynamicParameters.Add("@CreateDate", congviec.CreateDate);
                dynamicParameters.Add("@CreateBy", congviec.CreateBy);
                dynamicParameters.Add("@UpdateDate", congviec.UpdateDate);
                dynamicParameters.Add("@UpdareBy", congviec.UpdateBy);

                dynamicParameters.Add("@parameters", parameters);
                try
                {
                    var query = await sqlConnection.QueryAsync<CongViecViewModel>(
                        "CongViecAUD", dynamicParameters, commandType: CommandType.StoredProcedure);

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
