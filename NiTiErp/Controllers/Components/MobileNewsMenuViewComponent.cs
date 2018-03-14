using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using NiTiErp.Application.Interfaces;

namespace NiTiErp.Controllers.Components
{
    public class MobileNewsMenuViewComponent : ViewComponent
    {
        

        public MobileNewsMenuViewComponent()
        {
            
        }

        public async Task<IViewComponentResult> InvokeAsync()
        {
            return View();
        }
    }
}
