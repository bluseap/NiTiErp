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
    public class HisQuyetDinhService : IHisQuyetDinhService
    {
        private readonly IConfiguration _configuration;

        public HisQuyetDinhService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task<PagedResult<HisQuyetDinhViewModel>> GetAllHisQuyetDinhPaging(string corporationId, string phongId, string keyword, int page, int pageSize,
            string hosoId, string hosoId2, string hosoId3,
            string quyetdinhId, string quyetdinhId2, DateTime tungay, DateTime denngay, int status,
            string parameters)
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

                dynamicParameters.Add("@quyetdinhId", quyetdinhId);
                dynamicParameters.Add("@quyetdinhId2", quyetdinhId2);
                dynamicParameters.Add("@tungay", tungay);
                dynamicParameters.Add("@denngay", denngay);
                dynamicParameters.Add("@status", status);
                
                dynamicParameters.Add("@parameters", parameters);
                try
                {
                    var dangdoan = await sqlConnection.QueryAsync<HisQuyetDinhViewModel>(
                        "HisQuyetDinh", dynamicParameters, commandType: CommandType.StoredProcedure);

                    var query = dangdoan.AsQueryable();

                    int totalRow = query.Count();

                    query = query.OrderByDescending(x => x.TempCreateDate)
                        .Skip((page - 1) * pageSize).Take(pageSize);

                    var data = query.ToList();

                    var paginationSet = new PagedResult<HisQuyetDinhViewModel>()
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
