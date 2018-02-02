using System;
using System.Collections.Generic;
using System.Text;

namespace NiTiErp.Application.ViewModels.System
{
    public class AppUserRolesViewModel
    {
        public Guid? RoleId { set; get; }

        public Guid? UserId { set; get; }

        public bool Active { set; get; }
    }
}
