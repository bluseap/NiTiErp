using Microsoft.AspNetCore.Authorization;
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

        private readonly IEmailNoiBoService _emailnoiboService;
        private readonly IEmailNoiBoNhanService _emailnoibonhanService;
        private readonly IEmailNoiBoNhanFileService _emailnoibonhanfileService;

        public EmailThemController(IHostingEnvironment hostingEnvironment,
            NiTiErp.Application.Interfaces.IUserService userService,
            IAuthorizationService authorizationService,
            IEmailNoiBoService emailnoiboService,
            IEmailNoiBoNhanService emailnoibonhanService,
            IEmailNoiBoNhanFileService emailnoibonhanfileService
            )
        {
            _hostingEnvironment = hostingEnvironment;
            _userService = userService;
            _authorizationService = authorizationService;

            _emailnoiboService = emailnoiboService;
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

        [HttpGet]
        public async Task<IActionResult> GetListEmailThem(string NguoiNhan, int page, int pageSize)           
        {
            var model = await _emailnoiboService.GetPagingNhan(NguoiNhan, page, pageSize);
            return new OkObjectResult(model);
        }

        [HttpGet]
        public async Task<IActionResult> GetEmailThem(long emailnoibonhanId)
        {
            var model = await _emailnoiboService.GetByEmailNoiBoNhan(emailnoibonhanId);
            return new OkObjectResult(model);
        }

        [HttpGet]
        public async Task<IActionResult> GetListEmailFile(long emailnoibonhanId)
        {
            var model = await _emailnoibonhanfileService.GetListEmailFileNoiBoNhanId(emailnoibonhanId);
            return new OkObjectResult(model);
        }

        [HttpGet]
        public async Task<IActionResult> GetEmailFileId(long emailnoibonhanfileId)
        {
            var model = await _emailnoibonhanfileService.GetEmailFileId(emailnoibonhanfileId);
            return new OkObjectResult(model);
        }

        [HttpGet]
        public IActionResult GetEmailCount(string nguoinhan)
        {
            var countEmail = _emailnoibonhanService.GetEmailCountByNguoiNhan(nguoinhan);
            return new OkObjectResult(countEmail);
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

        [HttpPost]
        public IActionResult SentEmail(Guid CodeEmailNoiBoNhan, Guid CodeEmailNoiBoNhanFile, string NguoiGui, 
            string TieuDe, string NoiDung)
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

                var sentmail = _emailnoiboService.SentEmail(CodeEmailNoiBoNhan, CodeEmailNoiBoNhanFile, 
                    NguoiGui, TieuDe, NoiDung, DateTime.Now, username);

                return new OkObjectResult(sentmail);
            }
        }

        [HttpPost]
        public IActionResult DeleteSentFile(long Id, string username)
        {
            if (!ModelState.IsValid)
            {
                IEnumerable<ModelError> allErrors = ModelState.Values.SelectMany(v => v.Errors);
                return new BadRequestObjectResult(allErrors);
            }
            else
            {                
                var result = _authorizationService.AuthorizeAsync(User, "EMAILNOIBOTHEM", Operations.Delete); // xoa suc khoe nhan vien
                if (result.Result.Succeeded == false)
                {
                    return new ObjectResult(new GenericResult(false, "Bạn không đủ quyền xóa."));
                }                

                var emailnhanfile = _emailnoibonhanfileService.DeleteEmailNhanFileById(Id,
                    DateTime.Now, username);

                return new OkObjectResult(emailnhanfile);
                
            }
        }

        [HttpPost]
        public IActionResult DeleteEmailNhan(long Id, string username)
        {
            if (!ModelState.IsValid)
            {
                IEnumerable<ModelError> allErrors = ModelState.Values.SelectMany(v => v.Errors);
                return new BadRequestObjectResult(allErrors);
            }
            else
            {
                var result = _authorizationService.AuthorizeAsync(User, "EMAILNOIBOTHEM", Operations.Delete); // xoa suc khoe nhan vien
                if (result.Result.Succeeded == false)
                {
                    return new ObjectResult(new GenericResult(false, "Bạn không đủ quyền xóa."));
                }

                var emailnhan = _emailnoibonhanService.DeleteEmailNhanById(Id,
                    DateTime.Now, username);

                return new OkObjectResult(emailnhan);

            }
        }

        [HttpPost]
        public IActionResult IsViewEmail(long emailNoiBoNhanId, string username)
        {
            if (!ModelState.IsValid)
            {
                IEnumerable<ModelError> allErrors = ModelState.Values.SelectMany(v => v.Errors);
                return new BadRequestObjectResult(allErrors);
            }
            else
            {
                var result = _authorizationService.AuthorizeAsync(User, "EMAILNOIBOTHEM", Operations.Update); // xoa suc khoe nhan vien
                if (result.Result.Succeeded == false)
                {
                    return new ObjectResult(new GenericResult(false, "Bạn không đủ quyền sửa."));
                }

                var emailnhan = _emailnoiboService.IsViewEmail(emailNoiBoNhanId, username);

                return new OkObjectResult(emailnhan);

            }
        }

        
        #endregion


    }
}