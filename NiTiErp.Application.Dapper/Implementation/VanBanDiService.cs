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
    public class VanBanDiService : IVanBanDiService
    {
        private readonly IConfiguration _configuration;

        public VanBanDiService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task<PagedResult<VanBanDiViewModel>> GetAllVanBanDiPaging(string corporationId, int vanbanlinhvucId,
    int vanbanloaiId, int vanbancoquanbanhanhId, DateTime ngaybanhanhvanbandi, DateTime ngaydicuavanban,
    int vanbandisoId, int sovanbandi, string sokyhieuvanbandi, string nguoikyvanbandi,
    bool isvanbandientu, int vanbandientuId, bool isphathanhvanbandi, DateTime ngayphathanhvanbandi,
    string noiphathanhvanban, Guid nguoiduyetvanbandi, int vanbankhanId, int vanbanmatId, bool islanhdaoxem,
    string ttchoxuly, string ttchoduyet, string ttchuaphathanh,
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
                dynamicParameters.Add("@ngaybanhanhvanbandi", ngaybanhanhvanbandi);
                dynamicParameters.Add("@ngaydicuavanban", ngaydicuavanban);

                dynamicParameters.Add("@vanbandisoId", vanbandisoId);
                dynamicParameters.Add("@sovanbandi", sovanbandi);
                dynamicParameters.Add("@sokyhieuvanbandi", sokyhieuvanbandi);
                dynamicParameters.Add("@nguoikyvanbandi", nguoikyvanbandi);

                dynamicParameters.Add("@isvanbandientu", isvanbandientu);
                dynamicParameters.Add("@vanbandientuId", vanbandientuId);
                dynamicParameters.Add("@isphathanhvanbandi", isphathanhvanbandi);
                dynamicParameters.Add("@ngayphathanhvanbandi", ngayphathanhvanbandi);

                dynamicParameters.Add("@noiphathanhvanban", noiphathanhvanban);
                dynamicParameters.Add("@nguoiduyetvanbandi", nguoiduyetvanbandi);
                dynamicParameters.Add("@vanbankhanId", vanbankhanId);
                dynamicParameters.Add("@vanbanmatId", vanbanmatId);
                dynamicParameters.Add("@islanhdaoxem", islanhdaoxem);

                dynamicParameters.Add("@ttchoxuly", ttchoxuly);
                dynamicParameters.Add("@ttchoduyet", ttchoduyet);
                dynamicParameters.Add("@ttchuaphathanh", ttchuaphathanh);

                dynamicParameters.Add("@keyword", keyword);
                dynamicParameters.Add("@VanBanDenId", vanbandenId);
                dynamicParameters.Add("@TenFile", tenfile);
                dynamicParameters.Add("@ghichu", ghichu);

                dynamicParameters.Add("@parameters", parameters);
                try
                {
                    var hoso = await sqlConnection.QueryAsync<VanBanDiViewModel>(
                        "VanBanDiGetList", dynamicParameters, commandType: CommandType.StoredProcedure);

                    var query = hoso.AsQueryable();

                    int totalRow = query.Count();

                    query = query.OrderBy(x => x.TTChuaPhatHanh)
                        .Skip((page - 1) * pageSize).Take(pageSize);

                    var data = query.ToList();

                    var paginationSet = new PagedResult<VanBanDiViewModel>()
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

        public async Task<Boolean> VanBanDiAUD(VanBanDiViewModel vanbandi, string parameters)
        {
            using (var sqlConnection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                await sqlConnection.OpenAsync();
                var dynamicParameters = new DynamicParameters();

                dynamicParameters.Add("@Id", vanbandi.Id);
                dynamicParameters.Add("@CodeFileGuidId", vanbandi.CodeFileGuidId);
                dynamicParameters.Add("@CorporationId", vanbandi.CorporationId);
                dynamicParameters.Add("@TrichYeuCuaVanBan", vanbandi.TrichYeuCuaVanBan);
                dynamicParameters.Add("@VanBanLinhVucId", vanbandi.VanBanLinhVucId);
                dynamicParameters.Add("@VanBanLoaiId", vanbandi.VanBanLoaiId);
                dynamicParameters.Add("@NgayBanHanhCuaVanBan", vanbandi.NgayBanHanhCuaVanBan);
                dynamicParameters.Add("@NgayDiCuaVanBan", vanbandi.NgayDiCuaVanBan);
                dynamicParameters.Add("@VanBanDiSoId", vanbandi.VanBanDiSoId);
                dynamicParameters.Add("@SoVanBanDi", vanbandi.SoVanBanDi);
                dynamicParameters.Add("@SoVanBanDiStt", vanbandi.SoVanBanDiStt);
                dynamicParameters.Add("@SoKyHieuCuaVanBan", vanbandi.SoKyHieuCuaVanBan);

                dynamicParameters.Add("@HoSoNhanVienIdKyVB", vanbandi.HoSoNhanVienIdKyVB);
                dynamicParameters.Add("@HoSoNhanVienIdSoanVB", vanbandi.HoSoNhanVienIdSoanVB);
                dynamicParameters.Add("@YKienSoanVB", vanbandi.YKienSoanVB);  
                dynamicParameters.Add("@VanBanKhanId", vanbandi.VanBanKhanId);
                dynamicParameters.Add("@VanBanMatId", vanbandi.VanBanMatId);
                dynamicParameters.Add("@LDDuyetHoSoNhanVienId", vanbandi.LDDuyetHoSoNhanVienId);
                dynamicParameters.Add("@GhiChu", vanbandi.GhiChu);
                dynamicParameters.Add("@SoTo", vanbandi.SoTo);
                dynamicParameters.Add("@VanBanCoQuanBanHanhId", vanbandi.VanBanCoQuanBanHanhId);
                dynamicParameters.Add("@NoiLuuBanChinh", vanbandi.NoiLuuBanChinh);               
                dynamicParameters.Add("@TTChoXuLy", vanbandi.TTChoXuLy);
                dynamicParameters.Add("@TTChoDuyet", vanbandi.TTChoDuyet);
                dynamicParameters.Add("@TTChuaPhatHanh", vanbandi.TTChuaPhatHanh);
                dynamicParameters.Add("@VanBanDenId", vanbandi.VanBanDenId);                
                dynamicParameters.Add("@GhiChuPhatHanh", vanbandi.GhiChuPhatHanh);
                dynamicParameters.Add("@GhiChuChuyenLanhDao", vanbandi.GhiChuChuyenLanhDao);
                dynamicParameters.Add("@GhiChuSaiDuyet", vanbandi.GhiChuSaiDuyet);
               
                dynamicParameters.Add("@Stt", vanbandi.Stt);

                dynamicParameters.Add("@CreateDate", vanbandi.CreateDate);
                dynamicParameters.Add("@CreateBy", vanbandi.CreateBy);
                dynamicParameters.Add("@UpdateDate", vanbandi.UpdateDate);
                dynamicParameters.Add("@UpdateBy", vanbandi.UpdateBy);

                dynamicParameters.Add("@parameters", parameters);
                try
                {
                    var query = await sqlConnection.QueryAsync<VanBanDiViewModel>(
                        "VanBanDiAUD", dynamicParameters, commandType: CommandType.StoredProcedure);
                    return true;
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }

        public async Task<List<VanBanDiViewModel>> VanBanDiGetList(string corporationId, int vanbanlinhvucId,
    int vanbanloaiId, int vanbancoquanbanhanhId, DateTime ngaybanhanhvanbandi, DateTime ngaydicuavanban,
    int vanbandisoId, int sovanbandi, string sokyhieuvanbandi, string nguoikyvanbandi,
    bool isvanbandientu, int vanbandientuId, bool isphathanhvanbandi, DateTime ngayphathanhvanbandi,
    string noiphathanhvanban, Guid nguoiduyetvanbandi, int vanbankhanId, int vanbanmatId, bool islanhdaoxem,
    string ttchoxuly, string ttchoduyet, string ttchuaphathanh,
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
                dynamicParameters.Add("@ngaybanhanhvanbandi", ngaybanhanhvanbandi);
                dynamicParameters.Add("@ngaydicuavanban", ngaydicuavanban);

                dynamicParameters.Add("@vanbandisoId", vanbandisoId);
                dynamicParameters.Add("@sovanbandi", sovanbandi);
                dynamicParameters.Add("@sokyhieuvanbandi", sokyhieuvanbandi);
                dynamicParameters.Add("@nguoikyvanbandi", nguoikyvanbandi);

                dynamicParameters.Add("@isvanbandientu", isvanbandientu);
                dynamicParameters.Add("@vanbandientuId", vanbandientuId);
                dynamicParameters.Add("@isphathanhvanbandi", isphathanhvanbandi);
                dynamicParameters.Add("@ngayphathanhvanbandi", ngayphathanhvanbandi);

                dynamicParameters.Add("@noiphathanhvanban", noiphathanhvanban);
                dynamicParameters.Add("@nguoiduyetvanbandi", nguoiduyetvanbandi);
                dynamicParameters.Add("@vanbankhanId", vanbankhanId);
                dynamicParameters.Add("@vanbanmatId", vanbanmatId);
                dynamicParameters.Add("@islanhdaoxem", islanhdaoxem);

                dynamicParameters.Add("@ttchoxuly", ttchoxuly);
                dynamicParameters.Add("@ttchoduyet", ttchoduyet);
                dynamicParameters.Add("@ttchuaphathanh", ttchuaphathanh);

                dynamicParameters.Add("@keyword", keyword);
                dynamicParameters.Add("@VanBanDenId", vanbandenId);
                dynamicParameters.Add("@TenFile", tenfile);
                dynamicParameters.Add("@ghichu", ghichu);

                dynamicParameters.Add("@parameters", parameters);

                try
                {
                    var query = await sqlConnection.QueryAsync<VanBanDiViewModel>(
                        "VanBanDiGetList", dynamicParameters, commandType: CommandType.StoredProcedure);
                    return query.AsList();
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }

        public long GetCountVanBanDi(string corporation, string parameter)
        {
            var phongdanhmucid = "";
            var chucvuid = "";

            using (var sqlConnection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                sqlConnection.Open();

                var paramaters = new DynamicParameters();

                paramaters.Add("@corporationId", corporation);
                paramaters.Add("@phongdanhmucId", phongdanhmucid);
                paramaters.Add("@chucvuId", chucvuid);

                paramaters.Add("@parameters", parameter);
                try
                {
                    var query = sqlConnection.Query<VanBanDenViewModel>
                        ("VanBanDiCount", paramaters, commandType: CommandType.StoredProcedure);

                    var ketqua = query.ToList();

                    return ketqua.Sum(p => long.Parse(p.KETQUA));
                }
                catch (Exception ex)
                {
                    throw ex;
                }

            }
        }

        //public long GetCountVanBanUser(string corporation, string username, string parameter)
        //{
        //    var phongdanhmucid = "";
        //    var chucvuid = username;

        //    using (var sqlConnection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
        //    {
        //        sqlConnection.Open();

        //        var paramaters = new DynamicParameters();

        //        paramaters.Add("@corporationId", corporation);
        //        paramaters.Add("@phongdanhmucId", phongdanhmucid);
        //        paramaters.Add("@chucvuId", chucvuid);

        //        paramaters.Add("@parameters", parameter);
        //        try
        //        {
        //            var query = sqlConnection.Query<VanBanDenViewModel>
        //                ("VanBanDenCount", paramaters, commandType: CommandType.StoredProcedure);

        //            var ketqua = query.ToList();

        //            return ketqua.Sum(p => long.Parse(p.KETQUA));
        //        }
        //        catch (Exception ex)
        //        {
        //            throw ex;
        //        }

        //    }
        //}
    }
}
