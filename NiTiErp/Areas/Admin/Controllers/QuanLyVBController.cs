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
    public class QuanLyVBController : BaseController
    {


        private readonly IHostingEnvironment _hostingEnvironment;
        private readonly NiTiErp.Application.Interfaces.IUserService _userService;
        private readonly IAuthorizationService _authorizationService;

        private readonly IQuanLyVanBanService _quanlyvanbanService;

        public QuanLyVBController(IHostingEnvironment hostingEnvironment,
            NiTiErp.Application.Interfaces.IUserService userService,
            IAuthorizationService authorizationService,

           IQuanLyVanBanService quanlyvanbanService
            )
        {
            _hostingEnvironment = hostingEnvironment;
            _userService = userService;
            _authorizationService = authorizationService;

            _quanlyvanbanService = quanlyvanbanService;
        }

        public IActionResult Index()
        {
            var username = User.GetSpecificClaim("UserName");
            var result = _authorizationService.AuthorizeAsync(User, "DANHMUCVANBANQUANLY", Operations.Read);
            if (result.Result.Succeeded == false)
                return new RedirectResult("/homevanban/Index");

            return View();
        }

        #region AJAX API

        [HttpPost]
        public IActionResult AddUpdateQuanLyVB(QuanLyVanBanViewModel qlvbVm)
        {
            if (!ModelState.IsValid)
            {
                IEnumerable<ModelError> allErrors = ModelState.Values.SelectMany(v => v.Errors);
                return new BadRequestObjectResult(allErrors);
            }
            else
            {
                var username = User.GetSpecificClaim("UserName");

                qlvbVm.CreateBy = username;
                qlvbVm.CreateDate = DateTime.Now;
                qlvbVm.UpdateBy = username;
                qlvbVm.UpdateDate = DateTime.Now;

                qlvbVm.ThoiGianBatDau = DateTime.Now;
                qlvbVm.ThoiGianKetThuc = DateTime.Now;

                if (qlvbVm.InsertQuanLyVanBanId == 1)
                {
                    var result = _authorizationService.AuthorizeAsync(User, "DANHMUCVANBANQUANLY", Operations.Create); // nhap danh muc chi phi luong
                    if (result.Result.Succeeded == false)
                    {
                        return new ObjectResult(new GenericResult(false, "Bạn không đủ quyền thêm mới."));
                    }

                    var chiphi = _quanlyvanbanService.QuanLyVanBanAUD(qlvbVm, "InQuanLyVanBan");
                    return new OkObjectResult(chiphi);
                }
                else
                {
                    var result = _authorizationService.AuthorizeAsync(User, "DANHMUCVANBANQUANLY", Operations.Update); //  nhap danh muc chi phi luong
                    if (result.Result.Succeeded == false)
                    {
                        return new ObjectResult(new GenericResult(false, "Bạn không đủ quyền sửa."));
                    }

                    var chiphi = _quanlyvanbanService.QuanLyVanBanAUD(qlvbVm, "UpQuanLyVanBan");
                    return new OkObjectResult(chiphi);
                }
            }
        }

        [HttpPost]
        public IActionResult DeleteQuanLyVB(QuanLyVanBanViewModel quanlyvbVm)
        {
            if (!ModelState.IsValid)
            {
                IEnumerable<ModelError> allErrors = ModelState.Values.SelectMany(v => v.Errors);
                return new BadRequestObjectResult(allErrors);
            }
            else
            {
                if (quanlyvbVm.InsertQuanLyVanBanId == 3)
                {
                    var result = _authorizationService.AuthorizeAsync(User, "DANHMUCVANBANQUANLY", Operations.Delete); // xoa 
                    if (result.Result.Succeeded == false)
                    {
                        return new ObjectResult(new GenericResult(false, "Bạn không đủ quyền xóa."));
                    }

                    quanlyvbVm.CreateDate = DateTime.Now;
                    quanlyvbVm.UpdateDate = DateTime.Now;
                    quanlyvbVm.ThoiGianBatDau = DateTime.Now;
                    quanlyvbVm.ThoiGianKetThuc = DateTime.Now;

                    var quanlyvanban = _quanlyvanbanService.QuanLyVanBanAUD(quanlyvbVm, "DelQuanLyVanBan");

                    return new OkObjectResult(quanlyvanban);
                }
                else
                {
                    return new OkObjectResult(quanlyvbVm);
                }
            }
        }

        [HttpGet]
        public IActionResult GetQuanLyVBId(long quanlyvanbanId)
        {
            var ngayht = DateTime.Now;
            var namht = DateTime.Now.Year;
            var model = _quanlyvanbanService.QuanLyVanBanGetList("", namht, "",
                ngayht, ngayht, 0, 0, "", 1, 1000, quanlyvanbanId, "", "GetAllQuanLyVanBanId");

            return new OkObjectResult(model);
        }      

        [HttpGet]
        public IActionResult GetListQuanLyVBKV(string corporationId, string keyword, int page, int pageSize)
        {
            var ngayht = DateTime.Now;
            var namht = DateTime.Now.Year;
            var makhuvuc = !string.IsNullOrEmpty(corporationId) ? corporationId : "%";
            var tukhoa = !string.IsNullOrEmpty(keyword) ? keyword : "%";

            var model = _quanlyvanbanService.GetAllQuanLyVanBanPaging(makhuvuc, 0, "",
                ngayht, ngayht, 0, 0, tukhoa, page, pageSize, 0, "", "GetAllQuanLyVBKV");

            return new OkObjectResult(model);
        }

        #endregion

    }
}