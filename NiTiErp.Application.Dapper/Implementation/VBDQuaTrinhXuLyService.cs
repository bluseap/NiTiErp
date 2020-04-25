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
    public class VBDQuaTrinhXuLyService : IVBDQuaTrinhXuLyService
    {
        private readonly IConfiguration _configuration;

        public VBDQuaTrinhXuLyService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task<List<VBDQuaTrinhXuLyViewModel>> GetListVBDQuaTrinhXuLy(Guid hosonhanvienId, string corporationId,
            long vanbandenid, string keyword, long vbdquatrinhxulyId, string ghichu, string parameters)
        {
            using (var sqlConnection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                await sqlConnection.OpenAsync();
                var dynamicParameters = new DynamicParameters();
                dynamicParameters.Add("@Id", vbdquatrinhxulyId);

                dynamicParameters.Add("@hosonhanvienId", hosonhanvienId);
                dynamicParameters.Add("@corporationId", corporationId);
                dynamicParameters.Add("@vanbandenId", vanbandenid);
                dynamicParameters.Add("@keyword", keyword);
                dynamicParameters.Add("@ghichu", ghichu);

                dynamicParameters.Add("@parameters", parameters);
                try
                {
                    var query = await sqlConnection.QueryAsync<VBDQuaTrinhXuLyViewModel>(
                        "VanBanDenQTXL", dynamicParameters, commandType: CommandType.StoredProcedure);

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
