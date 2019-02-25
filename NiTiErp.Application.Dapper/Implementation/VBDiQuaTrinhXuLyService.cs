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
    public class VBDiQuaTrinhXuLyService : IVBDiQuaTrinhXuLyService
    {
        private readonly IConfiguration _configuration;

        public VBDiQuaTrinhXuLyService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task<List<VBDiQuaTrinhXuLyViewModel>> GetListVBDiQuaTrinhXuLy(Guid hosonhanvienId, string corporationId,
            long vanbandiid, string keyword, long vbdiquatrinhxulyId, string ghichu, string parameters)
        {
            using (var sqlConnection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                await sqlConnection.OpenAsync();
                var dynamicParameters = new DynamicParameters();
                dynamicParameters.Add("@Id", vbdiquatrinhxulyId);

                dynamicParameters.Add("@hosonhanvienId", hosonhanvienId);
                dynamicParameters.Add("@corporationId", corporationId);
                dynamicParameters.Add("@vanbandiId", vanbandiid);
                dynamicParameters.Add("@keyword", keyword);
                dynamicParameters.Add("@ghichu", ghichu);

                dynamicParameters.Add("@parameters", parameters);
                try
                {
                    var query = await sqlConnection.QueryAsync<VBDiQuaTrinhXuLyViewModel>(
                        "VanBanDiQTXL", dynamicParameters, commandType: CommandType.StoredProcedure);

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
