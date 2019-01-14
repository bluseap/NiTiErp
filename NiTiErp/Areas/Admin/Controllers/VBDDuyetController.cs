using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.AspNetCore.SignalR;
using NiTiErp.Application.Dapper.Interfaces;
using NiTiErp.Application.Dapper.ViewModels;
using NiTiErp.Authorization;
using NiTiErp.Extensions;
using NiTiErp.Hubs;
using NiTiErp.Utilities.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;

namespace NiTiErp.Areas.Admin.Controllers
{
    public class VBDDuyetController : BaseController
    {
        private readonly IHostingEnvironment _hostingEnvironment;
        private readonly NiTiErp.Application.Interfaces.IUserService _userService;
        private readonly IAuthorizationService _authorizationService;

        private readonly IVanBanDenDuyetNVXLService _vanbandenduyetnvxlduyetService;
        private readonly IVanBanDenDuyetService _vanbandenduyetService;

        public VBDDuyetController(IHostingEnvironment hostingEnvironment,
            NiTiErp.Application.Interfaces.IUserService userService,
            IAuthorizationService authorizationService,

            IVanBanDenDuyetNVXLService vanbandenduyetnvxlduyetService,
            IVanBanDenDuyetService vanbandenduyetService
            )
        {
            _hostingEnvironment = hostingEnvironment;
            _userService = userService;
            _authorizationService = authorizationService;

            _vanbandenduyetnvxlduyetService = vanbandenduyetnvxlduyetService;
            _vanbandenduyetService = vanbandenduyetService;
        }

        public IActionResult Index()
        {
            return View();
        }

        #region AJAX API

        public IActionResult UpdateVanBanDenDuyet(VanBanDenDuyetViewModel vanbandenduyetVm)
        {
            if (!ModelState.IsValid)
            {
                IEnumerable<ModelError> allErrors = ModelState.Values.SelectMany(v => v.Errors);
                return new BadRequestObjectResult(allErrors);
            }
            else
            {
                var username = User.GetSpecificClaim("UserName");

                vanbandenduyetVm.CreateBy = username;
                vanbandenduyetVm.CreateDate = DateTime.Now;
                vanbandenduyetVm.UpdateBy = username;
                vanbandenduyetVm.UpdateDate = DateTime.Now;               

                if (vanbandenduyetVm.InsertVanBanDenDuyetId == 2)
                {
                    var result = _authorizationService.AuthorizeAsync(User, "VANBANDENDUYET", Operations.Create);
                    if (result.Result.Succeeded == false)
                    {
                        return new ObjectResult(new GenericResult(false, "Bạn không đủ quyền thêm mới."));
                    }

                    var vanbanden = _vanbandenduyetService.VanBanDenDuyetAUD(vanbandenduyetVm, "UpVanBanDenDuyet");

                    return new OkObjectResult(vanbanden);
                }
                else
                {                    
                    return new OkObjectResult(vanbandenduyetVm);
                }
            }
        }

        #region Nhan vien xu ly van ban den 

        public IActionResult InsertUpdateVBDDNVXL(VanBanDenDuyetNVXLViewModel vanbandenduyetnvxlVm)
        {
            if (!ModelState.IsValid)
            {
                IEnumerable<ModelError> allErrors = ModelState.Values.SelectMany(v => v.Errors);
                return new BadRequestObjectResult(allErrors);
            }
            else
            {
                var username = User.GetSpecificClaim("UserName");

                vanbandenduyetnvxlVm.CreateBy = username;
                vanbandenduyetnvxlVm.CreateDate = DateTime.Now;
                vanbandenduyetnvxlVm.UpdateBy = username;
                vanbandenduyetnvxlVm.UpdateDate = DateTime.Now;               

                if (vanbandenduyetnvxlVm.InsertVanBanDenDuyetNVXLId == 1)
                {
                    var result = _authorizationService.AuthorizeAsync(User, "VANBANDENDUYET", Operations.Create); 
                    if (result.Result.Succeeded == false)
                    {
                        return new ObjectResult(new GenericResult(false, "Bạn không đủ quyền thêm mới."));
                    }

                    var vanbanden = _vanbandenduyetnvxlduyetService.VanBanDenDuyetNVXLAUDList(vanbandenduyetnvxlVm, "InVBDDuyetNhanVienXL");

                    return new OkObjectResult(vanbanden);
                }
                else
                {                    
                    return new OkObjectResult(vanbandenduyetnvxlVm);
                }
            }
        }

        [HttpGet]
        public IActionResult GetListVBDDNVXL(long vanbandenduyetid)
        {            
            var newGuid = new Guid();

            var model = _vanbandenduyetnvxlduyetService.VBDDNVXLGetList(1, vanbandenduyetid, newGuid,
            1, DateTime.Now, "", 1, "", "GetAllVBDDNVXLVBDIdList");

            return new OkObjectResult(model);
        }

        #endregion


        #endregion



    }
}