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
    public class ChiPhiDmController : BaseController
    {
        private readonly IHostingEnvironment _hostingEnvironment;
        private readonly NiTiErp.Application.Interfaces.IUserService _userService;
        private readonly IAuthorizationService _authorizationService;

        private readonly IChiPhiBangDanhMucService _chiphibangdanhmucService;
        private readonly IChiPhiLoaiService _chiphiloaiService;
        private readonly IChiPhiService _chiphiService;

        public ChiPhiDmController(IHostingEnvironment hostingEnvironment,
            NiTiErp.Application.Interfaces.IUserService userService,
            IAuthorizationService authorizationService,

            IChiPhiBangDanhMucService chiphibangdanhmucService,
            IChiPhiLoaiService chiphiloaiService,
            IChiPhiService chiphiService
            )
        {
            _hostingEnvironment = hostingEnvironment;
            _userService = userService;
            _authorizationService = authorizationService;

            _chiphibangdanhmucService = chiphibangdanhmucService;
            _chiphiloaiService = chiphiloaiService;
            _chiphiService = chiphiService;
        }

        public IActionResult Index()
        {
            return View();
        }

        #region AJAX API

        [HttpPost]
        public IActionResult AddUpdateChiPhi(ChiPhiViewModel chiphiVm)
        {
            if (!ModelState.IsValid)
            {
                IEnumerable<ModelError> allErrors = ModelState.Values.SelectMany(v => v.Errors);
                return new BadRequestObjectResult(allErrors);
            }
            else
            {
                var username = User.GetSpecificClaim("UserName");

                chiphiVm.CorporationId = "PO";

                chiphiVm.CreateBy = username;
                chiphiVm.CreateDate = DateTime.Now;
                chiphiVm.UpdateBy = username;
                chiphiVm.UpdateDate = DateTime.Now;

                if (chiphiVm.InsertChiPhiId == 1)
                {
                    var result = _authorizationService.AuthorizeAsync(User, "LUONGCHIPHIDM", Operations.Create); // nhap danh muc chi phi luong
                    if (result.Result.Succeeded == false)
                    {
                        return new ObjectResult(new GenericResult(false, "Bạn không đủ quyền thêm mới."));
                    }

                    var chiphi = _chiphiService.ChiPhiAUD(chiphiVm, "InChiPhi");
                    return new OkObjectResult(chiphi);
                }
                else
                {
                    var result = _authorizationService.AuthorizeAsync(User, "LUONGCHIPHIDM", Operations.Update); //  nhap danh muc chi phi luong
                    if (result.Result.Succeeded == false)
                    {
                        return new ObjectResult(new GenericResult(false, "Bạn không đủ quyền sửa."));
                    }

                    var chiphi = _chiphiService.ChiPhiAUD(chiphiVm, "UpChiPhi");
                    return new OkObjectResult(chiphi);
                }
            }
        }

        [HttpPost]
        public IActionResult DeleteChiPhi(ChiPhiViewModel chiphiVm)
        {
            if (!ModelState.IsValid)
            {
                IEnumerable<ModelError> allErrors = ModelState.Values.SelectMany(v => v.Errors);
                return new BadRequestObjectResult(allErrors);
            }
            else
            {
                if (chiphiVm.InsertChiPhiId == 3)
                {
                    var result = _authorizationService.AuthorizeAsync(User, "LUONGCHIPHIDM", Operations.Delete); // xoa 
                    if (result.Result.Succeeded == false)
                    {
                        return new ObjectResult(new GenericResult(false, "Bạn không đủ quyền xóa."));
                    }

                    chiphiVm.CreateDate = DateTime.Now;
                    chiphiVm.UpdateDate = DateTime.Now;

                    var chiphi = _chiphiService.ChiPhiAUD(chiphiVm, "DelChiPhi");

                    return new OkObjectResult(chiphi);
                }
                else
                {
                    return new OkObjectResult(chiphiVm);
                }
            }
        }

        [HttpGet]
        public IActionResult GetListChiPhi(string corporationId, string keyword, bool IsChiPhiTang, int page, int pageSize)
        {
            var khuvuc = !string.IsNullOrEmpty(corporationId) ? corporationId : "%";            
            var tukhoa = !string.IsNullOrEmpty(keyword) ? keyword : "%";

            var model = _chiphiService.GetAllChiPhiPaging(1, khuvuc, keyword, page, pageSize, IsChiPhiTang, 1, 1, "", "", "GetAllChiPhi");

            return new OkObjectResult(model);
        }

        [HttpGet]
        public IActionResult ListChiPhi(string corporationId, string keyword, bool IsChiPhiTang, int page, int pageSize)
        {
            var khuvuc = !string.IsNullOrEmpty(corporationId) ? corporationId : "%";
            var tukhoa = !string.IsNullOrEmpty(keyword) ? keyword : "%";

            var model = _chiphiService.ChiPhiGetList(1, khuvuc, keyword, page, pageSize, IsChiPhiTang, 1, 1, "", "", "GetAllChiPhi");

            return new OkObjectResult(model);
        }

        [HttpGet]
        public IActionResult GetKhenThuongId(int chiphiId)
        {
            var model = _chiphiService.GetAllChiPhiPaging(chiphiId, "", "", 1, 1000, false, 1, 1, "", "", "GetChiPhiId");

            return new OkObjectResult(model);
        }


        #region Danh muc

        [HttpGet]
        public IActionResult ChiPhiLoaiGetList()
        {
            var model = _chiphiloaiService.ChiPhiLoaiGetList("", "", "", "ChiPhiLoaiGetList");
            return new OkObjectResult(model);
        }

        [HttpGet]
        public IActionResult ChiPhiBangGetList()
        {
            var model = _chiphibangdanhmucService.ChiPhiBangDanhMucGetList("", "", "", "ChiPhiBangDanhMucGetList");
            return new OkObjectResult(model);
        }

        #endregion


        #endregion

    }
}