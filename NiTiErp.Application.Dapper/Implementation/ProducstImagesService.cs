using Dapper;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Text;
using System.Threading.Tasks;
using NiTiErp.Application.Dapper.Interfaces;
using NiTiErp.Application.Dapper.ViewModels;

namespace NiTiErp.Application.Dapper.Implementation
{
    public class ProductsImagesService : IProductsImagesService
    {
        private readonly IConfiguration _configuration;

        public ProductsImagesService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task<IEnumerable<ProductsImagesViewModel>> RemoveProductImagesPara(int productImagesId, int productId, 
            int id, string stringId, string cobien)
        {

            using (var sqlConnection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                await sqlConnection.OpenAsync();
                var dynamicParameters = new DynamicParameters();

                dynamicParameters.Add("@productImagesId", productImagesId);
                dynamicParameters.Add("@productId", productId);
                dynamicParameters.Add("@id", id);
                dynamicParameters.Add("@stringId", stringId);
                dynamicParameters.Add("@cobien", cobien);

                try
                {
                    return await sqlConnection.QueryAsync<ProductsImagesViewModel>(
                        "RemoveProductImagesPara", dynamicParameters, commandType: CommandType.StoredProcedure);
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }

        }
    }
}
