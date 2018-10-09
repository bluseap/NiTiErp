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
    public class DaoTaoNhanVienService :  IDaoTaoNhanVienService
    {
        private readonly IConfiguration _configuration;

        public DaoTaoNhanVienService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task<PagedResult<DaoTaoNhanVienViewModel>> GetAllDaoTaoNhanVienPaging(Guid daotaonhanvienId, Guid hosoId, Guid DaoTaoLopId,
            string CorporationId, string PhongBanDanhMucId, Guid daotaonhanvienId2, string keyword, int page, int pageSize, string parameters)
        {
            using (var sqlConnection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                await sqlConnection.OpenAsync();
                var dynamicParameters = new DynamicParameters();

                dynamicParameters.Add("@daotaonhanvienId", daotaonhanvienId);
                dynamicParameters.Add("@hosoId", hosoId);
                dynamicParameters.Add("@DaoTaoLopId", DaoTaoLopId);
                dynamicParameters.Add("@CorporationId", CorporationId);
                dynamicParameters.Add("@PhongBanDanhMucId", PhongBanDanhMucId);
                dynamicParameters.Add("@daotaonhanvienId2", daotaonhanvienId2);
                dynamicParameters.Add("@keyword", keyword);

                dynamicParameters.Add("@parameters", parameters);
                try
                {
                    var daotaonhanvien = await sqlConnection.QueryAsync<DaoTaoNhanVienViewModel>(
                        "DaoTaoNhanVienGetList", dynamicParameters, commandType: CommandType.StoredProcedure);

                    var query = daotaonhanvien.AsQueryable();

                    int totalRow = query.Count();

                    query = query.OrderByDescending(x => x.CreateDate)
                        .Skip((page - 1) * pageSize).Take(pageSize);

                    var data = query.ToList();

                    var paginationSet = new PagedResult<DaoTaoNhanVienViewModel>()
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

        public async Task<List<DaoTaoNhanVienViewModel>> DaoTaoNhanVienGetList(Guid daotaonhanvienId, Guid hosoId, Guid DaoTaoLopId,
            string CorporationId, string PhongBanDanhMucId, Guid daotaonhanvienId2, string keyword, int page, int pageSize, string parameters)
        {
            using (var sqlConnection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                await sqlConnection.OpenAsync();
                var dynamicParameters = new DynamicParameters();

                dynamicParameters.Add("@daotaonhanvienId", daotaonhanvienId);
                dynamicParameters.Add("@hosoId", hosoId);
                dynamicParameters.Add("@DaoTaoLopId", DaoTaoLopId);
                dynamicParameters.Add("@CorporationId", CorporationId);
                dynamicParameters.Add("@PhongBanDanhMucId", PhongBanDanhMucId);
                dynamicParameters.Add("@daotaonhanvienId2", daotaonhanvienId2);
                dynamicParameters.Add("@keyword", keyword);

                dynamicParameters.Add("@parameters", parameters);
                try
                {
                    var query = await sqlConnection.QueryAsync<DaoTaoNhanVienViewModel>(
                        "DaoTaoNhanVienGetList", dynamicParameters, commandType: CommandType.StoredProcedure);

                    return query.AsList();
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }

        public async Task<List<DaoTaoNhanVienViewModel>> DaoTaoNhanVienListAUD(Guid daotaonhanvienId, Guid hosoId, Guid DaoTaoLopId, string userId, string parameters)
        {
            using (var sqlConnection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                await sqlConnection.OpenAsync();
                var dynamicParameters = new DynamicParameters();

                dynamicParameters.Add("@Id", daotaonhanvienId);

                dynamicParameters.Add("@HoSoNhanVienId", hosoId);
                dynamicParameters.Add("@DaoTaoLopId", DaoTaoLopId);
                dynamicParameters.Add("@Ten", "1");
                dynamicParameters.Add("@CorporationId", "1");
                dynamicParameters.Add("@PhongBanDanhMucId", "1");
                dynamicParameters.Add("@ChucVuNhanVienId", "1");
                dynamicParameters.Add("@Hinh", "1");
                dynamicParameters.Add("@Stt", "1");
                dynamicParameters.Add("@CreateDate", DateTime.Now);
                dynamicParameters.Add("@CreateBy", userId);
                dynamicParameters.Add("@UpdateDate", DateTime.Now);
                dynamicParameters.Add("@UpdateBy", "");              

                dynamicParameters.Add("@parameters", parameters);
                try
                {
                    var query = await sqlConnection.QueryAsync<DaoTaoNhanVienViewModel>(
                        "DaoTaoNhanVienAUD", dynamicParameters, commandType: CommandType.StoredProcedure);

                    return query.AsList();
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }

        public async Task<Boolean> DaoTaoNhanVienAUD(DaoTaoNhanVienViewModel daotaonhanvien, string parameters)
        {
            using (var sqlConnection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                await sqlConnection.OpenAsync();
                var dynamicParameters = new DynamicParameters();

                dynamicParameters.Add("@Id", daotaonhanvien.Id);

                dynamicParameters.Add("@HoSoNhanVienId", daotaonhanvien.HoSoNhanVienId);
                dynamicParameters.Add("@DaoTaoLopId", daotaonhanvien.DaoTaoLopId);
                dynamicParameters.Add("@Ten", daotaonhanvien.Ten);
                dynamicParameters.Add("@CorporationId", daotaonhanvien.CorporationId);
                dynamicParameters.Add("@PhongBanDanhMucId", daotaonhanvien.PhongBanDanhMucId);
                dynamicParameters.Add("@ChucVuNhanVienId", daotaonhanvien.ChucVuNhanVienId);
                dynamicParameters.Add("@Hinh", daotaonhanvien.Hinh);               
                dynamicParameters.Add("@Stt", daotaonhanvien.Stt);
                dynamicParameters.Add("@CreateDate", daotaonhanvien.CreateDate);
                dynamicParameters.Add("@CreateBy", daotaonhanvien.CreateBy);
                dynamicParameters.Add("@UpdateDate", daotaonhanvien.UpdateDate);
                dynamicParameters.Add("@UpdateBy", daotaonhanvien.UpdateBy);

                dynamicParameters.Add("@parameters", parameters);

                try
                {
                    var query = await sqlConnection.QueryAsync<DaoTaoNhanVienViewModel>(
                        "DaoTaoNhanVienAUD", dynamicParameters, commandType: CommandType.StoredProcedure);

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
