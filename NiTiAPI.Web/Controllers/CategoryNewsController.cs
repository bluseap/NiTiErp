using System.Collections.Generic;
using System.Data.SqlClient;
using System.Globalization;
using System.Threading.Tasks;
using Dapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Localization;
using Microsoft.Extensions.Logging;
using NiTiAPI.Dapper.Models;
using NiTiAPI.Dapper.Repositories;
using NiTiAPI.Dapper.Repositories.Interfaces;
using NiTiAPI.Dapper.ViewModels;
using NiTiAPI.Web.Extensions;
using NiTiAPI.Web.Filters;
using NiTiAPI.Web.Resources;
using NiTiAPI.Utilities.Dtos;

namespace NiTiAPI.Web.Controllers
{
    [Route("api/{culture}/[controller]")]
    [ApiController]
    [MiddlewareFilter(typeof(LocalizationPipeline))]
    public class CategoryNewsController : ControllerBase
    {
        private readonly string _connectionString;
        private readonly ILogger<CategoryNewsController> _logger;
        private readonly IStringLocalizer<CategoryNewsController> _localizer;
        private readonly LocService _locService;

        private readonly ICategoryNewsRepository _categoryNewsRepository;

        public CategoryNewsController(IConfiguration configuration, LocService locService,
            ILogger<CategoryNewsController> logger, ICategoryNewsRepository categoryNewsRepository,
            IStringLocalizer<CategoryNewsController> localizer)
        {
            _connectionString = configuration.GetConnectionString("DbConnectionString");
            _logger = logger;
            _locService = locService;
            _localizer = localizer;
            _categoryNewsRepository = categoryNewsRepository;
        }

        // GET: api/Post/1
        [HttpGet("{id}", Name = "GetListCateByCorId")]
        public List<CategoryNewsViewModel> GetListCateByCorId(int id)
        {
            return _categoryNewsRepository.GetListCateByCorId(id);
        }


    }
}