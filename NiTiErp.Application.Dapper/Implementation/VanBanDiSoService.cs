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
    public class VanBanDiSoService : IVanBanDiSoService
    {
        private readonly IConfiguration _configuration;

        public VanBanDiSoService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task<PagedResult<VanBanDiSoViewModel>> GetAllVanBanDiSoPaging(int nam, string corporationId, int vanbandiid,
            string keyword, int page, int pageSize, string ghichu, string parameters)
        {
            using (var sqlConnection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                await sqlConnection.OpenAsync();
                var dynamicParameters = new DynamicParameters();

                dynamicParameters.Add("@corporationId", corporationId);
                dynamicParameters.Add("@nam", nam);
                dynamicParameters.Add("@keyword", keyword);
                dynamicParameters.Add("@vanbandiid", vanbandiid);
                dynamicParameters.Add("@ghichu", ghichu);

                dynamicParameters.Add("@parameters", parameters);
                try
                {
                    var hoso = await sqlConnection.QueryAsync<VanBanDiSoViewModel>(
                        "VanBanDiSoGetList", dynamicParameters, commandType: CommandType.StoredProcedure);

                    var query = hoso.AsQueryable();

                    int totalRow = query.Count();

                    query = query.OrderByDescending(x => x.CreateDate)
                        .Skip((page - 1) * pageSize).Take(pageSize);

                    var data = query.ToList();

                    var paginationSet = new PagedResult<VanBanDiSoViewModel>()
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

        public async Task<List<VanBanDiSoViewModel>> VanBanDiSoGetList(string corporationid, int nam, string keyword,
            int vanbandiid, string ghichu, string parameters)
        {
            using (var sqlConnection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                await sqlConnection.OpenAsync();
                var dynamicParameters = new DynamicParameters();

                dynamicParameters.Add("@corporationId", corporationid);
                dynamicParameters.Add("@nam", nam);
                dynamicParameters.Add("@keyword", keyword);
                dynamicParameters.Add("@vanbandiid", vanbandiid);
                dynamicParameters.Add("@ghichu", ghichu);

                dynamicParameters.Add("@parameters", parameters);

                try
                {
                    var query = await sqlConnection.QueryAsync<VanBanDiSoViewModel>(
                        "VanBanDiSoGetList", dynamicParameters, commandType: CommandType.StoredProcedure);

                    return query.AsList();
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }

        public async Task<Boolean> VanBanDiSoAUD(VanBanDiSoViewModel vanbandiso, string parameters)
        {
            using (var sqlConnection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                await sqlConnection.OpenAsync();
                var dynamicParameters = new DynamicParameters();

                dynamicParameters.Add("@Id", vanbandiso.Id);

                dynamicParameters.Add("@Nam", vanbandiso.Nam);
                dynamicParameters.Add("@CorporationId", vanbandiso.CorporationId);
                dynamicParameters.Add("@TenSo", vanbandiso.TenSo);
                dynamicParameters.Add("@SoDenHienTai", vanbandiso.SoDiHienTai);
                dynamicParameters.Add("@SoDenHet", vanbandiso.SoDiHet);
                dynamicParameters.Add("@DoUuTien", vanbandiso.DoUuTien);
                dynamicParameters.Add("@Stt", vanbandiso.Stt);

                dynamicParameters.Add("@CreateBy", vanbandiso.CreateBy);
                dynamicParameters.Add("@CreateDate", vanbandiso.CreateDate);
                dynamicParameters.Add("@UpdateDate", vanbandiso.UpdateDate);
                dynamicParameters.Add("@UpdateBy", vanbandiso.UpdateBy);

                dynamicParameters.Add("@parameters", parameters);

                try
                {
                    var query = await sqlConnection.QueryAsync<VanBanDiSoViewModel>(
                        "VanBanDiSoAUD", dynamicParameters, commandType: CommandType.StoredProcedure);

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
