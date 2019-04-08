using System;
using System.Collections.Generic;
using System.Text;
using System.ComponentModel.DataAnnotations;

namespace NiTiErp.Application.Dapper.ViewModels
{
    public class AppRoleViewModel
    {
        public Guid Id { get; set; }

        public string ConcurrencyStamp { get; set; }

        public string Description { get; set; }

        public string Name { get; set; }

        public string NormalizedName { get; set; }

        public string CorporationId { get; set; }

        public string TenKhuVuc { get; set; }

    }
}
