﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Hosting;
using System.Net.Http.Headers;
using System.IO;
using Microsoft.AspNetCore.Http;
using NiTiErp.Utilities.Helpers;

using NiTiErp.Extensions;

namespace NiTiErp.Areas.Admin.Controllers
{
    public class UploadController : BaseController
    {
        private readonly IHostingEnvironment _hostingEnvironment;
        public UploadController(IHostingEnvironment hostingEnvironment)
        {
            _hostingEnvironment = hostingEnvironment;
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



    }
}
