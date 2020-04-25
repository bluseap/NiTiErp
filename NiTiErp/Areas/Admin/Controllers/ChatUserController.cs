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


namespace NiTiErp.Areas.Admin.Controllers
{    
    public class ChatUserController : BaseController
    {
        private readonly IHostingEnvironment _hostingEnvironment;
        private readonly NiTiErp.Application.Interfaces.IUserService _userService;
        private readonly IAuthorizationService _authorizationService;        

        private readonly IHubContext<ChatUserHub> _hubChatUserContext;
      
        public ChatUserController(IHostingEnvironment hostingEnvironment,
            NiTiErp.Application.Interfaces.IUserService userService,
            IAuthorizationService authorizationService,           

            IHubContext<ChatUserHub> hubChatUserContext
            )
        {
            _hostingEnvironment = hostingEnvironment;
            _userService = userService;
            _authorizationService = authorizationService;

            _hubChatUserContext = hubChatUserContext;
        }

        public IActionResult Index()
        {            
            return View();
        }

        [HttpGet]
        public IActionResult GetUserOnline(string username)
        {
            _hubChatUserContext.Clients.All.SendAsync("clientSendConnect", username);
            return new OkObjectResult(1);
        }

        [HttpGet]
        public IActionResult GetCallerUserOnline(string username)
        {
            _hubChatUserContext.Clients.All.SendAsync("clientCallerSendConnect", username);
            return new OkObjectResult(1);
        }



    }
}