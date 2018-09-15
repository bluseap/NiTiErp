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
    public class SucKhoenkController : BaseController
    {
        private readonly IHostingEnvironment _hostingEnvironment;
        private readonly NiTiErp.Application.Interfaces.IUserService _userService;
        private readonly IAuthorizationService _authorizationService;
       
        private readonly ISucKhoeNoiKhamService _suckhoenoikhamService;     

        public SucKhoenkController(IHostingEnvironment hostingEnvironment,
            NiTiErp.Application.Interfaces.IUserService userService,
            IAuthorizationService authorizationService,
           
            ISucKhoeNoiKhamService suckhoenoikhamService
            )
        {
            _hostingEnvironment = hostingEnvironment;
            _userService = userService;
            _authorizationService = authorizationService;

            _suckhoenoikhamService = suckhoenoikhamService;          
        }


        public IActionResult Index()
        {
            return View();
        }

        #region AJAX API

        public IActionResult AddUpdateSucKhoenk(SucKhoeNoiKhamViewModel suckhoeVm)
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

                if (suckhoeVm.InsertNoiKhamId == 1)
                {
                    var result = _authorizationService.AuthorizeAsync(User, "SUCKHOENK", Operations.Create); // nhap suc khoe
                    if (result.Result.Succeeded == false)
                    {
                        return new ObjectResult(new GenericResult(false, "Bạn không đủ quyền thêm mới."));
                    }

                    var suckhoe = _suckhoenoikhamService.SucKhoeNoiKhamAUD(suckhoeVm, "InSucKhoeNoiKham");
                    return new OkObjectResult(suckhoe);
                }
                else
                {
                    var result = _authorizationService.AuthorizeAsync(User, "SUCKHOENK", Operations.Update); // suc khoe
                    if (result.Result.Succeeded == false)
                    {
                        return new ObjectResult(new GenericResult(false, "Bạn không đủ quyền sửa."));
                    }

                    var suckhoe = _suckhoenoikhamService.SucKhoeNoiKhamAUD(suckhoeVm, "UpSucKhoeNoiKham");
                    return new OkObjectResult(suckhoe);
                }
            }
        }

        [HttpGet]
        public IActionResult GetListSucKhoenk(string keyword, int page, int pageSize)
        {            
            var tukhoa = !string.IsNullOrEmpty(keyword) ? keyword : "%";

            var model = _suckhoenoikhamService.GetAllSucKhoeNoiKhamPaging("", tukhoa,  page,  pageSize, "", "", 0, "GetListNoiKham");

            return new OkObjectResult(model);
        }

        [HttpGet]
        public IActionResult GetSucKhoenkId(string noikhamId)
        {
            var model = _suckhoenoikhamService.GetAllSucKhoeNoiKhamPaging(noikhamId, "", 1, 1000, "", "", 0, "GetNoiKhamId");

            return new OkObjectResult(model);
        }

        [HttpPost]
        public IActionResult DeleteSucKhoenk(SucKhoeNoiKhamViewModel suckhoeVm)
        {
            if (!ModelState.IsValid)
            {
                IEnumerable<ModelError> allErrors = ModelState.Values.SelectMany(v => v.Errors);
                return new BadRequestObjectResult(allErrors);
            }
            else
            {
                if (suckhoeVm.InsertNoiKhamId == 3)
                {
                    var result = _authorizationService.AuthorizeAsync(User, "SUCKHOENK", Operations.Delete); // xoa suc khoe nhan vien
                    if (result.Result.Succeeded == false)
                    {
                        return new ObjectResult(new GenericResult(false, "Bạn không đủ quyền xóa."));
                    }

                    suckhoeVm.CreateDate = DateTime.Now;
                    suckhoeVm.UpdateDate = DateTime.Now;

                    var suckhoe = _suckhoenoikhamService.SucKhoeNoiKhamAUD(suckhoeVm, "DelSucKhoeNoiKham");

                    return new OkObjectResult(suckhoe);
                }
                else
                {
                    return new OkObjectResult(suckhoeVm);
                }
            }
        }

        #endregion

    }
}