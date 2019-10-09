using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using NiTiAPI.Dapper.Repositories.Interfaces;
using NiTiAPI.Dapper.ViewModels;
using NiTiAPI.WebErp.Filters;

namespace NiTiAPI.WebErp.Areas.Admin.Controllers
{
    public class PostController : BaseController
    {
        private readonly IPostRepository _post;        

        public PostController(IPostRepository post)
        {
            _post = post;           
        }

        public IActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public async Task<IActionResult> GetById(int id)
        {
            var model = await _post.GetById(id);
            return new OkObjectResult(model);
        }

        [HttpGet]
        public async Task<IActionResult> GetPaging(string keyword, string culture, int corporationId, int categoryNewsId,
            int pageIndex, int pageSize)
        {
            var model = await _post.GetPaging(keyword, culture, corporationId , categoryNewsId, pageIndex, pageSize);
            return new OkObjectResult(model);
        }

        [HttpPost]
        [ClaimRequirement(FunctionCode.NEWS_POST, ActionCode.CREATE)]
        public async Task<IActionResult> CreatePost(PostViewModel postVm)
        {
            if (!ModelState.IsValid)
            {
                IEnumerable<ModelError> allErrors = ModelState.Values.SelectMany(v => v.Errors);
                return new BadRequestObjectResult(allErrors);
            }
            else
            {
                postVm.CreatedDate = DateTime.Now;
                postVm.PublishedDate  = DateTime.Now;
                postVm.HotDate = DateTime.Now;
                postVm.NewDate = DateTime.Now;
                postVm.CreateDate = DateTime.Now;
                var post = await _post.Create(postVm);

                return new OkObjectResult(post);
            }
        }

        [HttpPost]
        [ClaimRequirement(FunctionCode.NEWS_POST, ActionCode.UPDATE)]
        public async Task<IActionResult> UpdatePost(PostViewModel postVm)
        {
            if (!ModelState.IsValid)
            {
                IEnumerable<ModelError> allErrors = ModelState.Values.SelectMany(v => v.Errors);
                return new BadRequestObjectResult(allErrors);
            }
            else
            {
                postVm.CreatedDate = DateTime.Now;
                postVm.PublishedDate = DateTime.Now;
                postVm.HotDate = DateTime.Now;
                postVm.NewDate = DateTime.Now;
                postVm.CreateDate = DateTime.Now;

                var post = await _post.Update(postVm);
                return new OkObjectResult(post);
            }
        }

        [HttpPost]
        [ClaimRequirement(FunctionCode.NEWS_POST, ActionCode.DELETE)]
        public async Task<IActionResult> DeletePost(int Id, string username)
        {
            if (!ModelState.IsValid)
            {
                IEnumerable<ModelError> allErrors = ModelState.Values.SelectMany(v => v.Errors);
                return new BadRequestObjectResult(allErrors);
            }
            else
            {
                var post = await _post.Delete(Id, username);
                return new OkObjectResult(post);
            }
        }


    }
}