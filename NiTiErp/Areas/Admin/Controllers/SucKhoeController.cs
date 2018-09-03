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
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Globalization;
using System.IO;
using System.Linq;

namespace NiTiErp.Areas.Admin.Controllers
{
    public class SucKhoeController : BaseController
    {
        private readonly IHostingEnvironment _hostingEnvironment;
        private readonly NiTiErp.Application.Interfaces.IUserService _userService;
        private readonly IAuthorizationService _authorizationService;

        private readonly IPhanLoaiSucKhoeService _phanloaisuckhoeService;
        private readonly ISucKhoeService _suckhoeService;

        public SucKhoeController(IHostingEnvironment hostingEnvironment,
            NiTiErp.Application.Interfaces.IUserService userService,
            IAuthorizationService authorizationService,

            IPhanLoaiSucKhoeService phanloaisuckhoeService,
            ISucKhoeService suckhoeService
            )
        {
            _hostingEnvironment = hostingEnvironment;
            _userService = userService;
            _authorizationService = authorizationService;

            _phanloaisuckhoeService = phanloaisuckhoeService;
            _suckhoeService = suckhoeService;
        }

        public IActionResult Index()
        {
            return View();
        }

        #region AJAX API

        public IActionResult AddUpdateSucKhoe(SucKhoeViewModel suckhoeVm)
        {
            if (!ModelState.IsValid)
            {
                IEnumerable<ModelError> allErrors = ModelState.Values.SelectMany(v => v.Errors);
                return new BadRequestObjectResult(allErrors);
            }
            else
            {
                var username = User.GetSpecificClaim("UserName");

                suckhoeVm.CreateBy = username;
                suckhoeVm.CreateDate = DateTime.Now;
                suckhoeVm.UpdateBy = username;
                suckhoeVm.UpdateDate = DateTime.Now;

                if (suckhoeVm.InsertUpdateSucKhoeId == 1)
                {
                    var result = _authorizationService.AuthorizeAsync(User, "SUCKHOENHAP", Operations.Create); // nhap suc khoe
                    if (result.Result.Succeeded == false)
                    {
                        return new ObjectResult(new GenericResult(false, "Bạn không đủ quyền thêm mới."));
                    }

                    var suckhoe = _suckhoeService.SucKhoeAUD(suckhoeVm, "InSucKhoe");
                    return new OkObjectResult(suckhoe);
                }
                else
                {
                    var result = _authorizationService.AuthorizeAsync(User, "SUCKHOENHAP", Operations.Update); // suc khoe
                    if (result.Result.Succeeded == false)
                    {
                        return new ObjectResult(new GenericResult(false, "Bạn không đủ quyền sửa."));
                    }

                    var suckhoe = _suckhoeService.SucKhoeAUD(suckhoeVm, "UpSucKhoe");
                    return new OkObjectResult(suckhoe);
                }
            }
        }

        [HttpGet]
        public IActionResult GetListSucKhoe(string namKham, string corporationId, string phongId, string keyword, int page, int pageSize)
        {
            var khuvuc = !string.IsNullOrEmpty(corporationId) ? corporationId : "%";
            var phong = !string.IsNullOrEmpty(phongId) ? phongId : "%";
            var tukhoa = !string.IsNullOrEmpty(keyword) ? keyword : "%";

            var model = _suckhoeService.GetAllSucKhoePaging(Convert.ToInt32(namKham), khuvuc, phong, tukhoa, page, pageSize, "", "", "", "GetAllSucKhoeNhanVien");

            return new OkObjectResult(model);
        }

        [HttpGet]
        public IActionResult GetSucKhoeId(string suckhoeId)
        {
            var model = _suckhoeService.GetAllSucKhoePaging(1, "", "", "", 1, 1000, "", "", suckhoeId, "GetAllSucKhoeId");

            return new OkObjectResult(model);
        }

        #region Danh mục

        [HttpGet]
        public IActionResult PhanLoaiSucKhoe()
        {
            var model = _phanloaisuckhoeService.PhanLoaiSucKhoeGetList("", "PO", "", "PhanLoaiSucKhoeGetList");
            return new OkObjectResult(model);
        }

        #endregion

        #endregion


    }
}