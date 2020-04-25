using Dapper;
using Microsoft.Extensions.Configuration;
using NiTiErp.Application.Dapper.Interfaces;
using NiTiErp.Application.Dapper.ViewModels;
using NiTiErp.Utilities.Dtos;
using System;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;

namespace NiTiErp.Application.Dapper.Implementation
{
    public class ThongBaoService : IThongBaoService
    {
        private readonly IConfiguration _configuration;

        public ThongBaoService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task<Boolean> ThongBaoAUD(ThongBaoViewModel thongbao, string parameters)
        {
            using (var sqlConnection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                await sqlConnection.OpenAsync();
                var dynamicParameters = new DynamicParameters();

                dynamicParameters.Add("@Id", thongbao.Id);

                dynamicParameters.Add("@CorporationId", thongbao.CorporationId);
                dynamicParameters.Add("@TieuDe", thongbao.TieuDe);
                dynamicParameters.Add("@NoiDung", thongbao.NoiDung);
                dynamicParameters.Add("@NgayNhap", thongbao.NgayNhap);
                dynamicParameters.Add("@CorporationSentId", thongbao.CorporationSentId);
                dynamicParameters.Add("@NoiDat", thongbao.NoiDat);
                dynamicParameters.Add("@UploadFile1", thongbao.UploadFile1);
                dynamicParameters.Add("@UploadFile2", thongbao.UploadFile2);
                dynamicParameters.Add("@UploadFile3", thongbao.UploadFile3);

                dynamicParameters.Add("@CreateDate", thongbao.CreateDate);
                dynamicParameters.Add("@CreateBy", thongbao.CreateBy);
                dynamicParameters.Add("@UpdateDate", thongbao.UpdateDate);
                dynamicParameters.Add("@UpdateBy", thongbao.UpdateBy);

                dynamicParameters.Add("@parameters", parameters);
                try
                {
                    var query = await sqlConnection.QueryAsync<ThongBaoViewModel>(
                        "ThongBaoAUD", dynamicParameters, commandType: CommandType.StoredProcedure);

                    return true;
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }

        public async Task<PagedResult<ThongBaoViewModel>> GetAllThongBaoPaging(string corporationId, string phongId, string keyword, int page, int pageSize,
            string hosoId, string hosoId2, string hosoId3, string thongbaoId, string noidat, string parameters)
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
                dynamicParameters.Add("@thongbaoId", thongbaoId);
                dynamicParameters.Add("@noidat", noidat);

                dynamicParameters.Add("@parameters", parameters);
                try
                {
                    var thongbao = await sqlConnection.QueryAsync<ThongBaoViewModel>(
                        "ThongBaoGetList", dynamicParameters, commandType: CommandType.StoredProcedure);

                    var query = thongbao.AsQueryable();

                    int totalRow = query.Count();

                    query = query.OrderByDescending(x => x.CreateDate)
                        .Skip((page - 1) * pageSize).Take(pageSize);

                    var data = query.ToList();

                    var paginationSet = new PagedResult<ThongBaoViewModel>()
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

        //public async Task<List<ThongBaoViewModel>> ThongBaoGetList(string bangId, string id2, string id3, string parameters)
        //{
        //    using (var sqlConnection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
        //    {
        //        await sqlConnection.OpenAsync();
        //        var dynamicParameters = new DynamicParameters();

        //        dynamicParameters.Add("@bangId", bangId);
        //        dynamicParameters.Add("@id2", id2);
        //        dynamicParameters.Add("@id3", id3);
        //        dynamicParameters.Add("@parameters", parameters);

        //        try
        //        {
        //            var query = await sqlConnection.QueryAsync<ThongBaoViewModel>(
        //                "BangDanhMucGetList", dynamicParameters, commandType: CommandType.StoredProcedure);

        //            return query.AsList();
        //        }
        //        catch (Exception ex)
        //        {
        //            throw ex;
        //        }
        //    }
        //}
    }
}