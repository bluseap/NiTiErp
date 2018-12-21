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
    public class HoSoFileService : IHoSoFileService
    {
        private readonly IConfiguration _configuration;

        public HoSoFileService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task<PagedResult<HoSoFileViewModel>> GetAllHoSoFilePaging(string corporationId, string phongId, string keyword, int page, int pageSize,
            string hosoId, string hosoId2, string hosoId3, string hosofileId, string parameters)
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
                dynamicParameters.Add("@hosofileId", hosofileId);

                dynamicParameters.Add("@parameters", parameters);
                try
                {
                    var hoso = await sqlConnection.QueryAsync<HoSoFileViewModel>(
                        "HoSoFileGetList", dynamicParameters, commandType: CommandType.StoredProcedure);

                    var query = hoso.AsQueryable();

                    int totalRow = query.Count();

                    query = query.OrderByDescending(x => x.CreateDate)
                        .Skip((page - 1) * pageSize).Take(pageSize);

                    var data = query.ToList();

                    var paginationSet = new PagedResult<HoSoFileViewModel>()
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

        public async Task<Boolean> HoSoFileAUD(HoSoFileViewModel hosofile, string parameters)
        {
            using (var sqlConnection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                await sqlConnection.OpenAsync();
                var dynamicParameters = new DynamicParameters();

                dynamicParameters.Add("@Id", hosofile.Id);
                dynamicParameters.Add("@HoSoNhanVienId", hosofile.HoSoNhanVienId);

                dynamicParameters.Add("@TieuDe", hosofile.TieuDe);
                dynamicParameters.Add("@NoiDung", hosofile.NoiDung);
                dynamicParameters.Add("@NgayNhap", hosofile.NgayNhap);
                dynamicParameters.Add("@UploadFile1", hosofile.UploadFile1);
                dynamicParameters.Add("@UploadFile2", hosofile.UploadFile2);

                dynamicParameters.Add("@CreateDate", hosofile.CreateDate);
                dynamicParameters.Add("@CreateBy", hosofile.CreateBy);
                dynamicParameters.Add("@UpdateDate", hosofile.UpdateDate);
                dynamicParameters.Add("@UpdateBy", hosofile.UpdateBy);

                dynamicParameters.Add("@parameters", parameters);
                try
                {
                    var query = await sqlConnection.QueryAsync<HoSoFileViewModel>(
                        "HoSoFileAUD", dynamicParameters, commandType: CommandType.StoredProcedure);

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
