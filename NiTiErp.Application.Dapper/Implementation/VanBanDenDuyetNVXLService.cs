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
    public class VanBanDenDuyetNVXLService : IVanBanDenDuyetNVXLService
    {
        private readonly IConfiguration _configuration;

        public VanBanDenDuyetNVXLService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task<PagedResult<VanBanDenDuyetNVXLViewModel>> GetAllVBDDNVXLPaging(long vanbandenid, long vanbandenduyetid, Guid hosonhanvienid,
            int vbphoihopxulyid, DateTime ngaynhanvanban,
            string keyword, int page, int pageSize, int vanbandenduyetnvxlid, string ghichu, string parameters)
        {
            using (var sqlConnection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                await sqlConnection.OpenAsync();
                var dynamicParameters = new DynamicParameters();

                dynamicParameters.Add("@Id", vanbandenduyetnvxlid);

                dynamicParameters.Add("@VanBanDenId", vanbandenid);
                dynamicParameters.Add("@VanBanDenDuyetId", vanbandenduyetid);
                dynamicParameters.Add("@HoSoNhanVienId", hosonhanvienid);
                dynamicParameters.Add("@VBPhoiHopXuLyId", vbphoihopxulyid);
                dynamicParameters.Add("@NgayNhanVBXL", ngaynhanvanban);

                dynamicParameters.Add("@keyword", keyword);
                dynamicParameters.Add("@GhiChu", ghichu);             

                dynamicParameters.Add("@parameters", parameters);
                try
                {
                    var hoso = await sqlConnection.QueryAsync<VanBanDenDuyetNVXLViewModel>(
                        "VanBanDenDuyetNhanVienXLGetList", dynamicParameters, commandType: CommandType.StoredProcedure);

                    var query = hoso.AsQueryable();

                    int totalRow = query.Count();

                    query = query.OrderByDescending(x => x.CreateDate)
                        .Skip((page - 1) * pageSize).Take(pageSize);

                    var data = query.ToList();

                    var paginationSet = new PagedResult<VanBanDenDuyetNVXLViewModel>()
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

        public async Task<Boolean> VanBanDenDuyetNVXLAUD(VanBanDenDuyetNVXLViewModel vanbandenduyetnvxl, string parameters)
        {
            using (var sqlConnection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                await sqlConnection.OpenAsync();
                var dynamicParameters = new DynamicParameters();

                dynamicParameters.Add("@Id", vanbandenduyetnvxl.Id);

                dynamicParameters.Add("@VanBanDenDuyetId", vanbandenduyetnvxl.VanBanDenDuyetId);
                dynamicParameters.Add("@HoSoNhanVienId", vanbandenduyetnvxl.HoSoNhanVienId);
                dynamicParameters.Add("@VBPhoiHopXuLyId", vanbandenduyetnvxl.VBPhoiHopXuLyId);
                dynamicParameters.Add("@NgayNhanVBXL", vanbandenduyetnvxl.NgayNhanVBXL);
                
                dynamicParameters.Add("@Stt", vanbandenduyetnvxl.Stt);

                dynamicParameters.Add("@CreateBy", vanbandenduyetnvxl.CreateBy);
                dynamicParameters.Add("@CreateDate", vanbandenduyetnvxl.CreateDate);
                dynamicParameters.Add("@UpdateDate", vanbandenduyetnvxl.UpdateDate);
                dynamicParameters.Add("@UpdateBy", vanbandenduyetnvxl.UpdateBy);

                dynamicParameters.Add("@parameters", parameters);

                try
                {
                    var query = await sqlConnection.QueryAsync<VanBanDenDuyetNVXLViewModel>(
                        "VanBanDenDuyetNhanVienXLAUD", dynamicParameters, commandType: CommandType.StoredProcedure);

                    return true;
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }

        public async Task<List<VanBanDenDuyetNVXLViewModel>> VanBanDenDuyetNVXLAUDList (VanBanDenDuyetNVXLViewModel vanbandenduyetnvxl, string parameters)
        {
            using (var sqlConnection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                await sqlConnection.OpenAsync();
                var dynamicParameters = new DynamicParameters();

                dynamicParameters.Add("@Id", vanbandenduyetnvxl.Id);

                dynamicParameters.Add("@VanBanDenDuyetId", vanbandenduyetnvxl.VanBanDenDuyetId);
                dynamicParameters.Add("@HoSoNhanVienId", vanbandenduyetnvxl.HoSoNhanVienId);
                dynamicParameters.Add("@VBPhoiHopXuLyId", vanbandenduyetnvxl.VBPhoiHopXuLyId);
                dynamicParameters.Add("@NgayNhanVBXL", vanbandenduyetnvxl.NgayNhanVBXL);

                dynamicParameters.Add("@Stt", vanbandenduyetnvxl.Stt);

                dynamicParameters.Add("@CreateBy", vanbandenduyetnvxl.CreateBy);
                dynamicParameters.Add("@CreateDate", vanbandenduyetnvxl.CreateDate);
                dynamicParameters.Add("@UpdateDate", vanbandenduyetnvxl.UpdateDate);
                dynamicParameters.Add("@UpdateBy", vanbandenduyetnvxl.UpdateBy);

                dynamicParameters.Add("@parameters", parameters);

                try
                {
                    var query = await sqlConnection.QueryAsync<VanBanDenDuyetNVXLViewModel>(
                        "VanBanDenDuyetNhanVienXLAUD", dynamicParameters, commandType: CommandType.StoredProcedure);

                    return query.ToList();
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }

        public async Task<List<VanBanDenDuyetNVXLViewModel>> VBDDNVXLGetList(long vanbandenid, long vanbandenduyetid, Guid hosonhanvienid,
            int vbphoihopxulyid, DateTime ngaynhanvanban,
            string keyword, int vanbandenduyetnvxlid, string ghichu, string parameters)
        {
            using (var sqlConnection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                await sqlConnection.OpenAsync();
                var dynamicParameters = new DynamicParameters();

                dynamicParameters.Add("@Id", vanbandenduyetnvxlid);

                dynamicParameters.Add("@VanBanDenId", vanbandenid);
                dynamicParameters.Add("@VanBanDenDuyetId", vanbandenduyetid);
                dynamicParameters.Add("@HoSoNhanVienId", hosonhanvienid);
                dynamicParameters.Add("@VBPhoiHopXuLyId", vbphoihopxulyid);
                dynamicParameters.Add("@NgayNhanVBXL", ngaynhanvanban);

                dynamicParameters.Add("@keyword", keyword);
                dynamicParameters.Add("@GhiChu", ghichu);

                dynamicParameters.Add("@parameters", parameters);

                try
                {
                    var query = await sqlConnection.QueryAsync<VanBanDenDuyetNVXLViewModel>(
                        "VanBanDenDuyetNhanVienXLGetList", dynamicParameters, commandType: CommandType.StoredProcedure);

                    return query.AsList();
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }      
    }
}
