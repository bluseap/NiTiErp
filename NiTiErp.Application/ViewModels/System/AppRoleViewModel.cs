using System;
using System.Collections.Generic;
using System.Text;

namespace NiTiErp.Application.ViewModels.System
{
    public class AppRoleViewModel
    {
        public Guid? Id { set; get; }

        public string Name { set; get; }

        public string Description { set; get; }

        public bool Active { set; get; }
    }
}
