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
    public class KhoaSoController : BaseController
    {

        private readonly IHostingEnvironment _hostingEnvironment;
        private readonly NiTiErp.Application.Interfaces.IUserService _userService;
        private readonly IAuthorizationService _authorizationService;
       
        private readonly ILockLuongDotInService _lockluongdotinService;

        private readonly Application.Dapper.Interfaces.ICorporationService _corporationsService;

        public KhoaSoController(IHostingEnvironment hostingEnvironment,
            NiTiErp.Application.Interfaces.IUserService userService,
            IAuthorizationService authorizationService,


            ILockLuongDotInService lockluongdotinService,
            Application.Dapper.Interfaces.ICorporationService corporationsService
            )
        {
            _hostingEnvironment = hostingEnvironment;
            _userService = userService;
            _authorizationService = authorizationService;


            _lockluongdotinService = lockluongdotinService;

            _corporationsService = corporationsService;
        }

        public IActionResult Index()
        {
            return View();
        }

        #region ajax API

        public IActionResult KhoaSoGetList(string corporationId, string dotinId, DateTime lockDate, string keyword, int page,  int pageSize)
        {
            var khuvuc = !string.IsNullOrEmpty(corporationId) ? corporationId : "%";
            var dotinid = !string.IsNullOrEmpty(dotinId) ? dotinId : "%";
            var tukhoa = !string.IsNullOrEmpty(keyword) ? keyword : "%";

            var model = _lockluongdotinService.LockLuongDotInGetList(1, khuvuc, dotinid, lockDate, true, true, tukhoa, "LuongDotInKVGetList");

            return new OkObjectResult(model);
        }

        [HttpGet]
        public IActionResult GetLockLuongKyId(string makhuvuc, int thang, int nam, string dotinluongid)
        {
            var kylock = new DateTime(nam, thang, 1);

            var model = _lockluongdotinService.LockLuongDotInGetList(1, makhuvuc, dotinluongid, kylock, true, true, "",
                "LuongDotInGetId");
            return new OkObjectResult(model);
        }

        [HttpGet]
        public IActionResult GetLockLuongId(int loclluongId)
        {
            var model = _lockluongdotinService.LockLuongDotInGetList(loclluongId, "", "", DateTime.Now, true, true, "",
                "LuongDotInGetId");
            return new OkObjectResult(model);
        }

        [HttpPost]
        public IActionResult DeleteLockLuong(LockLuongDotInViewModel lockluongdotinVm)
        {
            if (!ModelState.IsValid)
            {
                IEnumerable<ModelError> allErrors = ModelState.Values.SelectMany(v => v.Errors);
                return new BadRequestObjectResult(allErrors);
            }
            else
            {
                if (lockluongdotinVm.InsertLockLuongDotInId == 3)
                {
                    var result = _authorizationService.AuthorizeAsync(User, "LUONGLOCK", Operations.Delete); // xoa khoa so luong thang
                    if (result.Result.Succeeded == false)
                    {
                        return new ObjectResult(new GenericResult(false, "Bạn không đủ quyền xóa."));
                    }

                    lockluongdotinVm.CreateDate = DateTime.Now;
                    lockluongdotinVm.UpdateDate = DateTime.Now;

                    var lockluongdotin = _lockluongdotinService.LockLuongDotInAUD(lockluongdotinVm, "DelLockDotIn");

                    return new OkObjectResult(lockluongdotin);
                }
                else
                {
                    return new OkObjectResult(lockluongdotinVm);
                }
            }
        }

        #endregion



    }
}