﻿using Dapper;
using Microsoft.Extensions.Configuration;
using NiTiErp.Application.Dapper.Interfaces;
using NiTiErp.Application.Dapper.ViewModels;
using NiTiErp.Utilities.Dtos;
using NiTiErp.Utilities.Helpers;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;

namespace NiTiErp.Application.Dapper.Implementation
{
    public class HoSoNhanVienService : IHoSoNhanVienService
    {
        private readonly IConfiguration _configuration;

        public HoSoNhanVienService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task<PagedResult<HoSoNhanVienViewModel>> GetAllHoSoNhanVienPaging(string corporationId, string phongId, string keyword, int page, int pageSize,
            string hosoId, string hosoId2, string hosoId3, string parameters)
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

                dynamicParameters.Add("@parameters", parameters);
                try
                {
                    var hoso = await sqlConnection.QueryAsync<HoSoNhanVienViewModel>(
                        "HoSoNhanVienGetList", dynamicParameters, commandType: CommandType.StoredProcedure);

                    var query = hoso.AsQueryable();

                    int totalRow = query.Count();

                    query = query.OrderByDescending(x => x.CreateDate)
                        .Skip((page - 1) * pageSize).Take(pageSize);

                    var data = query.ToList();

                    var paginationSet = new PagedResult<HoSoNhanVienViewModel>()
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

        public async Task<List<HoSoNhanVienViewModel>> HoSoNhanVienGetList(string corporationId, string phongId, string keyword,
            string hosoId, string hosoId2, string hosoId3, string parameters)
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

                dynamicParameters.Add("@parameters", parameters);

                try
                {
                    var query = await sqlConnection.QueryAsync<HoSoNhanVienViewModel>(
                        "HoSoNhanVienGetList", dynamicParameters, commandType: CommandType.StoredProcedure);

                    return query.AsList();
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }

        public async Task<IEnumerable<dynamic>> HoSoDataTable(string corporationId, string phongId, string keyword,
            string hosoId, string hosoId2, string hosoId3, string parameters)
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

                dynamicParameters.Add("@parameters", parameters);
                try
                {
                    var query = await sqlConnection.QueryAsync<dynamic>(
                        "HoSoNhanVienGetList", dynamicParameters, commandType: CommandType.StoredProcedure);

                    return query.AsList();

                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }

        public async Task<Boolean> HoSoNhanVienAUD(HoSoNhanVienViewModel hoso, string parameters)
        {
            using (var sqlConnection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                await sqlConnection.OpenAsync();
                var dynamicParameters = new DynamicParameters();

                dynamicParameters.Add("@Id", hoso.Id);
                dynamicParameters.Add("@Ten", hoso.Ten);
                dynamicParameters.Add("@CorporationId", hoso.CorporationId);
                dynamicParameters.Add("@PhongBanDanhMucId", hoso.PhongBanDanhMucId);
                dynamicParameters.Add("@ChucVuNhanVienId", hoso.ChucVuNhanVienId);
                dynamicParameters.Add("@SoDienThoai", hoso.SoDienThoai);
                dynamicParameters.Add("@SoTheNhanVien", hoso.SoTheNhanVien);
                //dynamicParameters.Add("@Email", hoso.Email);
                dynamicParameters.Add("@TenGoiKhac", hoso.TenGoiKhac);
                dynamicParameters.Add("@GioiTinh", hoso.GioiTinh);
                dynamicParameters.Add("@NgaySinh", hoso.NgaySinh);
                dynamicParameters.Add("@SoCMND", hoso.SoCMND);
                dynamicParameters.Add("@NgayCapCMND", hoso.NgayCapCMND);
                dynamicParameters.Add("@NoiCapCMND", hoso.NoiCapCMND);
                dynamicParameters.Add("@NoiSinh", hoso.NoiSinh);
                //dynamicParameters.Add("@QueQuan", hoso.QueQuan);
                //dynamicParameters.Add("@NoiOHienNay", hoso.NoiOHienNay);
                dynamicParameters.Add("@HonNhanDanhMucId", hoso.HonNhanDanhMucId);
                dynamicParameters.Add("@DanTocDanhMucId", hoso.DanTocDanhMucId);
                dynamicParameters.Add("@TonGiaoDanhMucId", hoso.TonGiaoDanhMucId);
                dynamicParameters.Add("@XuatThanDanhMucId", hoso.XuatThanDanhMucId);
                //dynamicParameters.Add("@IsDelete", hoso.IsDelete);
                //dynamicParameters.Add("@HoSoNhanVienXoaId", hoso.HoSoNhanVienXoaId);
                //dynamicParameters.Add("@NgayXoa", hoso.NgayXoa);
                dynamicParameters.Add("@HinhNhanVien", hoso.HinhNhanVien);

                dynamicParameters.Add("@SoNhaDuong", hoso.SoNhaDuong);
                dynamicParameters.Add("@ThanhPhoTinhId", hoso.ThanhPhoTinhId);
                dynamicParameters.Add("@QuanHuyenId", hoso.QuanHuyenId);
                dynamicParameters.Add("@PhuongXaId", hoso.PhuongXaId);

                dynamicParameters.Add("@SoNhaDuongQueQuan", hoso.SoNhaDuongQueQuan);
                dynamicParameters.Add("@ThanhPhoTinhQueQuanId", hoso.ThanhPhoTinhQueQuanId);
                dynamicParameters.Add("@QuanHuyenQueQuanId", hoso.QuanHuyenQueQuanId);
                dynamicParameters.Add("@PhuongXaQueQuanId", hoso.PhuongXaQueQuanId);

                dynamicParameters.Add("@Active", hoso.Active);
                dynamicParameters.Add("@Stt", hoso.Stt);
                dynamicParameters.Add("@CreateDate", hoso.CreateDate);
                dynamicParameters.Add("@CreateBy", hoso.CreateBy);
                dynamicParameters.Add("@UpdateDate", hoso.UpdateDate);
                dynamicParameters.Add("@UpdateBy", hoso.UpdateBy);

                dynamicParameters.Add("@parameters", parameters);

                try
                {
                    var query = await sqlConnection.QueryAsync<HoSoNhanVienViewModel>(
                        "HoSoNhanVienAUD", dynamicParameters, commandType: CommandType.StoredProcedure);

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