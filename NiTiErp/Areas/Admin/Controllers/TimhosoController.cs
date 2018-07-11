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

namespace NiTiErp.Areas.Admin.Controllers
{
    public class TimhosoController : BaseController
    {
        private readonly IHostingEnvironment _hostingEnvironment;
        private readonly NiTiErp.Application.Interfaces.IUserService _userService;
        private readonly IAuthorizationService _authorizationService;

        private IHoSoNhanVienService _hosonhanvienService;

        public TimhosoController(IHostingEnvironment hostingEnvironment,
            NiTiErp.Application.Interfaces.IUserService userService,
            IAuthorizationService authorizationService,

            IHoSoNhanVienService hosonhanvienService
            )
        {
            _hostingEnvironment = hostingEnvironment;
            _userService = userService;
            _authorizationService = authorizationService;

            _hosonhanvienService = hosonhanvienService;
        }

        public IActionResult Index()
        {
            return View();
        }


        //public async Task<IActionResult> Index()
        //{           

        //    var phong = "%";
        //    var tukhoa =  "%";

        //    var model = _hosonhanvienService.HoSoNhanVienGetList("PO", phong, tukhoa,
        //        "", "1", "", "GetAllHoSoNhanVien");

        //    return View(model.Result);
        //}

    }
}