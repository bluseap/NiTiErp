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

    }
}
