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
    public class ChiPhiController : BaseController
    {
        private readonly IHostingEnvironment _hostingEnvironment;
        private readonly NiTiErp.Application.Interfaces.IUserService _userService;
        private readonly IAuthorizationService _authorizationService;

        private readonly IChiPhiLuongService _chiphiluongService;
        private readonly IChiPhiKhoiTaoService _chiphikhoitaoService;
        private readonly IDieuKienTimService _dieukientimService;

        private readonly Application.Dapper.Interfaces.ICorporationService _corporationsService;

        public ChiPhiController(IHostingEnvironment hostingEnvironment,
            NiTiErp.Application.Interfaces.IUserService userService,
            IAuthorizationService authorizationService,

            IChiPhiLuongService chiphiluongService,
            IChiPhiKhoiTaoService chiphikhoitaoService,
            IDieuKienTimService dieukientimService,

            Application.Dapper.Interfaces.ICorporationService corporationsService
            )
        {
            _hostingEnvironment = hostingEnvironment;
            _userService = userService;
            _authorizationService = authorizationService;

            _chiphiluongService = chiphiluongService;
            _chiphikhoitaoService = chiphikhoitaoService;
            _dieukientimService = dieukientimService;

            _corporationsService = corporationsService;
        }

        public IActionResult Index()
        {
            return View();
        }

        #region AJAX API

        public IActionResult AddUpdateChiPhi(ChiPhiKhoiTaoViewModel chiphikhoitaoVm)
        {
            if (!ModelState.IsValid)
            {
                IEnumerable<ModelError> allErrors = ModelState.Values.SelectMany(v => v.Errors);
                return new BadRequestObjectResult(allErrors);
            }
            else
            {
                var username = User.GetSpecificClaim("UserName");

                chiphikhoitaoVm.CreateBy = username;
                chiphikhoitaoVm.CreateDate = DateTime.Now;
                chiphikhoitaoVm.UpdateBy = username;
                chiphikhoitaoVm.UpdateDate = DateTime.Now;

                if (chiphikhoitaoVm.InsertChiPhiKhoiTaoId == 1)
                {
                    var result = _authorizationService.AuthorizeAsync(User, "LUONGCHIPHI", Operations.Create); // nhap chi phi
                    if (result.Result.Succeeded == false)
                    {
                        return new ObjectResult(new GenericResult(false, "Bạn không đủ quyền thêm mới."));
                    }                   

                    var chiphikhoitao = _chiphikhoitaoService.ChiPhiKhoiTaoAUD(chiphikhoitaoVm, "InChiPhiKhoiTao");                   

                    return new OkObjectResult(chiphikhoitao);
                }
                else
                {
                    var result = _authorizationService.AuthorizeAsync(User, "LUONGCHIPHI", Operations.Update); // chi phi
                    if (result.Result.Succeeded == false)
                    {
                        return new ObjectResult(new GenericResult(false, "Bạn không đủ quyền sửa."));
                    }

                    var chiphikhoitao = _chiphikhoitaoService.ChiPhiKhoiTaoAUD(chiphikhoitaoVm, "UpChiPhiKhoiTao");                   

                    return new OkObjectResult(chiphikhoitao);
                }
            }
        }

        [HttpGet]
        public IActionResult ChiPhiLuongGetList(int nam, int thang, string corporationId, string phongdanhmucId, string keyword, int chiphiid,
            bool IsChiPhiTang, int page, int pageSize)
        {
            var khuvuc = !string.IsNullOrEmpty(corporationId) ? corporationId : "%";
            var maphong = !string.IsNullOrEmpty(phongdanhmucId) ? phongdanhmucId : "%";
            var tukhoa = !string.IsNullOrEmpty(keyword) ? keyword : "%";

            var hosoId = new Guid();

            var model = _chiphiluongService.GetAllChiPhiLuongPaging(1, nam, thang, khuvuc, maphong, keyword, hosoId, chiphiid, 1, 1
                , IsChiPhiTang, 1, 1, true, "", page, pageSize, "LoaiChiPhiTangGiamGetList");

            return new OkObjectResult(model);
        }

        [HttpGet]
        public IActionResult ChiPhiKhoiTaGetList(int nam, int thang, string corporationId, string keyword, int page, int pageSize)
        {
            var khuvuc = !string.IsNullOrEmpty(corporationId) ? corporationId : "%";           
            var tukhoa = !string.IsNullOrEmpty(keyword) ? keyword : "%";

            var kynay = new DateTime(nam, thang, 1);

            var model = _chiphikhoitaoService.GetAllChiPhiKhoiTaoPaging(1, khuvuc, tukhoa, page, pageSize, 1, false,
                kynay, false, "", "ChiPhiKhoiTaoKyList");

            return new OkObjectResult(model);
        }

        [HttpGet]
        public IActionResult ChiPhiKhoiTaKyId(int chiphikhoitaoId, int nam, int thang, string corporationId, string keyword, int page, int pageSize)
        {
            var khuvuc = !string.IsNullOrEmpty(corporationId) ? corporationId : "%";
            var tukhoa = !string.IsNullOrEmpty(keyword) ? keyword : "%";

            var kynay = new DateTime(nam, thang, 1);

            var model = _chiphikhoitaoService.GetAllChiPhiKhoiTaoPaging(chiphikhoitaoId, khuvuc, tukhoa, 1, 100, 1, false,
                kynay, false, "", "GetChiPhiKhoiTaoKyId");

            return new OkObjectResult(model);
        }

        [HttpGet]
        public IActionResult ChiPhiKhoiTaKy(int chiphiId, int nam, int thang, string corporationId, string keyword, int page, int pageSize)
        {
            var khuvuc = !string.IsNullOrEmpty(corporationId) ? corporationId : "%";
            var tukhoa = !string.IsNullOrEmpty(keyword) ? keyword : "%";

            var kynay = new DateTime(nam, thang, 1);

            var model = _chiphikhoitaoService.GetAllChiPhiKhoiTaoPaging(1, khuvuc, tukhoa, 1, 100, chiphiId, false,
                kynay, false, "", "GetChiPhiKhoiTaoKy");

            return new OkObjectResult(model);
        }

        #region Danh mục chi phi luong

        [HttpGet]
        public IActionResult DieuKienGetList()
        {
            var model = _dieukientimService.DieuKienTimGetList("ChiPhi", "", "", "BangDieuKienTimGetList");
            return new OkObjectResult(model);
        }

        #endregion

        #endregion


    }
}