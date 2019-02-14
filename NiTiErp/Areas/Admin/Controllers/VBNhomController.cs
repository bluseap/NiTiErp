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
    public class VBNhomController : BaseController
    {
        private readonly IHostingEnvironment _hostingEnvironment;
        private readonly NiTiErp.Application.Interfaces.IUserService _userService;
        private readonly IAuthorizationService _authorizationService;

        private readonly IVanBanNhomXuLyService _vanbannhomxulyService;

        public VBNhomController(IHostingEnvironment hostingEnvironment,
            NiTiErp.Application.Interfaces.IUserService userService,
            IAuthorizationService authorizationService,

            IVanBanNhomXuLyService vanbannhomxulyService
            )
        {
            _hostingEnvironment = hostingEnvironment;
            _userService = userService;
            _authorizationService = authorizationService;

            _vanbannhomxulyService = vanbannhomxulyService;
        }

        public IActionResult Index()
        {
            return View();
        }

        #region AJAX API

        [HttpPost]
        public IActionResult AddUpdateVBNXL(VanBanNhomXuLyViewModel vanbannhomxulyVm)
        {
            if (!ModelState.IsValid)
            {
                IEnumerable<ModelError> allErrors = ModelState.Values.SelectMany(v => v.Errors);
                return new BadRequestObjectResult(allErrors);
            }
            else
            {
                var username = User.GetSpecificClaim("UserName");

                vanbannhomxulyVm.CreateBy = username;
                vanbannhomxulyVm.CreateDate = DateTime.Now;
                vanbannhomxulyVm.UpdateBy = username;
                vanbannhomxulyVm.UpdateDate = DateTime.Now;

                if (vanbannhomxulyVm.InsertVanBanNhomXuLyId == 1)
                {
                    var result = _authorizationService.AuthorizeAsync(User, "DANHMUCVANBANNHOM", Operations.Create); // nhap danh muc van ban nhom xu ly
                    if (result.Result.Succeeded == false)
                    {
                        return new ObjectResult(new GenericResult(false, "Bạn không đủ quyền thêm mới."));
                    }

                    var chiphi = _vanbannhomxulyService.VanBanNhomXuLyAUD(vanbannhomxulyVm, "InVanBanNhomXuLy");
                    return new OkObjectResult(chiphi);
                }
                else
                {
                    var result = _authorizationService.AuthorizeAsync(User, "DANHMUCVANBANNHOM", Operations.Update); //  nhap danh muc van ban nhom xu ly
                    if (result.Result.Succeeded == false)
                    {
                        return new ObjectResult(new GenericResult(false, "Bạn không đủ quyền sửa."));
                    }

                    var chiphi = _vanbannhomxulyService.VanBanNhomXuLyAUD(vanbannhomxulyVm, "UpVanBanNhomXuLy");
                    return new OkObjectResult(chiphi);
                }
            }
        }

        [HttpGet]
        public IActionResult NhomLanhDaoDuyetGetList(int nhomid)
        {
            var hosonewguid = new Guid();

            var model = _vanbannhomxulyService.VanBanNhomXuLyGetList("", hosonewguid, "", nhomid
                , "", "GetAllVanBanNhomXuLyId");

            return new OkObjectResult(model);
        }

        [HttpGet]
        public IActionResult NhomLanhDaoKyGetList(string corporationId)
        {
            var hosonewguid = new Guid();

            var model = _vanbannhomxulyService.VanBanNhomXuLyGetList("", hosonewguid, "", 1
                , corporationId, "GetAllNhomXuLyLDKVB");

            return new OkObjectResult(model);
        }
        #endregion


    }
}