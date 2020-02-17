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
    public class VanBanNhomXuLyService : IVanBanNhomXuLyService
    {
        private readonly IConfiguration _configuration;

        public VanBanNhomXuLyService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task<PagedResult<VanBanNhomXuLyViewModel>> GetAllVanBanNhomXuLyPaging(string tennhom, Guid hosonhanvienId,
            string keyword, int page, int pageSize, int vanbannhomxulyid, string ghichu,  string parameters)
        {
            using (var sqlConnection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                await sqlConnection.OpenAsync();
                var dynamicParameters = new DynamicParameters();

                dynamicParameters.Add("@Id", vanbannhomxulyid);

                dynamicParameters.Add("@tennhom", tennhom);
                dynamicParameters.Add("@hosonhanvienId", hosonhanvienId);
                dynamicParameters.Add("@keyword", keyword);
                dynamicParameters.Add("@vanbannhomxulyid", vanbannhomxulyid);
                dynamicParameters.Add("@ghichu", ghichu);

                dynamicParameters.Add("@parameters", parameters);
                try
                {
                    var hoso = await sqlConnection.QueryAsync<VanBanNhomXuLyViewModel>(
                        "VanBanNhomXuLyGetList", dynamicParameters, commandType: CommandType.StoredProcedure);

                    var query = hoso.AsQueryable();

                    int totalRow = query.Count();

                    query = query.OrderByDescending(x => x.CreateDate)
                        .Skip((page - 1) * pageSize).Take(pageSize);

                    var data = query.ToList();

                    var paginationSet = new PagedResult<VanBanNhomXuLyViewModel>()
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

        public async Task<Boolean> VanBanNhomXuLyAUD(VanBanNhomXuLyViewModel vanbannhomxuly, string parameters)
        {
            using (var sqlConnection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                await sqlConnection.OpenAsync();
                var dynamicParameters = new DynamicParameters();

                dynamicParameters.Add("@Id", vanbannhomxuly.Id);

                dynamicParameters.Add("@Ten", vanbannhomxuly.Ten);
                dynamicParameters.Add("@MoTa", vanbannhomxuly.MoTa);
                dynamicParameters.Add("@Stt", vanbannhomxuly.Stt);
                dynamicParameters.Add("@stringHoSoNhanVienId", vanbannhomxuly.StringHoSoId);             

                dynamicParameters.Add("@parameters", parameters);

                try
                {
                    var query = await sqlConnection.QueryAsync<VanBanNhomXuLyViewModel>(
                        "VanBanNhomXuLyAUD", dynamicParameters, commandType: CommandType.StoredProcedure);

                    return true;
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }

        public async Task<List<VanBanNhomXuLyViewModel>> VanBanNhomXuLyGetList(string tennhom, Guid hosonhanvienId,
            string keyword, int vanbannhomxulyid, string ghichu, string parameters)
        {
            using (var sqlConnection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                await sqlConnection.OpenAsync();
                var dynamicParameters = new DynamicParameters();

                dynamicParameters.Add("@Id", vanbannhomxulyid);

                dynamicParameters.Add("@tennhom", tennhom);
                dynamicParameters.Add("@hosonhanvienId", hosonhanvienId);
                dynamicParameters.Add("@keyword", keyword);
                dynamicParameters.Add("@vanbannhomxulyid", vanbannhomxulyid);
                dynamicParameters.Add("@ghichu", ghichu);

                dynamicParameters.Add("@parameters", parameters);
                try
                {
                    var query = await sqlConnection.QueryAsync<VanBanNhomXuLyViewModel>(
                        "VanBanNhomXuLyGetList", dynamicParameters, commandType: CommandType.StoredProcedure); // @parameter: ChiPhiLoaiGetList

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
