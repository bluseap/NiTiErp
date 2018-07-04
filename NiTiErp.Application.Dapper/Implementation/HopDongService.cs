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
    public class HopDongService : IHopDongService
    {
        private readonly IConfiguration _configuration;

        public HopDongService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task<PagedResult<HopDongViewModel>> GetAllHopDongDatePaging(string corporationId, string phongId,
            string keyword, int page, int pageSize, string hosoId, string hosoId2, string hosoId3, 
            DateTime tungay, DateTime denngay, DateTime ngaynhap, string dieukien,
            string hopdongId, string parameters)
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
                dynamicParameters.Add("@hopdongId", hopdongId);

                dynamicParameters.Add("@tungay", tungay);
                dynamicParameters.Add("@denngay", denngay);
                dynamicParameters.Add("@ngaynhap", ngaynhap);
                dynamicParameters.Add("@dieukien", dieukien);

                dynamicParameters.Add("@parameters", parameters);
                try
                {
                    var hoso = await sqlConnection.QueryAsync<HopDongViewModel>(
                        "HopDongGetListDate", dynamicParameters, commandType: CommandType.StoredProcedure);

                    var query = hoso.AsQueryable();

                    int totalRow = query.Count();

                    query = query.OrderByDescending(x => x.CreateDate)
                        .Skip((page - 1) * pageSize).Take(pageSize);

                    var data = query.ToList();

                    var paginationSet = new PagedResult<HopDongViewModel>()
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

        public async Task<PagedResult<HopDongViewModel>> GetAllHopDongPaging(string corporationId, string phongId, 
            string keyword, int page, int pageSize, string hosoId, string hosoId2, string hosoId3, 
            string hopdongId, string parameters)
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
                dynamicParameters.Add("@hopdongId", hopdongId);

                dynamicParameters.Add("@parameters", parameters);
                try
                {
                    var hoso = await sqlConnection.QueryAsync<HopDongViewModel>(
                        "HopDongGetList", dynamicParameters, commandType: CommandType.StoredProcedure);

                    var query = hoso.AsQueryable();

                    int totalRow = query.Count();

                    query = query.OrderByDescending(x => x.CreateDate)
                        .Skip((page - 1) * pageSize).Take(pageSize);

                    var data = query.ToList();

                    var paginationSet = new PagedResult<HopDongViewModel>()
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

        public async Task<Boolean> HopDongAUD(HopDongViewModel hopdong, string parameters)
        {
            using (var sqlConnection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                await sqlConnection.OpenAsync();
                var dynamicParameters = new DynamicParameters();

                dynamicParameters.Add("@Id", hopdong.Id);
                dynamicParameters.Add("@HoSoNhanVienId", hopdong.HoSoNhanVienId);
                dynamicParameters.Add("@CorporationId", hopdong.CorporationId);
                dynamicParameters.Add("@ChucVuNhanVienId", hopdong.ChucVuNhanVienId);

                dynamicParameters.Add("@SoHopDong", hopdong.SoHopDong);
                dynamicParameters.Add("@HopDongDanhMucId", hopdong.HopDongDanhMucId);
                dynamicParameters.Add("@NgayKyHopDong", hopdong.NgayKyHopDong);
                dynamicParameters.Add("@NgayHopDong", hopdong.NgayHopDong);
                dynamicParameters.Add("@NgayHieuLuc", hopdong.NgayHieuLuc);
                dynamicParameters.Add("@NgayHetHan", hopdong.NgayHetHan);
                dynamicParameters.Add("@HeSoLuong", hopdong.HeSoLuong);
                dynamicParameters.Add("@LuongCoBan", hopdong.LuongCoBan);
                dynamicParameters.Add("@HeSoLuongDanhMucId", hopdong.HeSoLuongDanhMucId);
                dynamicParameters.Add("@TenNguoiKyHopDong", hopdong.TenNguoiKyHopDong);   

                dynamicParameters.Add("@CreateDate", hopdong.CreateDate);
                dynamicParameters.Add("@CreateBy", hopdong.CreateBy);
                dynamicParameters.Add("@UpdateDate", hopdong.UpdateDate);
                dynamicParameters.Add("@UpdateBy", hopdong.UpdateBy);

                dynamicParameters.Add("@parameters", parameters);
                try
                {
                    var query = await sqlConnection.QueryAsync<HopDongViewModel>(
                        "HopDongAUD", dynamicParameters, commandType: CommandType.StoredProcedure);

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
