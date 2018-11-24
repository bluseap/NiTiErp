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
    public class ChiPhiController : BaseController
    {
        private readonly IHostingEnvironment _hostingEnvironment;
        private readonly NiTiErp.Application.Interfaces.IUserService _userService;
        private readonly IAuthorizationService _authorizationService;

        private readonly IChiPhiKhoiTaoService _chiphikhoitaoService;
        private readonly IDieuKienTimService _dieukientimService;

        private readonly Application.Dapper.Interfaces.ICorporationService _corporationsService;

        public ChiPhiController(IHostingEnvironment hostingEnvironment,
            NiTiErp.Application.Interfaces.IUserService userService,
            IAuthorizationService authorizationService,

            IChiPhiKhoiTaoService chiphikhoitaoService,
            IDieuKienTimService dieukientimService,

            Application.Dapper.Interfaces.ICorporationService corporationsService
            )
        {
            _hostingEnvironment = hostingEnvironment;
            _userService = userService;
            _authorizationService = authorizationService;

            _chiphikhoitaoService = chiphikhoitaoService;
            _dieukientimService = dieukientimService;

            _corporationsService = corporationsService;
        }

        public IActionResult Index()
        {
            return View();
        }

        #region AJAX API

        public IActionResult AddUpdateChiPhi(ChiPhiKhoiTaoViewModel chiphikhoitaoVm)
        {
            if (!ModelState.IsValid)
            {
                IEnumerable<ModelError> allErrors = ModelState.Values.SelectMany(v => v.Errors);
                return new BadRequestObjectResult(allErrors);
            }
            else
            {
                var username = User.GetSpecificClaim("UserName");

                chiphikhoitaoVm.CreateBy = username;
                chiphikhoitaoVm.CreateDate = DateTime.Now;
                chiphikhoitaoVm.UpdateBy = username;
                chiphikhoitaoVm.UpdateDate = DateTime.Now;

                if (chiphikhoitaoVm.InsertChiPhiKhoiTaoId == 1)
                {
                    var result = _authorizationService.AuthorizeAsync(User, "LUONGCHIPHI", Operations.Create); // nhap chi phi
                    if (result.Result.Succeeded == false)
                    {
                        return new ObjectResult(new GenericResult(false, "Bạn không đủ quyền thêm mới."));
                    }                   

                    var chiphikhoitao = _chiphikhoitaoService.ChiPhiKhoiTaoAUD(chiphikhoitaoVm, "InChiPhiKhoiTao");                   

                    return new OkObjectResult(chiphikhoitao);
                }
                else
                {
                    var result = _authorizationService.AuthorizeAsync(User, "LUONGCHIPHI", Operations.Update); // chi phi
                    if (result.Result.Succeeded == false)
                    {
                        return new ObjectResult(new GenericResult(false, "Bạn không đủ quyền sửa."));
                    }

                    var chiphikhoitao = _chiphikhoitaoService.ChiPhiKhoiTaoAUD(chiphikhoitaoVm, "UpChiPhiKhoiTao");                   

                    return new OkObjectResult(chiphikhoitao);
                }
            }
        }


        #region Danh mục chi phi luong

        [HttpGet]
        public IActionResult DieuKienGetList()
        {
            var model = _dieukientimService.DieuKienTimGetList("ChiPhi", "", "", "BangDieuKienTimGetList");
            return new OkObjectResult(model);
        }

        #endregion

        #endregion


    }
}