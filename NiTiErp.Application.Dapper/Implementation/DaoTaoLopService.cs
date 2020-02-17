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
    public class DaoTaoLopService : IDaoTaoLopService
    {
        private readonly IConfiguration _configuration;

        public DaoTaoLopService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task<PagedResult<DaoTaoLopViewModel>> GetAllDaoTaoLopPaging(int namDaoTao, string daotaonoiId, string chuyenmon, string keyword, int page, int pageSize,
            Guid daotaolopId2, string daotaonoiId2, string parameters)
        {
            using (var sqlConnection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                await sqlConnection.OpenAsync();
                var dynamicParameters = new DynamicParameters();

                dynamicParameters.Add("@namDaoTao", namDaoTao);
                dynamicParameters.Add("@daotaonoiId", daotaonoiId);
                dynamicParameters.Add("@chuyenmon", chuyenmon);
                dynamicParameters.Add("@keyword", keyword);               
                dynamicParameters.Add("@daotaolopId2", daotaolopId2);
                dynamicParameters.Add("@daotaonoiId2", daotaonoiId2);

                dynamicParameters.Add("@parameters", parameters);
                try
                {
                    var daotaolop = await sqlConnection.QueryAsync<DaoTaoLopViewModel>(
                        "DaoTaoLopGetList", dynamicParameters, commandType: CommandType.StoredProcedure);

                    var query = daotaolop.AsQueryable();

                    int totalRow = query.Count();

                    query = query.OrderByDescending(x => x.CreateDate)
                        .Skip((page - 1) * pageSize).Take(pageSize);

                    var data = query.ToList();

                    var paginationSet = new PagedResult<DaoTaoLopViewModel>()
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

        public async Task<List<DaoTaoLopViewModel>> DaoTaoLopGetList(int namDaoTao, string daotaonoiId, string chuyenmon, string keyword, int page, int pageSize,
            Guid daotaolopId2, string daotaonoiId2, string parameters)
        {
            using (var sqlConnection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                await sqlConnection.OpenAsync();
                var dynamicParameters = new DynamicParameters();

                dynamicParameters.Add("@namDaoTao", namDaoTao);
                dynamicParameters.Add("@daotaonoiId", daotaonoiId);
                dynamicParameters.Add("@chuyenmon", chuyenmon);
                dynamicParameters.Add("@keyword", keyword);
                dynamicParameters.Add("@daotaolopId2", daotaolopId2);
                dynamicParameters.Add("@daotaonoiId2", daotaonoiId2);

                dynamicParameters.Add("@parameters", parameters);
                try
                {
                    var query = await sqlConnection.QueryAsync<DaoTaoLopViewModel>(
                        "DaoTaoLopGetList", dynamicParameters, commandType: CommandType.StoredProcedure);

                    return query.AsList();
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }

        public async Task<Boolean> DaoTaoLopAUD(DaoTaoLopViewModel daotaolop, string parameters)
        {
            using (var sqlConnection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                await sqlConnection.OpenAsync();
                var dynamicParameters = new DynamicParameters();

                dynamicParameters.Add("@Id", daotaolop.Id);

                dynamicParameters.Add("@DaoTaoNoiId", daotaolop.DaoTaoNoiId );
                dynamicParameters.Add("@LoaiDaoTaoDanhMucId", daotaolop.LoaiDaoTaoDanhMucId);
                dynamicParameters.Add("@LoaiBangDanhMucId", daotaolop.LoaiBangDanhMucId );
                dynamicParameters.Add("@ChuyenMon", daotaolop.ChuyenMon );
                dynamicParameters.Add("@NoiHoc", daotaolop.NoiHoc );
                dynamicParameters.Add("@DiaChiHoc", daotaolop.DiaChiHoc   );
                dynamicParameters.Add("@SoDienThoai", daotaolop.SoDienThoai     );
                dynamicParameters.Add("@Email", daotaolop.Email );
                dynamicParameters.Add("@SoLuongDangKy", daotaolop.SoLuongDangKy  );
                dynamicParameters.Add("@SoLuongHoc", daotaolop.SoLuongHoc  );
                dynamicParameters.Add("@NgayBatDau", daotaolop.NgayBatDau  );
                dynamicParameters.Add("@NgayKetThuc", daotaolop.NgayKetThuc );
                dynamicParameters.Add("@SoTietHoc", daotaolop.SoTietHoc   );
                dynamicParameters.Add("@SoChungChiHoc", daotaolop.SoChungChiHoc  );
                dynamicParameters.Add("@Hinh", daotaolop.Hinh   );
                dynamicParameters.Add("@Stt", daotaolop.Stt    );

                dynamicParameters.Add("@CreateDate", daotaolop.CreateDate);
                dynamicParameters.Add("@CreateBy", daotaolop.CreateBy);
                dynamicParameters.Add("@UpdateDate", daotaolop.UpdateDate);
                dynamicParameters.Add("@UpdateBy", daotaolop.UpdateBy);

                dynamicParameters.Add("@parameters", parameters);

                try
                {
                    var query = await sqlConnection.QueryAsync<DaoTaoLopViewModel>(
                        "DaoTaoLopAUD", dynamicParameters, commandType: CommandType.StoredProcedure);

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
