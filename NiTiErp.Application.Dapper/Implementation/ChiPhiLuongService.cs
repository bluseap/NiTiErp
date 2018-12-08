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
    public class ChiPhiLuongService: IChiPhiLuongService
    {
        private readonly IConfiguration _configuration;

        public ChiPhiLuongService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task<PagedResult<ChiPhiLuongViewModel>> GetAllChiPhiLuongPaging(Int64 chiphitanggiamId, int nam, int thang, string corporationId
            , string phongdanhmucId, string keyword, Guid hosonhanvienId, int chiphiId, int luongdotinkyId, decimal tongtienchiphitanggiam
            , bool IsChiPhiTang, int ChiPhiLoaiId, int ChiPhiBangDanhMucId, bool IsChuyenKy, string ghichu, int page, int pageSize, string parameters)
        {
            using (var sqlConnection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                await sqlConnection.OpenAsync();
                var dynamicParameters = new DynamicParameters();

                dynamicParameters.Add("@chiphitanggiamId", chiphitanggiamId);
                dynamicParameters.Add("@nam", nam);
                dynamicParameters.Add("@thang", thang);
                dynamicParameters.Add("@corporationId", corporationId);

                dynamicParameters.Add("@phongdanhmucId", phongdanhmucId);
                dynamicParameters.Add("@keyword", keyword);
                dynamicParameters.Add("@hosonhanvienId", hosonhanvienId);
                dynamicParameters.Add("@chiphiId", chiphiId);
                dynamicParameters.Add("@luongdotinkyid", luongdotinkyId);
                dynamicParameters.Add("@tongtienchiphitanggiam", tongtienchiphitanggiam);

                dynamicParameters.Add("@IsChiPhiTang", IsChiPhiTang);
                dynamicParameters.Add("@ChiPhiLoaiId", ChiPhiLoaiId);
                dynamicParameters.Add("@ChiPhiBangDanhMucId", ChiPhiBangDanhMucId);
                dynamicParameters.Add("@IsChuyenKy", IsChuyenKy);
                dynamicParameters.Add("@ghichu", ghichu);                                

                dynamicParameters.Add("@parameters", parameters);
                try
                {
                    var daotaolop = await sqlConnection.QueryAsync<ChiPhiLuongViewModel>(
                        "ChiPhiLuongGetList", dynamicParameters, commandType: CommandType.StoredProcedure);

                    var query = daotaolop.AsQueryable();

                    int totalRow = query.Count();

                    query = query.OrderByDescending(x => x.CreateDate)
                        .Skip((page - 1) * pageSize).Take(pageSize);

                    var data = query.ToList();

                    var paginationSet = new PagedResult<ChiPhiLuongViewModel>()
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

        public List<ChiPhiLuongViewModel> GetListChiPhiLuong(Int64 chiphitanggiamId, int nam, int thang, string corporationId
            , string phongdanhmucId, string keyword, Guid hosonhanvienId, int chiphiId, int luongdotinkyId, decimal tongtienchiphitanggiam
            , bool IsChiPhiTang, int ChiPhiLoaiId, int ChiPhiBangDanhMucId, bool IsChuyenKy, string ghichu, int page, int pageSize, string parameters)
        {
            using (var sqlConnection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
               
                var dynamicParameters = new DynamicParameters();

                dynamicParameters.Add("@chiphitanggiamId", chiphitanggiamId);
                dynamicParameters.Add("@nam", nam);
                dynamicParameters.Add("@thang", thang);
                dynamicParameters.Add("@corporationId", corporationId);

                dynamicParameters.Add("@phongdanhmucId", phongdanhmucId);
                dynamicParameters.Add("@keyword", keyword);
                dynamicParameters.Add("@hosonhanvienId", hosonhanvienId);
                dynamicParameters.Add("@chiphiId", chiphiId);
                dynamicParameters.Add("@luongdotinkyid", luongdotinkyId);
                dynamicParameters.Add("@tongtienchiphitanggiam", tongtienchiphitanggiam);

                dynamicParameters.Add("@IsChiPhiTang", IsChiPhiTang);
                dynamicParameters.Add("@ChiPhiLoaiId", ChiPhiLoaiId);
                dynamicParameters.Add("@ChiPhiBangDanhMucId", ChiPhiBangDanhMucId);
                dynamicParameters.Add("@IsChuyenKy", IsChuyenKy);
                dynamicParameters.Add("@ghichu", ghichu);

                dynamicParameters.Add("@parameters", parameters);
                try
                {
                    var chiphiluong = sqlConnection.Query<ChiPhiLuongViewModel>(
                        "ChiPhiLuongGetList", dynamicParameters, commandType: CommandType.StoredProcedure);

                    return chiphiluong.ToList();

                    //_productRepository.FindAll(x => x.ProductCategory).ProjectTo<ProductViewModel>().ToList();
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }

        public async Task<Boolean> ChiPhiTangGiamAUD(ChiPhiLuongViewModel chiphiluong, string parameters)
        {
            using (var sqlConnection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                await sqlConnection.OpenAsync();
                var dynamicParameters = new DynamicParameters();

                dynamicParameters.Add("@chiphitanggiamId", chiphiluong.Id);

                dynamicParameters.Add("@Nam", chiphiluong.Nam);
                dynamicParameters.Add("@Thang", chiphiluong.Thang);
                dynamicParameters.Add("@HoSoNhanVienId", chiphiluong.HoSoNhanVienId);                
                dynamicParameters.Add("@ChiPhiId", chiphiluong.ChiPhiId);
                dynamicParameters.Add("@TienChiPhiTangGiam", chiphiluong.TongTienChiPhitangGiam);

                dynamicParameters.Add("@CreateDate", chiphiluong.CreateDate);
                dynamicParameters.Add("@CreateBy", chiphiluong.CreateBy);
                dynamicParameters.Add("@UpdateDate", chiphiluong.UpdateDate);
                dynamicParameters.Add("@UpdateBy", chiphiluong.UpdateBy);

                dynamicParameters.Add("@parameters", parameters);
                try
                {
                    var query = await sqlConnection.QueryAsync<ChiPhiLuongViewModel>(
                        "ChiPhiLuongAUD", dynamicParameters, commandType: CommandType.StoredProcedure);

                    return true;
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }

        public async Task<List<ChiPhiLuongViewModel>> ChiPhiLuongListAUD(string Id, Guid HoSoNhanVienId, string userId, DateTime createDate,
            string parameters)
        {
            using (var sqlConnection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                await sqlConnection.OpenAsync();
                var dynamicParameters = new DynamicParameters();

                dynamicParameters.Add("@chiphitanggiamId", Id);

                dynamicParameters.Add("@Nam", 2111);
                dynamicParameters.Add("@Thang", 11);
                dynamicParameters.Add("@HoSoNhanVienId", HoSoNhanVienId);
                dynamicParameters.Add("@ChiPhiId", 0);
                dynamicParameters.Add("@TienChiPhiTangGiam", 0);

                dynamicParameters.Add("@CreateDate", createDate);
                dynamicParameters.Add("@CreateBy", userId);
                dynamicParameters.Add("@UpdateDate", createDate);
                dynamicParameters.Add("@UpdateBy", userId);

                dynamicParameters.Add("@parameters", parameters);
                try
                {
                    var query = await sqlConnection.QueryAsync<ChiPhiLuongViewModel>(
                        "ChiPhiLuongAUD", dynamicParameters, commandType: CommandType.StoredProcedure);

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
