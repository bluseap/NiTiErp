using System;
using System.Collections.Generic;
using System.Text;

using Dapper;
using Microsoft.Extensions.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Threading.Tasks;
using NiTiErp.Application.Dapper.Interfaces;
using NiTiErp.Application.Dapper.ViewModels;
using NiTiErp.Utilities.Dtos;
using System.Linq;

namespace NiTiErp.Application.Dapper.Implementation
{
    public class VanBanDenService : IVanBanDenService
    {
        private readonly IConfiguration _configuration;

        public VanBanDenService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task<PagedResult<VanBanDenViewModel>> GetAllVanBanDenPaging(string corporationId, int vanbanlinhvucId,
            int vanbanloaiId, int vanbancoquanbanhanhId, DateTime ngaybanhanhvanbanden, DateTime ngaydencuavanban,
            int vanbandensoId, int sovanbanden, string sokyhieuvanbanden, string nguoikyvanbanden,
            bool isvanbandientu, int vanbandientuId, bool isphathanhvanbanden, DateTime ngayphathanhvanbanden,
            string noiphathanhvanban, Guid nguoiduyetvanbanden, int vanbankhanId, int vanbanmatId, bool islanhdaoxem,
            string ttxuly, string ttduyet, string ttdangxuly,
            string keyword, int page, int pageSize, Int64 vanbandenId, string tenfile, string ghichu,
             string parameters)
        {
            using (var sqlConnection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                await sqlConnection.OpenAsync();
                var dynamicParameters = new DynamicParameters();

                dynamicParameters.Add("@corporationId", corporationId);
                dynamicParameters.Add("@vanbanlinhvucId", vanbanlinhvucId);
                dynamicParameters.Add("@vanbanloaiId", vanbanloaiId);
                dynamicParameters.Add("@vanbancoquanbanhanhId", vanbancoquanbanhanhId);
                dynamicParameters.Add("@ngaybanhanhvanbanden", ngaybanhanhvanbanden);
                dynamicParameters.Add("@ngaydencuavanban", ngaydencuavanban);

                dynamicParameters.Add("@vanbandensoId", vanbandensoId);
                dynamicParameters.Add("@sovanbanden", sovanbanden);
                dynamicParameters.Add("@sokyhieuvanbanden", sokyhieuvanbanden);
                dynamicParameters.Add("@nguoikyvanbanden", nguoikyvanbanden);

                dynamicParameters.Add("@isvanbandientu", isvanbandientu);
                dynamicParameters.Add("@vanbandientuId", vanbandientuId);
                dynamicParameters.Add("@isphathanhvanbanden", isphathanhvanbanden);
                dynamicParameters.Add("@ngayphathanhvanbanden", ngayphathanhvanbanden);

                dynamicParameters.Add("@noiphathanhvanban", noiphathanhvanban);
                dynamicParameters.Add("@nguoiduyetvanbanden", nguoiduyetvanbanden);
                dynamicParameters.Add("@vanbankhanId", vanbankhanId);
                dynamicParameters.Add("@vanbanmatId", vanbanmatId);
                dynamicParameters.Add("@islanhdaoxem", islanhdaoxem);

                dynamicParameters.Add("@ttxuly", ttxuly);
                dynamicParameters.Add("@ttduyet", ttduyet);
                dynamicParameters.Add("@ttdangxuly", ttdangxuly);

                dynamicParameters.Add("@keyword", keyword);
                dynamicParameters.Add("@VanBanDenId", vanbandenId);
                dynamicParameters.Add("@TenFile", tenfile);
                dynamicParameters.Add("@ghichu", ghichu);

                dynamicParameters.Add("@parameters", parameters);
                try
                {
                    var hoso = await sqlConnection.QueryAsync<VanBanDenViewModel>(
                        "VanBanDenGetList", dynamicParameters, commandType: CommandType.StoredProcedure);

                    var query = hoso.AsQueryable();

                    int totalRow = query.Count();

                    query = query.OrderByDescending(x => x.CreateDate)
                        .Skip((page - 1) * pageSize).Take(pageSize);

                    var data = query.ToList();

                    var paginationSet = new PagedResult<VanBanDenViewModel>()
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

        public async Task<Boolean> VanBanDenAUD(VanBanDenViewModel vanbanden, string parameters)
        {
            using (var sqlConnection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                await sqlConnection.OpenAsync();
                var dynamicParameters = new DynamicParameters();

                dynamicParameters.Add("@Id", vanbanden.Id);
                dynamicParameters.Add("@CorporationId", vanbanden.CorporationId);
                dynamicParameters.Add("@TrichYeuCuaVanBan", vanbanden.TrichYeuCuaVanBan);
                dynamicParameters.Add("@VanBanLinhVucId", vanbanden.VanBanLinhVucId);
                dynamicParameters.Add("@VanBanLoaiId", vanbanden.VanBanLoaiId);
                dynamicParameters.Add("@NgayBanHanhCuaVanBan", vanbanden.NgayBanHanhCuaVanBan);
                dynamicParameters.Add("@NgayDenCuaVanBan", vanbanden.NgayDenCuaVanBan);
                dynamicParameters.Add("@VanBanDenSoId", vanbanden.VanBanDenSoId);
                dynamicParameters.Add("@SoVanBanDen", vanbanden.SoVanBanDen); 	
                dynamicParameters.Add("@SoVanBanDenStt", vanbanden.SoVanBanDenStt);
                dynamicParameters.Add("@SoKyHieuCuaVanBan", vanbanden.SoKyHieuCuaVanBan);
                dynamicParameters.Add("@NguoiKyCuaVanBan", vanbanden.NguoiKyCuaVanBan);
                dynamicParameters.Add("@VanBanCoQuanBanHanhId", vanbanden.VanBanCoQuanBanHanhId);
                dynamicParameters.Add("@NoiLuuBanChinh", vanbanden.NoiLuuBanChinh);
                dynamicParameters.Add("@HoSoNhanVienId", vanbanden.HoSoNhanVienId);
                dynamicParameters.Add("@VanBanKhanId", vanbanden.VanBanKhanId);  
                dynamicParameters.Add("@VanBanMatId", vanbanden.VanBanMatId);
                dynamicParameters.Add("@GhiChu", vanbanden.GhiChu); 	
                dynamicParameters.Add("@SoTo", vanbanden.SoTo); 
                dynamicParameters.Add("@IsVanBanDienTu", vanbanden.IsVanBanDienTu); 	
                dynamicParameters.Add("@VanBanDienTuId", vanbanden.VanBanDienTuId); 	
                dynamicParameters.Add("@TTXuLy", vanbanden.TTXuLy); 
                dynamicParameters.Add("@TTDuyet", vanbanden.TTDuyet); 	
                dynamicParameters.Add("@TTDangXuLy", vanbanden.TTDangXuLy); 	
                dynamicParameters.Add("@IsPhatHanh", vanbanden.IsPhatHanh); 
                dynamicParameters.Add("@NgayPhatHanh", vanbanden.NgayPhatHanh); 	
                dynamicParameters.Add("@GhiChuPhatHanh", vanbanden.GhiChuPhatHanh); 
                dynamicParameters.Add("@IsPhatHanhDienTu", vanbanden.IsPhatHanhDienTu); 	
                dynamicParameters.Add("@CorporationPhatHanhId", vanbanden.CorporationPhatHanhId); 
                dynamicParameters.Add("@IsLanhDaoXem", vanbanden.IsLanhDaoXem); 	
                dynamicParameters.Add("@Stt", vanbanden.Stt);

                try                    	
                {
                    var query = await sqlConnection.QueryAsync<VanBanDenViewModel>(
                        "VanBanDenAUD", dynamicParameters, commandType: CommandType.StoredProcedure);
                    return true;
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }

        public async Task<List<VanBanDenViewModel>> VanBanCoQuanGetList(string corporationId, int vanbanlinhvucId,
            int vanbanloaiId, int vanbancoquanbanhanhId, DateTime ngaybanhanhvanbanden, DateTime ngaydencuavanban,
            int vanbandensoId, int sovanbanden, string sokyhieuvanbanden, string nguoikyvanbanden,
            bool isvanbandientu, int vanbandientuId, bool isphathanhvanbanden, DateTime ngayphathanhvanbanden,
            string noiphathanhvanban, Guid nguoiduyetvanbanden, int vanbankhanId, int vanbanmatId, bool islanhdaoxem,
            string ttxuly, string ttduyet, string ttdangxuly,
            string keyword, int page, int pageSize, Int64 vanbandenId, string tenfile, string ghichu, string parameters)
        {
            using (var sqlConnection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                await sqlConnection.OpenAsync();
                var dynamicParameters = new DynamicParameters();

                dynamicParameters.Add("@corporationId", corporationId);
                dynamicParameters.Add("@vanbanlinhvucId", vanbanlinhvucId);
                dynamicParameters.Add("@vanbanloaiId", vanbanloaiId);
                dynamicParameters.Add("@vanbancoquanbanhanhId", vanbancoquanbanhanhId);
                dynamicParameters.Add("@ngaybanhanhvanbanden", ngaybanhanhvanbanden);
                dynamicParameters.Add("@ngaydencuavanban", ngaydencuavanban);

                dynamicParameters.Add("@vanbandensoId", vanbandensoId);
                dynamicParameters.Add("@sovanbanden", sovanbanden);
                dynamicParameters.Add("@sokyhieuvanbanden", sokyhieuvanbanden);
                dynamicParameters.Add("@nguoikyvanbanden", nguoikyvanbanden);

                dynamicParameters.Add("@isvanbandientu", isvanbandientu);
                dynamicParameters.Add("@vanbandientuId", vanbandientuId);
                dynamicParameters.Add("@isphathanhvanbanden", isphathanhvanbanden);
                dynamicParameters.Add("@ngayphathanhvanbanden", ngayphathanhvanbanden);

                dynamicParameters.Add("@noiphathanhvanban", noiphathanhvanban);
                dynamicParameters.Add("@nguoiduyetvanbanden", nguoiduyetvanbanden);
                dynamicParameters.Add("@vanbankhanId", vanbankhanId);
                dynamicParameters.Add("@vanbanmatId", vanbanmatId);
                dynamicParameters.Add("@islanhdaoxem", islanhdaoxem);

                dynamicParameters.Add("@ttxuly", ttxuly);
                dynamicParameters.Add("@ttduyet", ttduyet);
                dynamicParameters.Add("@ttdangxuly", ttdangxuly);

                dynamicParameters.Add("@keyword", keyword);
                dynamicParameters.Add("@VanBanDenId", vanbandenId);
                dynamicParameters.Add("@TenFile", tenfile);
                dynamicParameters.Add("@ghichu", ghichu);

                dynamicParameters.Add("@parameters", parameters);

                try
                {
                    var query = await sqlConnection.QueryAsync<VanBanDenViewModel>(
                        "VanBanDenGetList", dynamicParameters, commandType: CommandType.StoredProcedure); 
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
