using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace NiTiErp.Application.Dapper.ViewModels
{
    public class CorporationViewModel
    {
        public string Id { set; get; }

        [StringLength(500)]
        [Required]
        public string Name { get; set; }

        [StringLength(1000)]
        public string Address { get; set; }

        [StringLength(50)]
        public string PhoneNumber1 { get; set; }

        [StringLength(50)]
        public string PhoneNumber2 { get; set; }

        [StringLength(100)]
        public string TaxNumber { get; set; }

        [StringLength(100)]
        public string Email { get; set; }

        [StringLength(100)]
        public string WebName { get; set; }

        [StringLength(200)]
        public string Image { get; set; }
        [StringLength(200)]
        public string ImageLogo { get; set; }

        public string CorporationServiceId { get; set; }

        public DateTime DateCreated { set; get; }
        public DateTime DateModified { set; get; }
        [StringLength(20)]
        public string UserIdCreated { set; get; }
        [StringLength(20)]
        public string UserIdModified { set; get; }

        public bool Active { set; get; }

        public int Stt { set; get; }

    }
}
