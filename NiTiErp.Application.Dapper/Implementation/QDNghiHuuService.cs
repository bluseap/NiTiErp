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
    public class QDNghiHuuService : IQDNghiHuuService
    {
        private readonly IConfiguration _configuration;

        public QDNghiHuuService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task<PagedResult<QDNghiHuuViewModel>> GetAllNghiHuuPaging(string corporationId, string phongId, string keyword, int page, int pageSize,
            string hosoId, string hosoId2, string hosoId3, string nghihuuId, string parameters)
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
                dynamicParameters.Add("@nghihuuId", nghihuuId);

                dynamicParameters.Add("@parameters", parameters);
                try
                {
                    var hoso = await sqlConnection.QueryAsync<QDNghiHuuViewModel>(
                        "QDNghiHuuGetList", dynamicParameters, commandType: CommandType.StoredProcedure);

                    var query = hoso.AsQueryable();

                    int totalRow = query.Count();

                    query = query.OrderByDescending(x => x.CreateDate)
                        .Skip((page - 1) * pageSize).Take(pageSize);

                    var data = query.ToList();

                    var paginationSet = new PagedResult<QDNghiHuuViewModel>()
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

        public async Task<List<QDNghiHuuViewModel>> GetListNghiHuuPaging(string corporationId, string phongId, string keyword, int page, int pageSize,
            string hosoId, string hosoId2, string hosoId3, string nghihuuId, string parameters)
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
                dynamicParameters.Add("@nghihuuId", nghihuuId);

                dynamicParameters.Add("@parameters", parameters);
                try
                {
                    var nghihuu = await sqlConnection.QueryAsync<QDNghiHuuViewModel>(
                        "QDNghiHuuGetList", dynamicParameters, commandType: CommandType.StoredProcedure);

                    return nghihuu.AsList();

                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }

        public async Task<Boolean> QDNghiHuuAUD(QDNghiHuuViewModel nghihuu, string parameters)
        {
            using (var sqlConnection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                await sqlConnection.OpenAsync();
                var dynamicParameters = new DynamicParameters();

                dynamicParameters.Add("@Id", nghihuu.Id);
                dynamicParameters.Add("@HoSoNhanVienId", nghihuu.HoSoNhanVienId);

                dynamicParameters.Add("@LoaiQuyetDinhId", nghihuu.LoaiQuyetDinhId);
                dynamicParameters.Add("@LyDoQuyetDinh", nghihuu.LyDoQuyetDinh);

                dynamicParameters.Add("@GhiChuQuyetDinh", nghihuu.GhiChuQuyetDinh);
                dynamicParameters.Add("@SoQuyetDinh", nghihuu.SoQuyetDinh);
                dynamicParameters.Add("@NgayKyQuyetDinh", nghihuu.NgayKyQuyetDinh);
                dynamicParameters.Add("@TenNguoiKyQuyetDinh", nghihuu.TenNguoiKyQuyetDinh);
                dynamicParameters.Add("@NgayHieuLuc", nghihuu.NgayHieuLuc);
                dynamicParameters.Add("@NgayKetThuc", nghihuu.NgayKetThuc);

                dynamicParameters.Add("@CreateDate", nghihuu.CreateDate);
                dynamicParameters.Add("@CreateBy", nghihuu.CreateBy);
                dynamicParameters.Add("@UpdateDate", nghihuu.UpdateDate);
                dynamicParameters.Add("@UpdateBy", nghihuu.UpdateBy);

                dynamicParameters.Add("@parameters", parameters);
                try
                {
                    var query = await sqlConnection.QueryAsync<QDNghiHuuViewModel>(
                        "QDNghiHuuAUD", dynamicParameters, commandType: CommandType.StoredProcedure);

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
