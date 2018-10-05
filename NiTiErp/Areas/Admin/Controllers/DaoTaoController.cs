using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using NiTiErp.Application.Dapper.Interfaces;
using NiTiErp.Application.Dapper.ViewModels;
using NiTiErp.Authorization;
using NiTiErp.Extensions;
using NiTiErp.Utilities.Dtos;
using OfficeOpenXml;
using OfficeOpenXml.Style;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Globalization;
using System.IO;
using System.Linq;

namespace NiTiErp.Areas.Admin.Controllers
{
    public class DaoTaoController : BaseController
    {
        private readonly IHostingEnvironment _hostingEnvironment;
        private readonly NiTiErp.Application.Interfaces.IUserService _userService;
        private readonly IAuthorizationService _authorizationService;

        private readonly IDaoTaoGiaoVienService _daotaogiaovienService;
        private readonly IDaoTaoNoiService _daotaonoiService;
        private readonly IDaoTaoLopService _daotaolopService;

        public DaoTaoController(IHostingEnvironment hostingEnvironment,
            NiTiErp.Application.Interfaces.IUserService userService,
            IAuthorizationService authorizationService,

            IDaoTaoGiaoVienService daotaogiaovienService,
            IDaoTaoNoiService daotaonoiService,
            IDaoTaoLopService daotaolopService
            )
        {
            _hostingEnvironment = hostingEnvironment;
            _userService = userService;
            _authorizationService = authorizationService;

            _daotaogiaovienService = daotaogiaovienService;
            _daotaonoiService = daotaonoiService;
            _daotaolopService = daotaolopService;
        }

        public IActionResult Index()
        {
            return View();
        }

        #region AJAX API

        public IActionResult AddUpdateDaoTao(DaoTaoLopViewModel daotaoVm)
        {
            if (!ModelState.IsValid)
            {
                IEnumerable<ModelError> allErrors = ModelState.Values.SelectMany(v => v.Errors);
                return new BadRequestObjectResult(allErrors);
            }
            else
            {
                var username = User.GetSpecificClaim("UserName");

                daotaoVm.CreateBy = username;
                daotaoVm.CreateDate = DateTime.Now;
                daotaoVm.UpdateBy = username;
                daotaoVm.UpdateDate = DateTime.Now;

                if (daotaoVm.InsUpDaoTaoLopId == 1)
                {
                    var result = _authorizationService.AuthorizeAsync(User, "DAOTAONHAP", Operations.Create); // nhap dao tao
                    if (result.Result.Succeeded == false)
                    {
                        return new ObjectResult(new GenericResult(false, "Bạn không đủ quyền thêm mới."));
                    }

                    daotaoVm.Id = Guid.NewGuid();

                    var daotao = _daotaolopService.DaoTaoLopAUD(daotaoVm, "InDaoTaoLop");

                    if (daotaoVm.DaoTaoGiaoVienList != null)
                        SaveDaoTaoGiaoVien(daotaoVm.DaoTaoNoiId, daotaoVm.DaoTaoGiaoVienList, daotaoVm.Id);
                    
                    return new OkObjectResult(daotao);
                }
                else
                {
                    var result = _authorizationService.AuthorizeAsync(User, "DAOTAONHAP", Operations.Update); // dao tao
                    if (result.Result.Succeeded == false)
                    {
                        return new ObjectResult(new GenericResult(false, "Bạn không đủ quyền sửa."));
                    }

                    var daotaonoi = _daotaolopService.DaoTaoLopAUD(daotaoVm, "UpDaoTaoLop");

                    if (daotaoVm.DaoTaoGiaoVienList != null)
                        UpdateDaoTaoGiaoVien(daotaoVm.DaoTaoNoiId, daotaoVm.DaoTaoGiaoVienList, daotaoVm.Id);

                    return new OkObjectResult(daotaonoi);
                }
            }
        }

        [HttpGet]
        public IActionResult GetListDaoTao(string daotaonoiId, string keyword, int page, int pageSize)
        {
            var guid = new Guid();

            var tukhoa = !string.IsNullOrEmpty(keyword) ? keyword : "%";

            var model = _daotaolopService.GetAllDaoTaoLopPaging(1, daotaonoiId, "", tukhoa, page, pageSize, guid, "", "GetListDaoTaoLop");

            return new OkObjectResult(model);
        }

        [HttpGet]
        public IActionResult GetDaoTaoId(Guid daotaolopId)
        {
            var model = _daotaolopService.GetAllDaoTaoLopPaging(1, "", "", "", 1, 1, daotaolopId, "", "GetDaoTaoLopId");

            return new OkObjectResult(model);
        }

        [HttpGet]
        public IActionResult GetNewGuid()
        {
            var newguid = Guid.NewGuid();

            return new OkObjectResult(newguid);
        }

        [HttpPost]
        public IActionResult DeleteDaoTao(DaoTaoLopViewModel daotaoVm)
        {
            if (!ModelState.IsValid)
            {
                IEnumerable<ModelError> allErrors = ModelState.Values.SelectMany(v => v.Errors);
                return new BadRequestObjectResult(allErrors);
            }
            else
            {
                if (daotaoVm.InsUpDaoTaoLopId == 3)
                {
                    var result = _authorizationService.AuthorizeAsync(User, "DAOTAONHAP", Operations.Delete); // xoa truong dao tao
                    if (result.Result.Succeeded == false)
                    {
                        return new ObjectResult(new GenericResult(false, "Bạn không đủ quyền xóa."));
                    }

                    daotaoVm.CreateDate = DateTime.Now;
                    daotaoVm.UpdateDate = DateTime.Now;

                    var daotao = _daotaolopService.DaoTaoLopAUD(daotaoVm, "DelDaoTaoLop");

                    return new OkObjectResult(daotao);
                }
                else
                {
                    return new OkObjectResult(daotaoVm);
                }
            }
        }

