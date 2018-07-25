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
    public class CorporationService : ICorporationService
    {
        private readonly IConfiguration _configuration;

        public CorporationService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task<PagedResult<CorporationViewModel>> GetAllCorPaging(string corporationId, string phongId, string keyword, int page, int pageSize,
            string hosoId, string hosoId2, string hosoId3, string parameters)
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
                dynamicParameters.Add("@hosoId3", hosoId3);               

                dynamicParameters.Add("@parameters", parameters);
                try
                {
                    var corpo = await sqlConnection.QueryAsync<CorporationViewModel>(
                        "CorporationsGetList", dynamicParameters, commandType: CommandType.StoredProcedure);

                    var query = corpo.AsQueryable();

                    int totalRow = query.Count();

                    query = query.OrderByDescending(x => x.DateCreated)
                        .Skip((page - 1) * pageSize).Take(pageSize);

                    var data = query.ToList();

                    var paginationSet = new PagedResult<CorporationViewModel>()
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

        public async Task<List<CorporationViewModel>> CorporationGetList(string corporationServiceId, string id2, string id3, string parameters)
        {
            using (var sqlConnection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                await sqlConnection.OpenAsync();
                var dynamicParameters = new DynamicParameters();

                dynamicParameters.Add("@corporationServiceId", corporationServiceId);
                dynamicParameters.Add("@id2", id2);
                dynamicParameters.Add("@id3", id3);
                dynamicParameters.Add("@parameters", parameters);

                try
                {
                    var query = await sqlConnection.QueryAsync<CorporationViewModel>(
                        "CorporationGetList", dynamicParameters, commandType: CommandType.StoredProcedure);

                    return query.AsList();                    
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }

        public async Task<Boolean> CorporationAUD(CorporationViewModel corpo, string parameters)
        {
            using (var sqlConnection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                await sqlConnection.OpenAsync();
                var dynamicParameters = new DynamicParameters();

                dynamicParameters.Add("@Id", corpo.Id);

                dynamicParameters.Add("@Address", corpo.Address);
                dynamicParameters.Add("@CorporationServiceId", corpo.CorporationServiceId);
                dynamicParameters.Add("@DateCreated", corpo.DateCreated);
                dynamicParameters.Add("@DateModified", corpo.DateModified);
                dynamicParameters.Add("@Email", corpo.Email);
                dynamicParameters.Add("@Image", corpo.Image);
                dynamicParameters.Add("@ImageLogo", corpo.ImageLogo);
                dynamicParameters.Add("@Name", corpo.Name);
                dynamicParameters.Add("@PhoneNumber1", corpo.PhoneNumber1);
                dynamicParameters.Add("@PhoneNumber2", corpo.PhoneNumber2);
                dynamicParameters.Add("@TaxNumber", corpo.TaxNumber);
                dynamicParameters.Add("@WebName", corpo.WebName);
                dynamicParameters.Add("@UserIdCreated", corpo.UserIdCreated);
                dynamicParameters.Add("@UserIdModified", corpo.UserIdModified);
                dynamicParameters.Add("@ParentId", corpo.ParentId);              

                dynamicParameters.Add("@parameters", parameters);
                try
                {
                    var query = await sqlConnection.QueryAsync<CorporationViewModel>(
                        "CorporationAUD", dynamicParameters, commandType: CommandType.StoredProcedure);

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
