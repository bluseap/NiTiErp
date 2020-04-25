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
    public class KhoiTaoController : BaseController
    {
        private readonly IHostingEnvironment _hostingEnvironment;
        private readonly NiTiErp.Application.Interfaces.IUserService _userService;
        private readonly IAuthorizationService _authorizationService;

        private readonly ILockLuongDotInService _lockluongdotinService;

        private readonly Application.Dapper.Interfaces.ICorporationService _corporationsService;

        public KhoiTaoController(IHostingEnvironment hostingEnvironment,
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

        public IActionResult KhoiTaoKyLuong(LockLuongDotInViewModel lockluongVm)
        {
            if (!ModelState.IsValid)
            {
                IEnumerable<ModelError> allErrors = ModelState.Values.SelectMany(v => v.Errors);
                return new BadRequestObjectResult(allErrors);
            }
            else
            {
                var username = User.GetSpecificClaim("UserName");

                lockluongVm.CreateBy = username;
                lockluongVm.CreateDate = DateTime.Now;
                lockluongVm.UpdateBy = username;
                lockluongVm.UpdateDate = DateTime.Now;

                if (lockluongVm.InsertLockLuongDotInId == 1)
                {
                    var result = _authorizationService.AuthorizeAsync(User, "LUONGLOCK", Operations.Create); // nhap khoa so luong LockLuongOotIn
                    if (result.Result.Succeeded == false)
                    {
                        return new ObjectResult(new GenericResult(false, "Bạn không đủ quyền thêm mới."));
                    }

                    var lockluong = _lockluongdotinService.LockLuongDotInKhoiTao(lockluongVm, "KhoiTaoKyLuong");
                    return new OkObjectResult(lockluong);
                }
                else
                {
                    return new OkObjectResult(lockluongVm);
                }

            }
        }

        #endregion

    }
}