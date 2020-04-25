using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Newtonsoft.Json;
using NiTiErp.Application.Dapper.Interfaces;
using NiTiErp.Application.Dapper.ViewModels;
using NiTiErp.Extensions;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;

namespace NiTiErp.Areas.Admin.Controllers
{
    public class RegisterDocSendController : BaseController
    {
        private readonly IHostingEnvironment _hostingEnvironment;
        private readonly NiTiErp.Application.Interfaces.IUserService _userService;
        private readonly IAuthorizationService _authorizationService;

        private readonly IRegisterDocSendService _registerdocsendService;

        public RegisterDocSendController(IHostingEnvironment hostingEnvironment,
            NiTiErp.Application.Interfaces.IUserService userService,
            IAuthorizationService authorizationService,

            IRegisterDocSendService registerdocsendService
            )
        {
            _hostingEnvironment = hostingEnvironment;
            _userService = userService;
            _authorizationService = authorizationService;

            _registerdocsendService = registerdocsendService;
        }

        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]       
        public async Task<IActionResult> CreateSend(long vanbandenduyetId, string firebasenotifiId)
        {
            if (!ModelState.IsValid)
            {
                IEnumerable<ModelError> allErrors = ModelState.Values.SelectMany(v => v.Errors);
                return new BadRequestObjectResult(allErrors);
            }
            else
            {
                var username = User.GetSpecificClaim("UserName");                 

                var registerdocsend = await _registerdocsendService.CreateRegisterDocSendVBDDId(vanbandenduyetId, firebasenotifiId, username);

                return new OkObjectResult(registerdocsend);
            }
        }

    }
}