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
    public class MucLuongToiThieuService: IMucLuongToiThieuService
    {
        private readonly IConfiguration _configuration;

        public MucLuongToiThieuService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task<Boolean> MucLuongTTAUD(MucLuongToiThieuViewModel mucluongtt, string parameters)
        {
            using (var sqlConnection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                await sqlConnection.OpenAsync();
                var dynamicParameters = new DynamicParameters();

                dynamicParameters.Add("@Id", mucluongtt.Id);

                dynamicParameters.Add("@MucLuong", mucluongtt.MucLuong);
                dynamicParameters.Add("@Ten", mucluongtt.Ten);
                dynamicParameters.Add("@NgayBatDau", mucluongtt.NgayBatDau);
                dynamicParameters.Add("@NgayKetThuc", mucluongtt.NgayKetThuc);
                dynamicParameters.Add("@CorporationId", mucluongtt.CorporationId);
                dynamicParameters.Add("@GhiChu", mucluongtt.GhiChu);

                dynamicParameters.Add("@CreateDate", mucluongtt.CreateDate);
                dynamicParameters.Add("@CreateBy", mucluongtt.CreateBy);
                dynamicParameters.Add("@UpdateDate", mucluongtt.UpdateDate);
                dynamicParameters.Add("@UpdateBy", mucluongtt.UpdateBy);

                dynamicParameters.Add("@parameters", parameters);
                try
                {
                    var query = await sqlConnection.QueryAsync<MucLuongToiThieuViewModel>(
                        "MucLuongToiThieuAUD", dynamicParameters, commandType: CommandType.StoredProcedure);

                    return true;
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }

        public async Task<PagedResult<MucLuongToiThieuViewModel>> GetAllMucLuongPaging(string corporationId, string phongId, string keyword, int page, int pageSize,
            string hosoId, string hosoId2, string hosoId3, string mucluongtoithieuId, string parameters)
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
                dynamicParameters.Add("@mucluongtoithieuId", mucluongtoithieuId);

                dynamicParameters.Add("@parameters", parameters);
                try
                {
                    var mucluong = await sqlConnection.QueryAsync<MucLuongToiThieuViewModel>(
                        "MucLuongToiThieuGetList", dynamicParameters, commandType: CommandType.StoredProcedure);

                    var query = mucluong.AsQueryable();

                    int totalRow = query.Count();

                    query = query.OrderByDescending(x => x.CreateDate)
                        .Skip((page - 1) * pageSize).Take(pageSize);

                    var data = query.ToList();

                    var paginationSet = new PagedResult<MucLuongToiThieuViewModel>()
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
