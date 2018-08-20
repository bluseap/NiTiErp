using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

using NiTiErp.Application.Dapper.Interfaces;
using NiTiErp.Application.Dapper.ViewModels;

using NiTiErp.Extensions;
using NiTiErp.Utilities.Constants;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Authorization;
using System;

namespace NiTiErp.Areas.Admin.Controllers
{
    public class TimhosoController : BaseController
    {
        private readonly IHostingEnvironment _hostingEnvironment;
        private readonly NiTiErp.Application.Interfaces.IUserService _userService;
        private readonly IAuthorizationService _authorizationService;

        private IHisQuyetDinhService _hisquyetdinhService;
        private IHoSoNhanVienService _hosonhanvienService;

        public TimhosoController(IHostingEnvironment hostingEnvironment,
            NiTiErp.Application.Interfaces.IUserService userService,
            IAuthorizationService authorizationService,

            IHisQuyetDinhService hisquyetdinhService,
            IHoSoNhanVienService hosonhanvienService
            )
        {
            _hostingEnvironment = hostingEnvironment;
            _userService = userService;
            _authorizationService = authorizationService;

            _hisquyetdinhService = hisquyetdinhService;
            _hosonhanvienService = hosonhanvienService;
        }

        public IActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public IActionResult HisQuyetDinhGetAll(string corporationId, string phongId, string keyword, string hosoId, int page, int pageSize)
        {
            var khuvuc = !string.IsNullOrEmpty(corporationId) ? corporationId : "%";
            var phong = !string.IsNullOrEmpty(phongId) ? phongId : "%";
            var tukhoa = !string.IsNullOrEmpty(keyword) ? keyword : "%";

            var model = _hisquyetdinhService.GetAllHisQuyetDinhPaging(khuvuc, phong, tukhoa, page, pageSize, hosoId, "", "",
                "", "", DateTime.Now, DateTime.Now, 1,
                "HisQuyetDinhTimHoSoId");

            return new OkObjectResult(model);
        }

        [HttpGet]
        public IActionResult HisQDCongViecGetAll(string corporationId, string phongId, string keyword, string hosoId, int page, int pageSize)
        {
            var khuvuc = !string.IsNullOrEmpty(corporationId) ? corporationId : "%";
            var phong = !string.IsNullOrEmpty(phongId) ? phongId : "%";
            var tukhoa = !string.IsNullOrEmpty(keyword) ? keyword : "%";

            var model = _hisquyetdinhService.GetAllHisQuyetDinhPaging(khuvuc, phong, tukhoa, page, pageSize, hosoId, "", "",
                "", "", DateTime.Now, DateTime.Now, 1,
                "HisQDCongViecTimHoSoId");

            return new OkObjectResult(model);
        }

    }
}