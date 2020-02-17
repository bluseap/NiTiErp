using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;
using NiTiErp.Data.Enums;

namespace NiTiErp.Application.ViewModels.Corporation
{
    public class CorporationServiceViewModel
    {
        public string Id { set; get; }

        [StringLength(500)]
        [Required]
        public string Name { get; set; }
        public bool Active { get; set; }
        public int SortOrder { get; set; }
        public DateTime DateCreated { set; get; }
        public DateTime DateModified { set; get; }

        [StringLength(20)]
        public string UserCreated { set; get; }
        [StringLength(20)]
        public string UserModified { set; get; }
    }
}