        [HttpPost]
        public IActionResult DeleteDaoTaoGiaoVien(DaoTaoGiaoVienViewModel daotaogiaovienVm)
        {
            if (!ModelState.IsValid)
            {
                IEnumerable<ModelError> allErrors = ModelState.Values.SelectMany(v => v.Errors);
                return new BadRequestObjectResult(allErrors);
            }
            else
            {                
                var result = _authorizationService.AuthorizeAsync(User, "DAOTAONHAP", Operations.Delete); // xoa truong dao tao
                if (result.Result.Succeeded == false)
                {
                    return new ObjectResult(new GenericResult(false, "Bạn không đủ quyền xóa."));
                }

                daotaogiaovienVm.CreateDate = DateTime.Now;
                daotaogiaovienVm.UpdateDate = DateTime.Now;

                var daotaogiaovien = _daotaogiaovienService.DaoTaoGiaoVienAUD(daotaogiaovienVm, "DelDaoTaoLopGiaoVien");

                return new OkObjectResult(daotaogiaovien);                
            }
        }

        [HttpPost]
        public IActionResult SaveDaoTaoGiaoVien(int DaoTaoNoiId, List<DaoTaoGiaoVienViewModel> daotaogiaovienList, Guid daotaoId )
        {
            AddDaoTaoGiaoVien(DaoTaoNoiId, daotaogiaovienList, daotaoId);          
            return new OkObjectResult(daotaogiaovienList);
        }

        public void AddDaoTaoGiaoVien(int DaoTaoNoiId, List<DaoTaoGiaoVienViewModel> daotaogiaovienList, Guid daotaoId)
        {
            var username = User.GetSpecificClaim("UserName");

            foreach (var giaovienlist in daotaogiaovienList)
            {
                giaovienlist.Id = Guid.NewGuid();
                giaovienlist.DaoTaoId = daotaoId;
                giaovienlist.DaoTaoNoiId = DaoTaoNoiId;

                giaovienlist.CreateBy = username;
                giaovienlist.CreateDate = DateTime.Now;
                giaovienlist.UpdateBy = username;
                giaovienlist.UpdateDate = DateTime.Now;

                var daotaogiaovien = _daotaogiaovienService.DaoTaoGiaoVienAUD(giaovienlist, "InDaoTaoGiaoVien");               
            }
        }

        [HttpPost]
        public IActionResult UpdateDaoTaoGiaoVien(int DaoTaoNoiId, List<DaoTaoGiaoVienViewModel> daotaogiaovienList, Guid daotaoId)
        {
            UpdateAddDaoTaoGiaoVien(DaoTaoNoiId, daotaogiaovienList, daotaoId);
            return new OkObjectResult(daotaogiaovienList);
        }

        public void UpdateAddDaoTaoGiaoVien(int DaoTaoNoiId, List<DaoTaoGiaoVienViewModel> daotaogiaovienList, Guid daotaoId)
        {
            var username = User.GetSpecificClaim("UserName");

            foreach (var giaovienlist in daotaogiaovienList)
            {
                if (giaovienlist.Id.ToString() == "00000000-0000-0000-0000-000000000000")
                {
                    giaovienlist.Id = Guid.NewGuid();
                    giaovienlist.DaoTaoId = daotaoId;
                    giaovienlist.DaoTaoNoiId = DaoTaoNoiId;

                    giaovienlist.CreateBy = username;
                    giaovienlist.CreateDate = DateTime.Now;
                    giaovienlist.UpdateBy = username;
                    giaovienlist.UpdateDate = DateTime.Now;

                    var daotaogiaovien = _daotaogiaovienService.DaoTaoGiaoVienAUD(giaovienlist, "InDaoTaoGiaoVien");
                }
                else
                {
                    giaovienlist.DaoTaoId = daotaoId;
                    giaovienlist.DaoTaoNoiId = DaoTaoNoiId;

                    giaovienlist.CreateBy = username;
                    giaovienlist.CreateDate = DateTime.Now;
                    giaovienlist.UpdateBy = username;
                    giaovienlist.UpdateDate = DateTime.Now;

                    var daotaogiaovien = _daotaogiaovienService.DaoTaoGiaoVienAUD(giaovienlist, "InDaoTaoGiaoVien");
                }
            }
        }

        [HttpGet]
        public IActionResult GetDaoTaoGiaoVienLopId(Guid daotaoId)
        {
            var moimoi = Guid.NewGuid();

            var model = _daotaogiaovienService.DaoTaoGiaoVienGetList(1, "", "", "", 1, 1000, moimoi, daotaoId, "GetDaoTaoGiaoVienLop");

            return new OkObjectResult(model);
        }

        [HttpGet]
        public IActionResult GetDaoTaoGiaoVienId(Guid daotaogiaovienId)
        {
            var model = _daotaogiaovienService.GetAllDaoTaoGiaoVienPaging(1, "", "", "", 1, 1000, daotaogiaovienId, daotaogiaovienId, "GetDaoTaoGiaoVienId");

            return new OkObjectResult(model);
        }

        #endregion

    }
}