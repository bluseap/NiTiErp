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
    public class DaoTaoNoiController : BaseController
    {
        private readonly IHostingEnvironment _hostingEnvironment;
        private readonly NiTiErp.Application.Interfaces.IUserService _userService;
        private readonly IAuthorizationService _authorizationService;

        private readonly IDaoTaoNoiService _daotaonoiService;

        public DaoTaoNoiController(IHostingEnvironment hostingEnvironment,
            NiTiErp.Application.Interfaces.IUserService userService,
            IAuthorizationService authorizationService,

            IDaoTaoNoiService daotaonoiService
            )
        {
            _hostingEnvironment = hostingEnvironment;
            _userService = userService;
            _authorizationService = authorizationService;

            _daotaonoiService = daotaonoiService;
        }

        public IActionResult Index()
        {
            return View();
        }

        #region AJAX API

        public IActionResult AddUpdateDaoTaoNoi(DaoTaoNoiViewModel daotaonoiVm)
        {
            if (!ModelState.IsValid)
            {
                IEnumerable<ModelError> allErrors = ModelState.Values.SelectMany(v => v.Errors);
                return new BadRequestObjectResult(allErrors);
            }
            else
            {
                var username = User.GetSpecificClaim("UserName");

                daotaonoiVm.CreateBy = username;
                daotaonoiVm.CreateDate = DateTime.Now;
                daotaonoiVm.UpdateBy = username;
                daotaonoiVm.UpdateDate = DateTime.Now;

                if (daotaonoiVm.InsertDaoTaoNoiId == 1)
                {
                    var result = _authorizationService.AuthorizeAsync(User, "DAOTAONOI", Operations.Create); // nhap dao tao
                    if (result.Result.Succeeded == false)
                    {
                        return new ObjectResult(new GenericResult(false, "Bạn không đủ quyền thêm mới."));
                    }

                    var daotaonoi = _daotaonoiService.DaoTaoNoiAUD(daotaonoiVm, "InDaoTaoNoi");
                    return new OkObjectResult(daotaonoi);
                }
                else
                {
                    var result = _authorizationService.AuthorizeAsync(User, "DAOTAONOI", Operations.Update); // dao tao
                    if (result.Result.Succeeded == false)
                    {
                        return new ObjectResult(new GenericResult(false, "Bạn không đủ quyền sửa."));
                    }

                    var daotaonoi = _daotaonoiService.DaoTaoNoiAUD(daotaonoiVm, "UpDaoTaoNoi");
                    return new OkObjectResult(daotaonoi);
                }
            }
        }

        [HttpGet]
        public IActionResult GetListDaoTaoNoi(string keyword, int page, int pageSize)
        {
            var tukhoa = !string.IsNullOrEmpty(keyword) ? keyword : "%";

            var model = _daotaonoiService.GetAllDaoTaoNoiPaging(1, tukhoa, page, pageSize, "", 0, "GetListDaoTaoNoi");

            return new OkObjectResult(model);
        }

        [HttpGet]
        public IActionResult GetDaoTaoNoiId(string daotaonoiId)
        {
            var model = _daotaonoiService.GetAllDaoTaoNoiPaging(Convert.ToInt32(daotaonoiId), "", 1, 1000, "", 0, "GetDaoTaoNoiId");

            return new OkObjectResult(model);
        }

        [HttpPost]
        public IActionResult DeleteDaoTaoNoi(DaoTaoNoiViewModel daotaoVm)
        {
            if (!ModelState.IsValid)
            {
                IEnumerable<ModelError> allErrors = ModelState.Values.SelectMany(v => v.Errors);
                return new BadRequestObjectResult(allErrors);
            }
            else
            {
                if (daotaoVm.InsertDaoTaoNoiId == 3)
                {
                    var result = _authorizationService.AuthorizeAsync(User, "DAOTAONOI", Operations.Delete); // xoa truong dao tao
                    if (result.Result.Succeeded == false)
                    {
                        return new ObjectResult(new GenericResult(false, "Bạn không đủ quyền xóa."));
                    }

                    daotaoVm.CreateDate = DateTime.Now;
                    daotaoVm.UpdateDate = DateTime.Now;

                    var daotao = _daotaonoiService.DaoTaoNoiAUD(daotaoVm, "DelDaoTaoNoi");

                    return new OkObjectResult(daotao);
                }
                else
                {
                    return new OkObjectResult(daotaoVm);
                }
            }
        }

        #endregion



    }
}