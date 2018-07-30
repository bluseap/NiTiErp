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
    public class PhongDanhMucService : IPhongDanhMucService
    {
        private readonly IConfiguration _configuration;

        public PhongDanhMucService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task<List<PhongDanhMucViewModel>> PhongDanhMucGetList(string corporationId, string id2, string id3, string parameters)
        {
            using (var sqlConnection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                await sqlConnection.OpenAsync();
                var dynamicParameters = new DynamicParameters();

                dynamicParameters.Add("@corporationId", corporationId);
                dynamicParameters.Add("@id2", id2);
                dynamicParameters.Add("@id3", id3);
                dynamicParameters.Add("@parameters", parameters);

                try
                {
                    var query = await sqlConnection.QueryAsync<PhongDanhMucViewModel>(
                        "PhongDanhMucGetList", dynamicParameters, commandType: CommandType.StoredProcedure);

                    return query.AsList();
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }

        public async Task<Boolean> PhongDMAUD(PhongDanhMucViewModel phongdm, string parameters)
        {
            using (var sqlConnection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                await sqlConnection.OpenAsync();
                var dynamicParameters = new DynamicParameters();

                dynamicParameters.Add("@Id", phongdm.Id);

                dynamicParameters.Add("@CorporationId", phongdm.CorporationId);
                dynamicParameters.Add("@TenPhong", phongdm.TenPhong);
                dynamicParameters.Add("@SoDienThoai1", phongdm.SoDienThoai1);
                dynamicParameters.Add("@SoDienThoai2", phongdm.SoDienThoai2);
                dynamicParameters.Add("@Email", phongdm.Email);

                dynamicParameters.Add("@CreateDate", phongdm.CreateDate);
                dynamicParameters.Add("@CreateBy", phongdm.CreateBy);
                dynamicParameters.Add("@UpdateDate", phongdm.UpdateDate);
                dynamicParameters.Add("@UpdateBy", phongdm.UpdareBy);

                dynamicParameters.Add("@parameters", parameters);
                try
                {
                    var query = await sqlConnection.QueryAsync<PhongDanhMucViewModel>(
                        "PhongDanhMucAUD", dynamicParameters, commandType: CommandType.StoredProcedure);

                    return true;
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }

        public async Task<PagedResult<PhongDanhMucViewModel>> GetAllPhongPaging(string corporationId, string phongId, string keyword, int page, int pageSize,
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
                    var phongdm = await sqlConnection.QueryAsync<PhongDanhMucViewModel>(
                        "PhongDanhMucsGetList", dynamicParameters, commandType: CommandType.StoredProcedure);

                    var query = phongdm.AsQueryable();

                    int totalRow = query.Count();

                    query = query.OrderByDescending(x => x.CreateDate)
                        .Skip((page - 1) * pageSize).Take(pageSize);

                    var data = query.ToList();

                    var paginationSet = new PagedResult<PhongDanhMucViewModel>()
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
