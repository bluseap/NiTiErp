﻿using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using OfficeOpenXml;
using OfficeOpenXml.Table;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http.Headers;
using NiTiErp.Application.Interfaces;
using NiTiErp.Application.ViewModels.Corporation;
using NiTiErp.Utilities.Helpers;
using NiTiErp.Application.Dapper.Interfaces;

namespace NiTiErp.Areas.Admin.Controllers
{
    public class CorporationController : BaseController
    {        
        private ICorporationService _corporationService;
        private readonly IHostingEnvironment _hostingEnvironment;

        public CorporationController(ICorporationService corporationService,
            IHostingEnvironment hostingEnvironment)
        {
            _corporationService = corporationService;
            _hostingEnvironment = hostingEnvironment;
        }

        public IActionResult Index()
        {
            return View();
        }

        #region AJAX API
        [HttpGet]
        public IActionResult GetAll()
        {
            var model = _corporationService.GetAll();
            return new OkObjectResult(model);
        }

        [HttpGet]
        public IActionResult GetAllCorporations()
        {
            var model = _corporationService.GetAll();
            return new OkObjectResult(model);
        }

        [HttpGet]
        public IActionResult GetAllPaging(string keyword, int page, int pageSize)
        {
            var model = _corporationService.GetAllPaging(keyword, page, pageSize);
            return new OkObjectResult(model);
        }

        [HttpGet]
        public IActionResult GetById(string id)
        {
            var model = _corporationService.GetById(id);

            return new OkObjectResult(model);
        }

        [HttpPost]
        public IActionResult SaveEntity(CorporationViewModel corporationVm)
        {
            if (!ModelState.IsValid)
            {
                IEnumerable<ModelError> allErrors = ModelState.Values.SelectMany(v => v.Errors);
                return new BadRequestObjectResult(allErrors);
            }
            else
            {               
                if (corporationVm.Id == "0")
                {
                    corporationVm.DateCreated = DateTime.Now;
                    _corporationService.Add(corporationVm);
                }
                else
                {
                    _corporationService.Update(corporationVm);
                }
                _corporationService.Save();
                return new OkObjectResult(corporationVm);
            }
        }

        [HttpPost]
        public IActionResult Delete(string id)
        {
            if (!ModelState.IsValid)
            {
                return new BadRequestObjectResult(ModelState);
            }
            else
            {
                _corporationService.Delete(id);
                _corporationService.Save();

                return new OkObjectResult(id);
            }
        }

        #endregion

    }
}