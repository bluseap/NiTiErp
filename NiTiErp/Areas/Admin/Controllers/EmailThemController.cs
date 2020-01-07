﻿using Microsoft.AspNetCore.Authorization;
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
using System.Threading.Tasks;

namespace NiTiErp.Areas.Admin.Controllers
{
    public class EmailThemController : BaseController
    {
        private readonly IHostingEnvironment _hostingEnvironment;
        private readonly NiTiErp.Application.Interfaces.IUserService _userService;
        private readonly IAuthorizationService _authorizationService;

        private readonly IEmailNoiBoNhanService _emailnoibonhanService;
        private readonly IEmailNoiBoNhanFileService _emailnoibonhanfileService;

        public EmailThemController(IHostingEnvironment hostingEnvironment,
            NiTiErp.Application.Interfaces.IUserService userService,
            IAuthorizationService authorizationService,
            IEmailNoiBoNhanService emailnoibonhanService,
            IEmailNoiBoNhanFileService emailnoibonhanfileService
            )
        {
            _hostingEnvironment = hostingEnvironment;
            _userService = userService;
            _authorizationService = authorizationService;

            _emailnoibonhanService = emailnoibonhanService;
            _emailnoibonhanfileService = emailnoibonhanfileService;
        }

        public IActionResult Index()
        {
            var username = User.GetSpecificClaim("UserName");
            var result = _authorizationService.AuthorizeAsync(User, "EMAILNOIBOTHEM", Operations.Read);
            if (result.Result.Succeeded == false)
                return new RedirectResult("/homevanban/Index");

            return View();            
        }

        #region AJAX API

        [HttpGet]
        public async Task<IActionResult> GetPagingByCodeNhanFile(Guid CodeEmailNoiBoNhanFile)
        {
            var model = await _emailnoibonhanfileService.GetPagingByCodeNhanFile(CodeEmailNoiBoNhanFile, 1, 100);
            return new OkObjectResult(model);
        }

        [HttpGet]
        public async Task<IActionResult> GetPagingNhan(Guid CodeEmailNoiBoNhanFile,  
            Guid hosonhanvienid)
        {
            var model = await _emailnoibonhanService.GetPaging(CodeEmailNoiBoNhanFile, hosonhanvienid, 1, 100);
            return new OkObjectResult(model);
        }

        [HttpPost]
        public IActionResult AddNguoiNhan(Guid CodeEmailNoiBoNhan, Guid NguoiNhan)
        {
            if (!ModelState.IsValid)
            {
                IEnumerable<ModelError> allErrors = ModelState.Values.SelectMany(v => v.Errors);
                return new BadRequestObjectResult(allErrors);
            }
            else
            {
                var username = User.GetSpecificClaim("UserName");               

                var result = _authorizationService.AuthorizeAsync(User, "EMAILNOIBOTHEM", Operations.Create); 
                if (result.Result.Succeeded == false)
                {
                    return new ObjectResult(new GenericResult(false, "Bạn không đủ quyền thêm mới."));
                }

                var emailnguoinhan = _emailnoibonhanService.AddEmailNguoiNhan(CodeEmailNoiBoNhan, 
                    NguoiNhan, DateTime.Now, username);
                return new OkObjectResult(emailnguoinhan);
            }
        }

        //[HttpPost]
        //public IActionResult AddEmailSentFile(EmailNoiBoNhanFileViewModel enbnfVm)
        //{
        //    if (!ModelState.IsValid)
        //    {
        //        IEnumerable<ModelError> allErrors = ModelState.Values.SelectMany(v => v.Errors);
        //        return new BadRequestObjectResult(allErrors);
        //    }
        //    else
        //    {
        //        var username = User.GetSpecificClaim("UserName");

        //        enbnfVm.CreateBy = username;
        //        enbnfVm.CreateDate = DateTime.Now;
        //        //enbnfVm.UpdateBy = username;
        //        //enbnfVm.UpdateDate = DateTime.Now;

        //        var result = _authorizationService.AuthorizeAsync(User, "EMAILNOIBOTHEM", Operations.Create); // nhap danh muc van ban phoi hop
        //        if (result.Result.Succeeded == false)
        //        {
        //            return new ObjectResult(new GenericResult(false, "Bạn không đủ quyền thêm mới."));
        //        }

        //        var emailnoiboFile = _emailnoibonhanfileService.AddEmailNhanFileByCodeNhanFile(enbnfVm);
        //        return new OkObjectResult(emailnoiboFile);

        //    }
        //}

        #endregion


    }
}