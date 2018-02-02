using System;
using System.Collections.Generic;
using System.Text;

namespace NiTiErp.Application.ViewModels.System
{
    public class AppRoleViewModel
    {
        public AppRoleViewModel()
        {
            Roles = new List<string>();
        }

        public Guid? Id { set; get; }

        public string Name { set; get; }

        public string Description { set; get; }

        public bool Active { set; get; }

        public List<string> Roles { get; set; }
    }
}
