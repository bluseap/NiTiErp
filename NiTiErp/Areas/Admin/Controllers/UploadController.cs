using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Hosting;
using System.Net.Http.Headers;
using System.IO;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Authorization;

using NiTiErp.Utilities.Helpers;
using NiTiErp.Extensions;
using NiTiErp.Application.Dapper.Interfaces;
using NiTiErp.Authorization;
using NiTiErp.Utilities.Dtos;

namespace NiTiErp.Areas.Admin.Controllers
{
    public class UploadController : BaseController
    {
        private readonly IHostingEnvironment _hostingEnvironment;
        private readonly NiTiErp.Application.Interfaces.IUserService _userService;
        private readonly IAuthorizationService _authorizationService;

        private readonly IEmailNoiBoNhanFileService _emailnoibonhanfileService;

        public UploadController(IHostingEnvironment hostingEnvironment,
            NiTiErp.Application.Interfaces.IUserService userService,
            IAuthorizationService authorizationService,
            IEmailNoiBoNhanFileService emailnoibonhanfileService)
        {
            _hostingEnvironment = hostingEnvironment;
            _userService = userService;
            _authorizationService = authorizationService;

            _emailnoibonhanfileService = emailnoibonhanfileService;
        }

        [HttpPost]
        public async Task UploadImageForCKEditor(IList<IFormFile> upload, string CKEditorFuncNum, string CKEditor, string langCode)
        {
            DateTime now = DateTime.Now;
            if (upload.Count == 0)
            {
                await HttpContext.Response.WriteAsync("Yêu cầu nhập ảnh");
            }
            else
            {
                var file = upload[0];
                var filename = ContentDispositionHeaderValue
                                    .Parse(file.ContentDisposition)
                                    .FileName
                                    .Trim('"');

                var imageFolder = $@"\uploaded\images\{now.ToString("yyyyMMdd")}";

                string folder = _hostingEnvironment.WebRootPath + imageFolder;

                if (!Directory.Exists(folder))
                {
                    Directory.CreateDirectory(folder);
                }
                string filePath = Path.Combine(folder, filename);
                using (FileStream fs = System.IO.File.Create(filePath))
                {
                    file.CopyTo(fs);
                    fs.Flush();
                }
                await HttpContext.Response.WriteAsync("<script>window.parent.CKEDITOR.tools.callFunction(" + CKEditorFuncNum + ", '" + Path.Combine(imageFolder, filename).Replace(@"\", @"/") + "');</script>");
            }
        }        

        [HttpPost]
        public IActionResult UploadImage()
        {
            DateTime now = DateTime.Now;
            var files = Request.Form.Files;
            if (files.Count == 0)
            {
                return new BadRequestObjectResult(files);
            }
            else
            {
                var file = files[0];
                var filename = ContentDispositionHeaderValue
                                    .Parse(file.ContentDisposition)
                                    .FileName
                                    .Trim('"');

                var imageFolder = $@"\uploaded\images\{now.ToString("yyyyMMdd")}";
                
                string folder = _hostingEnvironment.WebRootPath + imageFolder;

                if (!Directory.Exists(folder))
                {
                    Directory.CreateDirectory(folder);
                }

                var datetimeFilename = TextHelper.ConvertStringDatetime(now) + filename;
                string filePath = Path.Combine(folder, datetimeFilename);
                using (FileStream fs = System.IO.File.Create(filePath))
                {
                    file.CopyTo(fs);
                    fs.Flush();
                }

                return new OkObjectResult(Path.Combine(imageFolder, datetimeFilename).Replace(@"\", @"/"));
            }
        }

        [HttpPost]
        public IActionResult UploadImageNhanVien()
        {
            DateTime now = DateTime.Now;
            var files = Request.Form.Files;
            if (files.Count == 0)
            {
                return new BadRequestObjectResult(files);
            }
            else
            {
                var file = files[0];
                var filename = ContentDispositionHeaderValue
                                    .Parse(file.ContentDisposition)                                    
                                    .FileName
                                    .Trim('"');

                //var imageFolder = $@"\uploaded\images\{now.ToString("yyyyMMdd")}";
                var imageFolder = $@"\uploaded\hinhnhanvien\{now.ToString("yyyyMMdd")}";

                string folder = _hostingEnvironment.WebRootPath + imageFolder;

                if (!Directory.Exists(folder))
                {
                    Directory.CreateDirectory(folder);
                }

                var datetimeFilename = TextHelper.ConvertStringDatetime(now) + filename;
                string filePath = Path.Combine(folder, datetimeFilename);
                using (FileStream fs = System.IO.File.Create(filePath))
                {
                    file.CopyTo(fs);
                    fs.Flush();
                }

                return new OkObjectResult(Path.Combine(imageFolder, datetimeFilename).Replace(@"\", @"/"));
            }
        }

        [HttpPost]        
        [RequestSizeLimit(209715200)]
        public IActionResult UploadVanBanDenFile()
        {
            DateTime now = DateTime.Now;
            var files = Request.Form.Files;
            if (files.Count == 0)
            {
                return new BadRequestObjectResult(files);
            }
            else
            {
                var file = files[0];
                var filename = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim('"');
                var datetimeFilename = TextHelper.ConvertStringDatetime(now) + filename;                

                //var imageFolder = $@"\uploaded\images\{now.ToString("yyyyMMdd")}";
                var imageFolder = $@"\uploaded\vanbanden\{now.ToString("yyyyMMdd")}";

                string folder = _hostingEnvironment.WebRootPath + imageFolder;

                string pathFile = Path.Combine(imageFolder, datetimeFilename).Replace(@"\", @"/");

                if (!Directory.Exists(folder))
                {
                    Directory.CreateDirectory(folder);
                }      
                
                string filePath = Path.Combine(folder, datetimeFilename);
                using (FileStream fs = System.IO.File.Create(filePath))
                {
                    file.CopyTo(fs);
                    fs.Flush();
                }
                
                return new OkObjectResult(pathFile);
                //return Json(pathFile);
            }
        }

        [HttpPost]
        [RequestSizeLimit(27152000)]//209715200
        public IActionResult UploadEmailSentFile()
        {
            var username = User.GetSpecificClaim("UserName");

            var result = _authorizationService.AuthorizeAsync(User, "EMAILNOIBOTHEM", Operations.Create); // nhap danh muc van ban phoi hop
            if (result.Result.Succeeded == false)
            {
                return new ObjectResult(new GenericResult(false, "Bạn không đủ quyền thêm mới."));
            }

            DateTime now = DateTime.Now;
            var files = Request.Form.Files;

            if (files.Count == 0)
            {
                return new BadRequestObjectResult(files);
            }
            else
            {
                var imageFolder = $@"\uploaded\emailsent\{now.ToString("yyyyMMdd")}";
                var datetimeFilename = "";
                string path = "";
                Guid newGuid = Guid.NewGuid();

                foreach (var file in files)
                {
                    var filename = ContentDispositionHeaderValue.Parse(file.ContentDisposition)
                                    .FileName.Trim('"');                    

                    string folder = _hostingEnvironment.WebRootPath + imageFolder;
                    if (!Directory.Exists(folder))
                    {
                        Directory.CreateDirectory(folder);
                    }
                    datetimeFilename = TextHelper.ConvertStringDatetime(now) + filename;
                    string filePath = Path.Combine(folder, datetimeFilename);

                    path = Path.Combine(imageFolder, datetimeFilename).Replace(@"\", @"/");

                    using (FileStream fs = System.IO.File.Create(filePath))
                    {
                        file.CopyTo(fs);
                        fs.Flush();
                    }
                    
                    var addmailFile = _emailnoibonhanfileService.AddEmailNhanFileByCodeNhanFile(newGuid, filename, path,
                        DateTime.Now, username);

                }                
                //return new OkObjectResult(Path.Combine(imageFolder, datetimeFilename).Replace(@"\", @"/"));
                Guid newguid = newGuid;
                return Json(newguid);


                //var file = files[0];
                //var filename = ContentDispositionHeaderValue
                //                    .Parse(file.ContentDisposition)
                //                    .FileName
                //                    .Trim('"');
                ////var imageFolder = $@"\uploaded\images\{now.ToString("yyyyMMdd")}";
                //var imageFolder = $@"\uploaded\emailsent\{now.ToString("yyyyMMdd")}";

                //string folder = _hostingEnvironment.WebRootPath + imageFolder;

                //if (!Directory.Exists(folder))
                //{
                //    Directory.CreateDirectory(folder);
                //}
                //var datetimeFilename = TextHelper.ConvertStringDatetime(now) + filename;
                //string filePath = Path.Combine(folder, datetimeFilename);
                //using (FileStream fs = System.IO.File.Create(filePath))
                //{
                //    file.CopyTo(fs);
                //    fs.Flush();
                //}
                //return new OkObjectResult(Path.Combine(imageFolder, datetimeFilename).Replace(@"\", @"/"));
            }
        }

        [HttpPost]
        public IActionResult UploadVanBanDiFile()
        {
            DateTime now = DateTime.Now;
            var files = Request.Form.Files;
            if (files.Count == 0)
            {
                return new BadRequestObjectResult(files);
            }
            else
            {
                var file = files[0];
                var filename = ContentDispositionHeaderValue
                                    .Parse(file.ContentDisposition)
                                    .FileName
                                    .Trim('"');

                //var imageFolder = $@"\uploaded\images\{now.ToString("yyyyMMdd")}";
                var imageFolder = $@"\uploaded\vanbandi\{now.ToString("yyyyMMdd")}";

                string folder = _hostingEnvironment.WebRootPath + imageFolder;

                if (!Directory.Exists(folder))
                {
                    Directory.CreateDirectory(folder);
                }

                var datetimeFilename = TextHelper.ConvertStringDatetime(now) + filename;
                string filePath = Path.Combine(folder, datetimeFilename);
                using (FileStream fs = System.IO.File.Create(filePath))
                {
                    file.CopyTo(fs);
                    fs.Flush();
                }

                return new OkObjectResult(Path.Combine(imageFolder, datetimeFilename).Replace(@"\", @"/"));
            }
        }

        [HttpPost]
        public IActionResult UploadFileHoSoNhanVien()
        {
            DateTime now = DateTime.Now;
            var files = Request.Form.Files;
            if (files.Count == 0)
            {
                return new BadRequestObjectResult(files);
            }
            else
            {
                var file = files[0];
                var filename = ContentDispositionHeaderValue
                                    .Parse(file.ContentDisposition)
                                    .FileName
                                    .Trim('"');

                //var imageFolder = $@"\uploaded\images\{now.ToString("yyyyMMdd")}";
                var imageFolder = $@"\uploaded\hoso\{now.ToString("yyyyMMdd")}";

                string folder = _hostingEnvironment.WebRootPath + imageFolder;

                if (!Directory.Exists(folder))
                {
                    Directory.CreateDirectory(folder);
                }

                var datetimeFilename = TextHelper.ConvertStringDatetime(now) + filename;
                string filePath = Path.Combine(folder, datetimeFilename);
                using (FileStream fs = System.IO.File.Create(filePath))
                {
                    file.CopyTo(fs);
                    fs.Flush();
                }

                return new OkObjectResult(Path.Combine(imageFolder, datetimeFilename).Replace(@"\", @"/"));
            }
        }

        public IActionResult UploadImageResizeW60H90()
        {
            DateTime now = DateTime.Now;
            var files = Request.Form.Files;
            if (files.Count == 0)
            {
                return new BadRequestObjectResult(files);
            }
            else
            {
                var file = files[0];
                var filename = ContentDispositionHeaderValue
                                    .Parse(file.ContentDisposition)
                                    .FileName
                                    .Trim('"');

                //var imageFolder = $@"\uploaded\images\{now.ToString("yyyyMMdd")}";
                var imageFolder = $@"\uploaded\hinhnhanvien\{now.ToString("yyyyMMdd")}";

                string folder = _hostingEnvironment.WebRootPath + imageFolder;
                if (!Directory.Exists(folder))
                {
                    Directory.CreateDirectory(folder);
                }

                var datetimeFilename = TextHelper.ConvertStringDatetime(now) + filename;
                string filePath = Path.Combine(folder, datetimeFilename);

                using (FileStream fs = System.IO.File.Create(filePath))
                {
                    file.CopyTo(fs);
                    fs.Flush();
                }

                var imageFolder6090 = $@"\uploaded\hinhnhanvien\{now.ToString("yyyyMMdd")+"6090"}";
                string folder6090 = _hostingEnvironment.WebRootPath + imageFolder6090;
                if (!Directory.Exists(folder6090))
                {
                    Directory.CreateDirectory(folder6090);
                }
                string filePath6090 = Path.Combine(folder6090, datetimeFilename);
                ImageResizerUpfileExtensions.ResizeAndSaveImageW60h90(file.OpenReadStream(), filePath6090);
                

                return new OkObjectResult(Path.Combine(imageFolder, datetimeFilename).Replace(@"\", @"/"));
            }

        }

        [HttpPost]
        public IActionResult UploadHinhChatUser()
        {
            DateTime now = DateTime.Now;
            var files = Request.Form.Files;
            if (files.Count == 0)
            {
                return new BadRequestObjectResult(files);
            }
            else
            {
                var file = files[0];
                var filename = ContentDispositionHeaderValue
                                    .Parse(file.ContentDisposition)
                                    //.FileName
                                    .Name
                                    .Trim('"');

                //var imageFolder = $@"\uploaded\chatuser\{now.ToString("yyyyMMdd")}";
                var imageFolder = $@"\uploaded\chatuser\{now.ToString("yyyyMMdd")}";

                string folder = _hostingEnvironment.WebRootPath + imageFolder;

                if (!Directory.Exists(folder))
                {
                    Directory.CreateDirectory(folder);
                }

                //var datetimeFilename = TextHelper.ConvertStringDatetime(now) + filename;
                var datetimeFilename = filename;
                string filePath = Path.Combine(folder, datetimeFilename);
                using (FileStream fs = System.IO.File.Create(filePath))
                {
                    file.CopyTo(fs);
                    fs.Flush();
                }

                return new OkObjectResult(Path.Combine(imageFolder, datetimeFilename).Replace(@"\", @"/"));
            }
        }



    }
}
