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
    public class VanBanDenSoService: IVanBanDenSoService
    {
        private readonly IConfiguration _configuration;

        public VanBanDenSoService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task<PagedResult<VanBanDenSoViewModel>> GetAllVanBanDenSoPaging(int nam, string corporationId, int vanbandenid,
            string keyword, int page, int pageSize, string ghichu, string parameters)
        {
            using (var sqlConnection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                await sqlConnection.OpenAsync();
                var dynamicParameters = new DynamicParameters();

                dynamicParameters.Add("@corporationId", corporationId);
                dynamicParameters.Add("@nam", nam);
                dynamicParameters.Add("@keyword", keyword);
                dynamicParameters.Add("@vanbandenid", vanbandenid);
                dynamicParameters.Add("@ghichu", ghichu);                

                dynamicParameters.Add("@parameters", parameters);
                try
                {
                    var hoso = await sqlConnection.QueryAsync<VanBanDenSoViewModel>(
                        "VanBanDenSoGetList", dynamicParameters, commandType: CommandType.StoredProcedure);

                    var query = hoso.AsQueryable();

                    int totalRow = query.Count();

                    query = query.OrderByDescending(x => x.CreateDate)
                        .Skip((page - 1) * pageSize).Take(pageSize);

                    var data = query.ToList();

                    var paginationSet = new PagedResult<VanBanDenSoViewModel>()
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

        public async Task<List<VanBanDenSoViewModel>> VanBanDenSoGetList(string corporationid, int nam, string keyword,
            int vanbandenid, string ghichu, string parameters)
        {
            using (var sqlConnection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                await sqlConnection.OpenAsync();
                var dynamicParameters = new DynamicParameters();

                dynamicParameters.Add("@corporationId", corporationid);
                dynamicParameters.Add("@nam", nam);
                dynamicParameters.Add("@keyword", keyword);
                dynamicParameters.Add("@vanbandenid", vanbandenid);
                dynamicParameters.Add("@ghichu", ghichu);

                dynamicParameters.Add("@parameters", parameters);

                try
                {
                    var query = await sqlConnection.QueryAsync<VanBanDenSoViewModel>(
                        "VanBanDenSoGetList", dynamicParameters, commandType: CommandType.StoredProcedure);

                    return query.AsList();
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }

        public async Task<List<VanBanDenViewModel>> VBDenSoExcel(string corporationid, DateTime tungay,
            DateTime denngay, string trangthai, string ghichu, string makv, string parameters)
        {
            using (var sqlConnection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                await sqlConnection.OpenAsync();
                var dynamicParameters = new DynamicParameters();

                dynamicParameters.Add("@corporationId", corporationid);
                dynamicParameters.Add("@tungay", tungay);
                dynamicParameters.Add("@denngay", denngay);
                dynamicParameters.Add("@trangthai", trangthai);
                dynamicParameters.Add("@ghichu", ghichu);
                dynamicParameters.Add("@makv", makv);

                dynamicParameters.Add("@parameters", parameters);

                try
                {
                    var query = await sqlConnection.QueryAsync<VanBanDenViewModel>(
                        "VBDenSoExcel", dynamicParameters, commandType: CommandType.StoredProcedure);
                    return query.AsList();
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }

        public async Task<Boolean> VanBanDenSoAUD(VanBanDenSoViewModel vanbandenso, string parameters)
        {
            using (var sqlConnection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                await sqlConnection.OpenAsync();
                var dynamicParameters = new DynamicParameters();

                dynamicParameters.Add("@Id", vanbandenso.Id);           
              
                dynamicParameters.Add("@Nam", vanbandenso.Nam);
                dynamicParameters.Add("@CorporationId", vanbandenso.CorporationId);
                dynamicParameters.Add("@TenSo", vanbandenso.TenSo);
                dynamicParameters.Add("@SoDenHienTai", vanbandenso.SoDenHienTai);
                dynamicParameters.Add("@SoDenHet", vanbandenso.SoDenHet);
                dynamicParameters.Add("@DoUuTien", vanbandenso.DoUuTien);
                dynamicParameters.Add("@Stt", vanbandenso.Stt);

                dynamicParameters.Add("@CreateBy", vanbandenso.CreateBy);
                dynamicParameters.Add("@CreateDate", vanbandenso.CreateDate);
                dynamicParameters.Add("@UpdateDate", vanbandenso.UpdateDate);
                dynamicParameters.Add("@UpdateBy", vanbandenso.UpdateBy);

                dynamicParameters.Add("@parameters", parameters);

                try
                {
                    var query = await sqlConnection.QueryAsync<VanBanDenSoViewModel>(
                        "VanBanDenSoAUD", dynamicParameters, commandType: CommandType.StoredProcedure);

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
