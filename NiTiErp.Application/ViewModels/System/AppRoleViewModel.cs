using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
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

        [StringLength(50)]
        public string CorporationId { get; set; }

        public bool Active { set; get; }

        public List<string> Roles { get; set; }
    }
}
