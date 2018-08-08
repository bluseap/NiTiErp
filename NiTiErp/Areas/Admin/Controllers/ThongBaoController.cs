using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using NiTiErp.Application.Dapper.Interfaces;
using NiTiErp.Application.Dapper.ViewModels;
using NiTiErp.Authorization;
using NiTiErp.Extensions;
using NiTiErp.Utilities.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;

namespace NiTiErp.Areas.Admin.Controllers
{
    public class ThongBaoController : BaseController
    {
        private readonly IHostingEnvironment _hostingEnvironment;
        private readonly NiTiErp.Application.Interfaces.IUserService _userService;
        private readonly IAuthorizationService _authorizationService;
       
        private readonly IThongBaoService _thongbaoService;

        public ThongBaoController(IHostingEnvironment hostingEnvironment,
            NiTiErp.Application.Interfaces.IUserService userService,
            IAuthorizationService authorizationService,

            IThongBaoService thongbaoService
            )
        {
            _hostingEnvironment = hostingEnvironment;
            _userService = userService;
            _authorizationService = authorizationService;

            _thongbaoService = thongbaoService;           
        }

        public IActionResult Index()
        {
            return View();
        }

        #region AJAX API

        public IActionResult AddUpdateThongBao(ThongBaoViewModel thongbaoVm)
        {
            if (!ModelState.IsValid)
            {
                IEnumerable<ModelError> allErrors = ModelState.Values.SelectMany(v => v.Errors);
                return new BadRequestObjectResult(allErrors);
            }
            else
            {
                var username = User.GetSpecificClaim("UserName");

                thongbaoVm.NgayNhap = DateTime.Now;
                thongbaoVm.NoiDat = "HomeHRM";

                thongbaoVm.CreateBy = username;
                thongbaoVm.CreateDate = DateTime.Now;
                thongbaoVm.UpdateBy = username;
                thongbaoVm.UpdateDate = DateTime.Now;

                if (thongbaoVm.InsertThongbaoId == 1)
                {
                    var result = _authorizationService.AuthorizeAsync(User, "THONGBAONH", Operations.Create); // nhap thong bao
                    if (result.Result.Succeeded == false)
                    {
                        return new ObjectResult(new GenericResult(false, "Bạn không đủ quyền thêm mới."));
                    }

                    var thongbao = _thongbaoService.ThongBaoAUD(thongbaoVm, "InThongBao");
                    return new OkObjectResult(thongbao);
                }
                else
                {
                    var result = _authorizationService.AuthorizeAsync(User, "THONGBAONH", Operations.Update); //
                    if (result.Result.Succeeded == false)
                    {
                        return new ObjectResult(new GenericResult(false, "Bạn không đủ quyền sửa."));
                    }

                    var thongbao = _thongbaoService.ThongBaoAUD(thongbaoVm, "UpThongBao");
                    return new OkObjectResult(thongbao);
                }
            }
        }

        [HttpGet]
        public IActionResult GetListThongBaoPaging(string corporationId, string phongId, string keyword, int page, int pageSize, string hosoId)
        {
            var khuvuc = !string.IsNullOrEmpty(corporationId) ? corporationId : "%";
            var phong = !string.IsNullOrEmpty(phongId) ? phongId : "%";
            var tukhoa = !string.IsNullOrEmpty(keyword) ? keyword : "%";

            var model = _thongbaoService.GetAllThongBaoPaging(khuvuc, phong, tukhoa, page, pageSize,
                "", "", "", "", "HomeHRM", "GetListThongBaoTim");

            return new OkObjectResult(model);
        }

        [HttpGet]
        public IActionResult GetThongBaoId(string thongbaoId)
        {
            var model = _thongbaoService.GetAllThongBaoPaging("", "", "", 1, 10,
                "", "", "", thongbaoId, "HomeHRM", "GetThongBaoId");

            return new OkObjectResult(model);
        }

        #endregion

    }
}