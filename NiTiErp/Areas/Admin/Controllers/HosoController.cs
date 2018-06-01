using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

using NiTiErp.Authorization;
using NiTiErp.Extensions;
using NiTiErp.Application.Dapper;
using NiTiErp.Application.Dapper.Interfaces;

namespace NiTiErp.Areas.Admin.Controllers
{
    public class HosoController : BaseController
    {
        IPhongDanhMucService _phongdanhmucService;
        ICorporationService _corporationService;

        public HosoController(ICorporationService corporationService, IPhongDanhMucService phongdanhmucService)
        {
            _phongdanhmucService = phongdanhmucService;
            _corporationService = corporationService;
        }

        public IActionResult Index()
        {
            return View();
        }

        #region AJAX API

        [HttpGet]
        public IActionResult GetListCorNhanSu()
        {
            //var email = User.GetSpecificClaim("Email");
            //var id = User.GetSpecificClaim("UserId");
            //var username = User.GetSpecificClaim("UserName");
            var corporationId = User.GetSpecificClaim("CorporationId");

            if (corporationId != "PO")
            {
                // corporationServiceId = NT006 : Nhan su - Tien luong
                var model = _corporationService.CorporationGetList(corporationId, "", "", "GetListCorporation");
                return new OkObjectResult(model);
            }
            else
            {
                // corporationServiceId = NT006 : Nhan su - Tien luong
                var model = _corporationService.CorporationGetList("NT006", "", "", "GetListCorNhanSu");
                return new OkObjectResult(model);
            }
        }

        [HttpGet]
        public IActionResult GetListPhongKhuVuc(string makv)
        {            
            var model = _phongdanhmucService.PhongDanhMucGetList(makv, "", "", "GetListPhongMaKV");
            return new OkObjectResult(model);
        }

        #endregion

    }
}