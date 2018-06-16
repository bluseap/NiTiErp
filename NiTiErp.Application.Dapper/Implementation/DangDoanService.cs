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
    public class DangDoanService : IDangDoanService
    {
        private readonly IConfiguration _configuration;

        public DangDoanService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task<PagedResult<DangDoanViewModel>> GetAllDangDoanPaging(string corporationId, string phongId, string keyword, int page, int pageSize,
            string hosoId, string hosoId2, string hosoId3, string dangId, string doanId, string congdoanId,
            string cachmangId, string quandoiId, string parameters)
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

                dynamicParameters.Add("@dangId", dangId);
                dynamicParameters.Add("@doanId", doanId);
                dynamicParameters.Add("@congdoanId", congdoanId);
                dynamicParameters.Add("@cachmangId", cachmangId);
                dynamicParameters.Add("@quandoiId", quandoiId);

                dynamicParameters.Add("@parameters", parameters);
                try
                {
                    var dangdoan = await sqlConnection.QueryAsync<DangDoanViewModel>(
                        "DangDoanGetList", dynamicParameters, commandType: CommandType.StoredProcedure);

                    var query = dangdoan.AsQueryable();

                    int totalRow = query.Count();

                    query = query.OrderByDescending(x => x.CreateDate)
                        .Skip((page - 1) * pageSize).Take(pageSize);

                    var data = query.ToList();

                    var paginationSet = new PagedResult<DangDoanViewModel>()
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

        public async Task<Boolean> DangDoanAUD(DangDoanViewModel dangdoan, string parameters)
        {
            using (var sqlConnection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                await sqlConnection.OpenAsync();
                var dynamicParameters = new DynamicParameters();

                dynamicParameters.Add("@ThamGiaDangId", dangdoan.ThamGiaDangId);
                dynamicParameters.Add("@ThamGiaDoanId", dangdoan.ThamGiaDoanId);
                dynamicParameters.Add("@ThamGiaCongDoanId", dangdoan.ThamGiaCongDoanId);
                dynamicParameters.Add("@ThamGiaCachMangId", dangdoan.ThamGiaCachMangId);
                dynamicParameters.Add("@ThamGiaQuanDoiId", dangdoan.ThamGiaQuanDoiId);

                dynamicParameters.Add("@HoSoNhanVienId", dangdoan.HoSoNhanVienId);

                dynamicParameters.Add("@NgayVaoDang", dangdoan.NgayVaoDang);
                dynamicParameters.Add("@MaTheDang", dangdoan.MaTheDang);
                dynamicParameters.Add("@ChucVuDangId", dangdoan.ChucVuDangId);
                dynamicParameters.Add("@NoiSinhHoatDang", dangdoan.NoiSinhHoatDang);

                dynamicParameters.Add("@NgayVaoDoan", dangdoan.NgayVaoDoan);
                dynamicParameters.Add("@MaTheDoan", dangdoan.MaTheDoan);
                dynamicParameters.Add("@ChucVuDoanId", dangdoan.ChucVuDoanId);
                dynamicParameters.Add("@NoiSinhHoatDoan", dangdoan.NoiSinhHoatDoan);

                dynamicParameters.Add("@NgayVaoCongDoan", dangdoan.NgayVaoCongDoan);
                dynamicParameters.Add("@MaTheCongDoan", dangdoan.MaTheCongDoan);
                dynamicParameters.Add("@ChucVuCongDoanId", dangdoan.ChucVuCongDoanId);
                dynamicParameters.Add("@NoiSinhHoatCongDoan", dangdoan.NoiSinhHoatCongDoan);

                dynamicParameters.Add("@NgayThamGiaCachMang", dangdoan.NgayThamGiaCachMang);
                dynamicParameters.Add("@DacDiemBanThanCu", dangdoan.DacDiemBanThanCu);
                dynamicParameters.Add("@DacDiemBanThanMoi", dangdoan.DacDiemBanThanMoi);

                dynamicParameters.Add("@NgayNhapNgu", dangdoan.NgayNhapNgu);
                dynamicParameters.Add("@NgayXuatNgu", dangdoan.NgayXuatNgu);
                dynamicParameters.Add("@ChucVuQuanDoiId", dangdoan.ChucVuQuanDoiId);
                dynamicParameters.Add("@CapBacQuanDoiId", dangdoan.CapBacQuanDoiId);
                dynamicParameters.Add("@DonViQuanDoi", dangdoan.DonViQuanDoi);    


                dynamicParameters.Add("@CreateDate", dangdoan.CreateDate);
                dynamicParameters.Add("@CreateBy", dangdoan.CreateBy);
                dynamicParameters.Add("@UpdateDate", dangdoan.UpdateDate);
                dynamicParameters.Add("@UpdateBy", dangdoan.UpdateBy);

                dynamicParameters.Add("@parameters", parameters);
                try
                {
                    var query = await sqlConnection.QueryAsync<DangDoanViewModel>(
                        "DangDoanAUD", dynamicParameters, commandType: CommandType.StoredProcedure);

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
