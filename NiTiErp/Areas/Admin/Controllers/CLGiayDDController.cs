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
using System.Threading.Tasks;

namespace NiTiErp.Areas.Admin.Controllers
{
    public class CLGiayDDController : BaseController
    {
        private readonly IHostingEnvironment _hostingEnvironment;
        private readonly NiTiErp.Application.Interfaces.IUserService _userService;
        private readonly IAuthorizationService _authorizationService;

        private readonly IGiayDiDuongService _giaydiduong;

        public CLGiayDDController(IHostingEnvironment hostingEnvironment,
            NiTiErp.Application.Interfaces.IUserService userService,
            IAuthorizationService authorizationService,
            IGiayDiDuongService giaydiduong
            )
        {
            _hostingEnvironment = hostingEnvironment;
            _userService = userService;
            _authorizationService = authorizationService;

            _giaydiduong = giaydiduong;
        }

        public IActionResult Index()
        {
            var username = User.GetSpecificClaim("UserName");
            var result = _authorizationService.AuthorizeAsync(User, "CONGLENHGIAYDD", Operations.Read);
            if (result.Result.Succeeded == false)
                return new RedirectResult("/homevanban/Index");

            return View();
        }

        #region API Ajax

        [HttpGet]
        public async Task<IActionResult> GetListCLGiayDD(string khuvucId, string maphongIc, 
            string keyword, int page, int pageSize)
        {
            var khuvuc = !string.IsNullOrEmpty(khuvucId) ? khuvucId : "%";
            var phong = !string.IsNullOrEmpty(maphongIc) ? maphongIc : "%";
            var tennv = !string.IsNullOrEmpty(keyword) ? keyword : "%";

            var model = await _giaydiduong.ListGiayDiDuongKVPhong(khuvucId, maphongIc, tennv, 
                page, pageSize);

            return new OkObjectResult(model);
        }

        [HttpGet]
        public async Task<IActionResult> GetCLGiayDD(long giaydiduongid)
        {            
            var model = await _giaydiduong.GetGiayDiDuong(giaydiduongid);

            return new OkObjectResult(model);
        }

        [HttpGet]
        public async Task<IActionResult> GetCodeCLGiayDD(Guid codegiaydiduong)
        {
            var model = await _giaydiduong.GetCodeGiayDD(codegiaydiduong);

            return new OkObjectResult(model);
        }

        [HttpPost]
        public async Task<IActionResult> SaveXML(string giaydiduongXML, string username2, Guid newguid)
        {
            if (!ModelState.IsValid)
            {
                IEnumerable<ModelError> allErrors = ModelState.Values.SelectMany(v => v.Errors);
                return new BadRequestObjectResult(allErrors);
            }
            else
            {
                var username = User.GetSpecificClaim("UserName");
                var codeGui = newguid;

                var productQuantities = await _giaydiduong.SaveXML(giaydiduongXML, codeGui, username);

                return new OkObjectResult(productQuantities);                
            }
        }
       

        #endregion

    }
}