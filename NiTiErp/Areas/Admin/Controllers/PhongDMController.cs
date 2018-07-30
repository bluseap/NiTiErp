using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using NiTiErp.Application.Dapper.Interfaces;
using NiTiErp.Application.Dapper.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using NiTiErp.Application.Dapper.Interfaces;
using NiTiErp.Application.Dapper.ViewModels;
using NiTiErp.Authorization;
using NiTiErp.Extensions;
using NiTiErp.Utilities.Dtos;
using NiTiErp.Utilities.Helpers;
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
    public class PhongDMController : BaseController
    {
        private readonly IHostingEnvironment _hostingEnvironment;
        private readonly NiTiErp.Application.Interfaces.IUserService _userService;
        private readonly IAuthorizationService _authorizationService;

        private readonly IPhongDanhMucService _phongdanhmucService;

        public PhongDMController(IHostingEnvironment hostingEnvironment,
            NiTiErp.Application.Interfaces.IUserService userService,
            IAuthorizationService authorizationService,
            
            IPhongDanhMucService phongdanhmucService
            )
        {
            _hostingEnvironment = hostingEnvironment;
            _userService = userService;
            _authorizationService = authorizationService;

            _phongdanhmucService = phongdanhmucService;
        }

        public IActionResult Index()
        {
            return View();
        }

        #region AJAX API

        public IActionResult AddUpdateDMPHONG(PhongDanhMucViewModel phongdmmVm)
        {
            if (!ModelState.IsValid)
            {
                IEnumerable<ModelError> allErrors = ModelState.Values.SelectMany(v => v.Errors);
                return new BadRequestObjectResult(allErrors);
            }
            else
            {
                var username = User.GetSpecificClaim("UserName");

                phongdmmVm.CreateBy = username;
                phongdmmVm.CreateDate = DateTime.Now;
                phongdmmVm.UpdareBy = username;
                phongdmmVm.UpdateDate = DateTime.Now;

                if (phongdmmVm.InsertphongdmId == 1)
                {
                    var result = _authorizationService.AuthorizeAsync(User, "DMPHONG", Operations.Create); // nhap danh muc phong
                    if (result.Result.Succeeded == false)
                    {
                        return new ObjectResult(new GenericResult(false, "Bạn không đủ quyền thêm mới."));
                    }

                    var phongdm = _phongdanhmucService.PhongDMAUD(phongdmmVm, "InPhongDanhMuc");
                    return new OkObjectResult(phongdm);
                }
                else
                {
                    var result = _authorizationService.AuthorizeAsync(User, "DMPHONG", Operations.Update); // 
                    if (result.Result.Succeeded == false)
                    {
                        return new ObjectResult(new GenericResult(false, "Bạn không đủ quyền sửa."));
                    }

                    var phongdm = _phongdanhmucService.PhongDMAUD(phongdmmVm, "UpPhongDanhMuc");
                    return new OkObjectResult(phongdm);
                }
            }
        }

        [HttpGet]
        public IActionResult GetAllPhongPaging(string corporationId, string phongId, string keyword, int page,
            int pageSize, string hosoId)
        {
            var khuvuc = !string.IsNullOrEmpty(corporationId) ? corporationId : "%";
            var phong = !string.IsNullOrEmpty(phongId) ? phongId : "%";
            var tukhoa = !string.IsNullOrEmpty(keyword) ? keyword : "%";

            var model = _phongdanhmucService.GetAllPhongPaging(khuvuc, phong, tukhoa, page, pageSize,
                hosoId, "", "", "GetListPhongMaKV");

            return new OkObjectResult(model);
        }

        [HttpGet]
        public IActionResult GetPhongdmId(string phongId)
        {
            var model = _phongdanhmucService.GetAllPhongPaging("", phongId, "", 1, 10,
                "", "", "", "GetPhongId");

            return new OkObjectResult(model);
        }

        #endregion

    }
}