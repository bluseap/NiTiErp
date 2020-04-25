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
    public class PostController : ControllerBase
    {
        private readonly string _connectionString;
        private readonly ILogger<PostController> _logger;
        private readonly IStringLocalizer<PostController> _localizer;
        private readonly LocService _locService;

        private readonly IPostRepository _postRepository;

        public PostController(IConfiguration configuration, LocService locService,
            ILogger<PostController> logger, IPostRepository postRepository,
            IStringLocalizer<PostController> localizer)
        {
            _connectionString = configuration.GetConnectionString("DbConnectionString");
            _logger = logger;
            _locService = locService;
            _localizer = localizer;
            _postRepository = postRepository;
        }

        // GET: api/Post/1
        [HttpGet("{id}", Name = "GetById")]
        public async Task<PostViewModel> GetById(int id)
        {            
            return await _postRepository.GetById(id, CultureInfo.CurrentCulture.Name);
        }

        [HttpGet("postpaging", Name = "GetPostPaging")]
        public async Task<PagedResult<PostViewModel>> GetPostPaging(string keyword, string culture,
            int corporationId, int categoryNewsId, int pageIndex, int pageSize)
        {
            return await _postRepository.GetPaging(keyword, CultureInfo.CurrentCulture.Name,
                corporationId, categoryNewsId, pageIndex, pageSize);
        }


    }

}