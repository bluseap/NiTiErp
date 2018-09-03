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
    public class SucKhoeService : ISucKhoeService
    {
        private readonly IConfiguration _configuration;

        public SucKhoeService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task<PagedResult<SucKhoeViewModel>> GetAllSucKhoePaging(int namKham, string corporationId, string phongId, string keyword, int page, int pageSize,
            string hosoId, string hosoId2, string suckhoeId, string parameters)
        {
            using (var sqlConnection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                await sqlConnection.OpenAsync();
                var dynamicParameters = new DynamicParameters();

                dynamicParameters.Add("@namKham", namKham);
                dynamicParameters.Add("@corporationId", corporationId);
                dynamicParameters.Add("@phongId", phongId);
                dynamicParameters.Add("@keyword", keyword);
                dynamicParameters.Add("@hosoId", hosoId);
                dynamicParameters.Add("@hosoId2", hosoId2);
                dynamicParameters.Add("@suckhoeId", suckhoeId);

                dynamicParameters.Add("@parameters", parameters);
                try
                {
                    var hoso = await sqlConnection.QueryAsync<SucKhoeViewModel>(
                        "SucKhoeNhanVienGetList", dynamicParameters, commandType: CommandType.StoredProcedure);

                    var query = hoso.AsQueryable();

                    int totalRow = query.Count();

                    query = query.OrderByDescending(x => x.CreateDate)
                        .Skip((page - 1) * pageSize).Take(pageSize);

                    var data = query.ToList();

                    var paginationSet = new PagedResult<SucKhoeViewModel>()
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

        public async Task<List<SucKhoeViewModel>> SucKhoeGetList(int namKham, string corporationId, string phongId, string keyword,
            string hosoId, string hosoId2, string suckhoeId, string parameters)
        {
            using (var sqlConnection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                await sqlConnection.OpenAsync();
                var dynamicParameters = new DynamicParameters();

                dynamicParameters.Add("@namKham", namKham);
                dynamicParameters.Add("@corporationId", corporationId);
                dynamicParameters.Add("@phongId", phongId);
                dynamicParameters.Add("@keyword", keyword);
                dynamicParameters.Add("@hosoId", hosoId);
                dynamicParameters.Add("@hosoId2", hosoId2);
                dynamicParameters.Add("@suckhoeId", suckhoeId);

                dynamicParameters.Add("@parameters", parameters);

                try
                {
                    var query = await sqlConnection.QueryAsync<SucKhoeViewModel>(
                        "SucKhoeNhanVienGetList", dynamicParameters, commandType: CommandType.StoredProcedure);

                    return query.AsList();
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }

        public async Task<Boolean> SucKhoeAUD(SucKhoeViewModel suckhoe, string parameters)
        {
            using (var sqlConnection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                await sqlConnection.OpenAsync();
                var dynamicParameters = new DynamicParameters();

                dynamicParameters.Add("@Id", suckhoe.Id);
                dynamicParameters.Add("@NamKham", suckhoe.NamKham);
                dynamicParameters.Add("@hosonhanvienId", suckhoe.HoSoNhanVienId);

                //dynamicParameters.Add("@CorporationId", suckhoe.CorporationId);
                //dynamicParameters.Add("@PhongBanDanhMucId", suckhoe.PhongBanDanhMucId);
                //dynamicParameters.Add("@ChucVuNhanVienId", suckhoe.ChucVuNhanVienId);               
                //dynamicParameters.Add("@GioiTinh", suckhoe.GioiTinh);
                //dynamicParameters.Add("@NgaySinh", suckhoe.NgaySinh);

                dynamicParameters.Add("@CanNang", suckhoe.CanNang);
                dynamicParameters.Add("@ChieuCao", suckhoe.ChieuCao); 
                dynamicParameters.Add("@HuyetAp", suckhoe.HuyetAp); 
                dynamicParameters.Add("@Mat", suckhoe.Mat);
                dynamicParameters.Add("@TaiMuiHong", suckhoe.TaiMuiHong); 
                dynamicParameters.Add("@RangHamMat", suckhoe.RangHamMat); 
                dynamicParameters.Add("@SieuAmVungBung", suckhoe.SieuAmVungBung); 
                dynamicParameters.Add("@XQTimPhoi", suckhoe.XQTimPhoi); 
                dynamicParameters.Add("@DoDienTim", suckhoe.DoDienTim); 
                dynamicParameters.Add("@PhuKhoa", suckhoe.PhuKhoa); 
                dynamicParameters.Add("@PhetTBAmDao", suckhoe.PhetTBAmDao); 
                dynamicParameters.Add("@CongThucMau", suckhoe.CongThucMau); 
                dynamicParameters.Add("@TPTNT", suckhoe.TPTNT); 
                dynamicParameters.Add("@GlucoDuong", suckhoe.GlucoDuong); 
                dynamicParameters.Add("@NhomMau", suckhoe.NhomMau);

                dynamicParameters.Add("@PhanLoaiSucKhoeId", suckhoe.PhanLoaiSucKhoeId);
                dynamicParameters.Add("@PhanLoaiSucKhoe", suckhoe.PhanLoaiSucKhoe); 
                dynamicParameters.Add("@TenBenh", suckhoe.TenBenh); 
                dynamicParameters.Add("@HuongDieuTri", suckhoe.HuongDieuTri); 
                dynamicParameters.Add("@GhiChu", suckhoe.GhiChu); 

                //dynamicParameters.Add("@Status", suckhoe.Status);
                dynamicParameters.Add("@Stt", suckhoe.Stt);
                dynamicParameters.Add("@Active", suckhoe.Active);
                dynamicParameters.Add("@CreateBy", suckhoe.CreateBy);
                dynamicParameters.Add("@CreateDate", suckhoe.CreateDate);               
                dynamicParameters.Add("@UpdateDate", suckhoe.UpdateDate);
                dynamicParameters.Add("@UpdateBy", suckhoe.UpdateBy);

                dynamicParameters.Add("@parameters", parameters);

                try
                {
                    var query = await sqlConnection.QueryAsync<SucKhoeViewModel>(
                        "SucKhoeNhanVienAUD", dynamicParameters, commandType: CommandType.StoredProcedure);

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
