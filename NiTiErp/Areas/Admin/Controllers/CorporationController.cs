using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using OfficeOpenXml;
using OfficeOpenXml.Table;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http.Headers;
using NiTiErp.Application.Interfaces;
using NiTiErp.Application.ViewModels.Corporation;
using NiTiErp.Utilities.Helpers;
using NiTiErp.Application.Dapper.Interfaces;
using NiTiErp.Extensions;
using Microsoft.AspNetCore.Authorization;
using NiTiErp.Authorization;
using NiTiErp.Utilities.Dtos;

namespace NiTiErp.Areas.Admin.Controllers
{    
    public class CorporationController : BaseController
    {
        
        private readonly NiTiErp.Application.Interfaces.IUserService _userService;
        private readonly IAuthorizationService _authorizationService;

        private Application.Interfaces.ICorporationService _corporationService;
        private readonly IHostingEnvironment _hostingEnvironment;

        private readonly Application.Dapper.Interfaces.ICorporationService _corporationsService;

        public CorporationController(NiTiErp.Application.Interfaces.IUserService userService,
            IAuthorizationService authorizationService,
            Application.Interfaces.ICorporationService corporationService,
            IHostingEnvironment hostingEnvironment,
            Application.Dapper.Interfaces.ICorporationService corporationsService
            )
        {
            _userService = userService;
            _authorizationService = authorizationService;
            _corporationService = corporationService;
            _hostingEnvironment = hostingEnvironment;

            _corporationsService = corporationsService;
        }

        public IActionResult Index()
        {
            return View();
        }

        #region AJAX API Dapper

        public IActionResult AddUpdateDMCT(Application.Dapper.ViewModels.CorporationViewModel corpoVm)
        {
            if (!ModelState.IsValid)
            {
                IEnumerable<ModelError> allErrors = ModelState.Values.SelectMany(v => v.Errors);
                return new BadRequestObjectResult(allErrors);
            }
            else
            {
                var username = User.GetSpecificClaim("UserName");

                corpoVm.UserIdCreated = username;
                corpoVm.DateCreated = DateTime.Now;
                corpoVm.UserIdModified = username;
                corpoVm.DateModified = DateTime.Now;

                if (corpoVm.InsertdmctId == "1")
                {
                    var result = _authorizationService.AuthorizeAsync(User, "DMXINGHIEP", Operations.Create); // nhap danh muc cong ty
                    if (result.Result.Succeeded == false)
                    {
                        return new ObjectResult(new GenericResult(false, "Bạn không đủ quyền thêm mới."));
                    }

                    var danhmuccongty = _corporationsService.CorporationAUD(corpoVm, "InCorporation");
                    return new OkObjectResult(danhmuccongty);
                }
                else
                {
                    var result = _authorizationService.AuthorizeAsync(User, "DMXINGHIEP", Operations.Update); // qd dieu dong
                    if (result.Result.Succeeded == false)
                    {
                        return new ObjectResult(new GenericResult(false, "Bạn không đủ quyền sửa."));
                    }

                    var danhmuccongty = _corporationsService.CorporationAUD(corpoVm, "UpCorporation");
                    return new OkObjectResult(danhmuccongty);
                }
            }
        }

        [HttpGet]
        public IActionResult GetAllCorPaging(string corporationId, string phongId, string keyword, int page,
            int pageSize, string hosoId)
        {
            var khuvuc = !string.IsNullOrEmpty(corporationId) ? corporationId : "%";
            var phong = !string.IsNullOrEmpty(phongId) ? phongId : "%";
            var tukhoa = !string.IsNullOrEmpty(keyword) ? keyword : "%";

            var model = _corporationsService.GetAllCorPaging(khuvuc, phong, tukhoa, page, pageSize,
                hosoId, "", "", "GetListCongTy");

            return new OkObjectResult(model);
        }

        #endregion

        #region AJAX API Enity
        [HttpGet]
        public IActionResult GetAll()
        {
            var model = _corporationService.GetAll();
            return new OkObjectResult(model);
        }

        [HttpGet]
        public IActionResult GetAllCorporations()
        {
            var model = _corporationService.GetAll();
            return new OkObjectResult(model);
        }

        [HttpGet]
        public IActionResult GetAllPaging(string keyword, int page, int pageSize)
        {
            var model = _corporationService.GetAllPaging(keyword, page, pageSize);
            return new OkObjectResult(model);
        }

        [HttpGet]
        public IActionResult GetById(string id)
        {
            var model = _corporationService.GetById(id);

            return new OkObjectResult(model);
        }

        [HttpPost]
        public IActionResult SaveEntity(CorporationViewModel corporationVm)
        {
            if (!ModelState.IsValid)
            {
                IEnumerable<ModelError> allErrors = ModelState.Values.SelectMany(v => v.Errors);
                return new BadRequestObjectResult(allErrors);
            }
            else
            {               
                if (corporationVm.Id == "0")
                {
                    corporationVm.DateCreated = DateTime.Now;
                    _corporationService.Add(corporationVm);
                }
                else
                {
                    _corporationService.Update(corporationVm);
                }
                _corporationService.Save();
                return new OkObjectResult(corporationVm);
            }
        }

        [HttpPost]
        public IActionResult Delete(string id)
        {
            if (!ModelState.IsValid)
            {
                return new BadRequestObjectResult(ModelState);
            }
            else
            {
                _corporationService.Delete(id);
                _corporationService.Save();

                return new OkObjectResult(id);
            }
        }

        #endregion

    }
}