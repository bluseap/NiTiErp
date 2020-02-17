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
    public class VBAutocompleteService : IVBAutocompleteService
    {
        private readonly IConfiguration _configuration;

        public VBAutocompleteService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task<List<VBAutocompleteViewModel>> VBAutoGetList(string codeXL, string tenChucVu,
            string tenNhanVien, string trichYeu, string ghiChu, string parameters)
        {
            using (var sqlConnection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                await sqlConnection.OpenAsync();
                var dynamicParameters = new DynamicParameters();

                dynamicParameters.Add("@codeXL", codeXL);
                dynamicParameters.Add("@tenChucVu", tenChucVu);
                dynamicParameters.Add("@tenNhanVien", tenNhanVien);
                dynamicParameters.Add("@trichYeu", trichYeu);
                dynamicParameters.Add("@ghiChu", ghiChu);                

                dynamicParameters.Add("@parameters", parameters);

                try
                {
                    var query = await sqlConnection.QueryAsync<VBAutocompleteViewModel>(
                        "VBAutocompleteGetList", dynamicParameters, commandType: CommandType.StoredProcedure);
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
