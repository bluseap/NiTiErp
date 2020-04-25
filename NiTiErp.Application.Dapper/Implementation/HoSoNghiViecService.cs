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
    public class HoSoNghiViecService: IHoSoNghiViecService
    {
        private readonly IConfiguration _configuration;

        public HoSoNghiViecService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task<PagedResult<HoSoNghiViecViewModel>> GetAllHoSoNghiViecPaging(string corporationId, string phongId, string keyword, int page, int pageSize,
            string hosoId, string hosoId2, string hosoId3, string hosonghiviecId, string parameters)
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
                dynamicParameters.Add("@hosonghiviecId", hosonghiviecId);

                dynamicParameters.Add("@parameters", parameters);
                try
                {
                    var hoso = await sqlConnection.QueryAsync<HoSoNghiViecViewModel>(
                        "HoSoNghiViecGetList", dynamicParameters, commandType: CommandType.StoredProcedure);

                    var query = hoso.AsQueryable();

                    int totalRow = query.Count();

                    query = query.OrderByDescending(x => x.CreateDate)
                        .Skip((page - 1) * pageSize).Take(pageSize);

                    var data = query.ToList();

                    var paginationSet = new PagedResult<HoSoNghiViecViewModel>()
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

        public async Task<Boolean> HoSoNghiViecAUD(HoSoNghiViecViewModel hosonghiviec, string parameters)
        {
            using (var sqlConnection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                await sqlConnection.OpenAsync();
                var dynamicParameters = new DynamicParameters();

                dynamicParameters.Add("@Id", hosonghiviec.Id);
                dynamicParameters.Add("@HoSoNhanVienId", hosonghiviec.HoSoNhanVienId);

                dynamicParameters.Add("@NgayNghiViec", hosonghiviec.NgayNghiViec);
                dynamicParameters.Add("@LyDoNghiViec", hosonghiviec.LyDoNghiViec);           
                dynamicParameters.Add("@GhiChu", hosonghiviec.GhiChu);

                dynamicParameters.Add("@CreateDate", hosonghiviec.CreateDate);
                dynamicParameters.Add("@CreateBy", hosonghiviec.CreateBy);
                dynamicParameters.Add("@UpdateDate", hosonghiviec.UpdateDate);
                dynamicParameters.Add("@UpdateBy", hosonghiviec.UpdateBy);

                dynamicParameters.Add("@parameters", parameters);
                try
                {
                    var query = await sqlConnection.QueryAsync<HoSoNghiViecViewModel>(
                        "HoSoNghiViecAUD", dynamicParameters, commandType: CommandType.StoredProcedure);

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
