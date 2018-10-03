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
    public class DaoTaoGiaoVienService : IDaoTaoGiaoVienService
    {
        private readonly IConfiguration _configuration;

        public DaoTaoGiaoVienService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task<PagedResult<DaoTaoGiaoVienViewModel>> GetAllDaoTaoGiaoVienPaging(int namDaoTao, string daotaonoiId, string chuyenmon, string keyword, int page, int pageSize,
            Guid daotaogiaovienId2, Guid daotaolopId2, string parameters)
        {
            using (var sqlConnection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                await sqlConnection.OpenAsync();
                var dynamicParameters = new DynamicParameters();

                dynamicParameters.Add("@namDaoTao", namDaoTao);
                dynamicParameters.Add("@daotaonoiId", daotaonoiId);
                dynamicParameters.Add("@chuyenmon", chuyenmon);
                dynamicParameters.Add("@keyword", keyword);
                dynamicParameters.Add("@daotaogiaovienId2", daotaogiaovienId2);
                dynamicParameters.Add("@daotaolopId2", daotaolopId2);

                dynamicParameters.Add("@parameters", parameters);
                try
                {
                    var daotaolop = await sqlConnection.QueryAsync<DaoTaoGiaoVienViewModel>(
                        "DaoTaoGiaoVienGetList", dynamicParameters, commandType: CommandType.StoredProcedure);

                    var query = daotaolop.AsQueryable();

                    int totalRow = query.Count();

                    query = query.OrderByDescending(x => x.CreateDate)
                        .Skip((page - 1) * pageSize).Take(pageSize);

                    var data = query.ToList();

                    var paginationSet = new PagedResult<DaoTaoGiaoVienViewModel>()
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

        public async Task<List<DaoTaoGiaoVienViewModel>> DaoTaoGiaoVienGetList(int namDaoTao, string daotaonoiId, string chuyenmon, string keyword, int page, int pageSize,
            Guid daotaogiaovienId2, Guid daotaolopId2, string parameters)
        {
            using (var sqlConnection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                await sqlConnection.OpenAsync();
                var dynamicParameters = new DynamicParameters();

                dynamicParameters.Add("@namDaoTao", namDaoTao);
                dynamicParameters.Add("@daotaonoiId", daotaonoiId);
                dynamicParameters.Add("@chuyenmon", chuyenmon);
                dynamicParameters.Add("@keyword", keyword);
                dynamicParameters.Add("@daotaogiaovienId2", daotaogiaovienId2);
                dynamicParameters.Add("@daotaolopId2", daotaolopId2);

                dynamicParameters.Add("@parameters", parameters);
                try
                {
                    var query = await sqlConnection.QueryAsync<DaoTaoGiaoVienViewModel>(
                        "DaoTaoGiaoVienGetList", dynamicParameters, commandType: CommandType.StoredProcedure);

                    return query.AsList();
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }

        public async Task<Boolean> DaoTaoGiaoVienAUD(DaoTaoGiaoVienViewModel daotaogiaovien, string parameters)
        {
            using (var sqlConnection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                await sqlConnection.OpenAsync();
                var dynamicParameters = new DynamicParameters();

                dynamicParameters.Add("@Id", daotaogiaovien.Id);

                dynamicParameters.Add("@DaoTaoNoiId", daotaogiaovien.DaoTaoNoiId);
                dynamicParameters.Add("@TenGiaoVien", daotaogiaovien.TenGiaoVien);
                dynamicParameters.Add("@ChucDanh", daotaogiaovien.ChucDanh );
                dynamicParameters.Add("@DiaChi", daotaogiaovien.DiaChi );
                dynamicParameters.Add("@SoDienThoai", daotaogiaovien.SoDienThoai);
                dynamicParameters.Add("@Email", daotaogiaovien.Email  );
                dynamicParameters.Add("@Hinh", daotaogiaovien.Hinh);

                dynamicParameters.Add("@CreateDate", daotaogiaovien.CreateDate);
                dynamicParameters.Add("@CreateBy", daotaogiaovien.CreateBy);
                dynamicParameters.Add("@UpdateDate", daotaogiaovien.UpdateDate);
                dynamicParameters.Add("@UpdateBy", daotaogiaovien.UpdateBy);                

                dynamicParameters.Add("@parameters", parameters);

                try
                {
                    var query = await sqlConnection.QueryAsync<DaoTaoGiaoVienViewModel>(
                        "DaoTaoGiaoVienAUD", dynamicParameters, commandType: CommandType.StoredProcedure);

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
