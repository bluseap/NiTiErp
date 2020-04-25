﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

using NiTiAPI.Web.Extensions;
using NiTiAPI.Web.Resources;
using NiTiAPI.Web.Filters;

using NiTiErp.Application.Dapper.ViewModels;
using NiTiErp.Application.Dapper.Interfaces;

using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Localization;
using Microsoft.Extensions.Logging;


namespace NiTiAPI.Web.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [MiddlewareFilter(typeof(LocalizationPipeline))]
    public class RegisterDocController : ControllerBase
    {
        private readonly ILogger<RegisterDocController> _logger;
        private readonly IStringLocalizer<RegisterDocController> _localizer;

        private readonly IRegisterDocService _registerdocService;

        public RegisterDocController(ILogger<RegisterDocController> logger,
            IRegisterDocService registerdocService,
            IStringLocalizer<RegisterDocController> localizer)
        {
            _logger = logger;
            _registerdocService = registerdocService;
            _localizer = localizer;
        }

        // GET: api/Post/1
        [HttpGet("{id}", Name = "GetRegisterDocId")]
        public async Task<RegisterDocViewModel> GetRegisterDocId(int id)
        {
            return await _registerdocService.GetByIdErp(id);
        }

        [HttpPost]
        [ValidateModel]
        public async Task<IActionResult> CreateRegisterDoc(string firebasenotifiId, string username,
            string softId, string softName, string platformImei)
        {
            var newId = await _registerdocService.CreateRegisterDoc(firebasenotifiId, username,
                softId, softName, platformImei);
            return Ok(newId);
        }


    }
}