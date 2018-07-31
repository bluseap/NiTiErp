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
    public class ChucVuNhanVienService : IChucVuNhanVienService
    {
        private readonly IConfiguration _configuration;

        public ChucVuNhanVienService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task<Boolean> ChucVuNhanVienAUD(ChucVuNhanVienViewModel chucvu, string parameters)
        {
            using (var sqlConnection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                await sqlConnection.OpenAsync();
                var dynamicParameters = new DynamicParameters();

                dynamicParameters.Add("@Id", chucvu.Id);

                dynamicParameters.Add("@CorporationId", chucvu.CorporationId);
                dynamicParameters.Add("@TenChucVu", chucvu.TenChucVu);
                dynamicParameters.Add("@ChucDanhDanhMucId", chucvu.ChucDanhDanhMucId);

                dynamicParameters.Add("@CreateDate", chucvu.CreateDate);
                dynamicParameters.Add("@CreateBy", chucvu.CreateBy);
                dynamicParameters.Add("@UpdateDate", chucvu.UpdateDate);
                dynamicParameters.Add("@UpdateBy", chucvu.UpdateBy);

                dynamicParameters.Add("@parameters", parameters);
                try
                {
                    var query = await sqlConnection.QueryAsync<ChucVuNhanVienViewModel>(
                        "ChucVuNhanVienAUD", dynamicParameters, commandType: CommandType.StoredProcedure);

                    return true;
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }

        public async Task<PagedResult<ChucVuNhanVienViewModel>> GetAllChucVuPaging(string corporationId, string phongId, string keyword, int page, int pageSize,
            string hosoId, string hosoId2, string hosoId3, string chucvuId, string parameters)
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
                dynamicParameters.Add("@chucvuId", chucvuId);

                dynamicParameters.Add("@parameters", parameters);
                try
                {
                    var chucvu = await sqlConnection.QueryAsync<ChucVuNhanVienViewModel>(
                        "ChucVuNhanVienGetList", dynamicParameters, commandType: CommandType.StoredProcedure);

                    var query = chucvu.AsQueryable();

                    int totalRow = query.Count();

                    query = query.OrderByDescending(x => x.CreateDate)
                        .Skip((page - 1) * pageSize).Take(pageSize);

                    var data = query.ToList();

                    var paginationSet = new PagedResult<ChucVuNhanVienViewModel>()
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

        public async Task<List<ChucVuNhanVienViewModel>> ChucVuNhanVienGetList(string bangId, string id2, string id3, string parameters)
        {
            using (var sqlConnection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                await sqlConnection.OpenAsync();
                var dynamicParameters = new DynamicParameters();

                dynamicParameters.Add("@bangId", bangId);
                dynamicParameters.Add("@id2", id2);
                dynamicParameters.Add("@id3", id3);
                dynamicParameters.Add("@parameters", parameters);

                try
                {
                    var query = await sqlConnection.QueryAsync<ChucVuNhanVienViewModel>(
                        "BangDanhMucGetList", dynamicParameters, commandType: CommandType.StoredProcedure);

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
