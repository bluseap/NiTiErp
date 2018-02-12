using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;
using NiTiErp.Data.Enums;
using NiTiErp.Data.Interfaces;
using NiTiErp.Infrastructure.SharedKernel;

namespace NiTiErp.Data.Entities
{
    [Table("Corporations")]
    public class Corporation : DomainEntity<string>
    {
        public Corporation()
        {
            ProductCategories = new List<ProductCategory>();
            Products = new List<Product>();
            Colors = new List<Color>();
            Sizes = new List<Size>();
            AppUsers = new List<AppUser>();            
        }

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


        public virtual ICollection<ProductCategory> ProductCategories { set; get; }
        public virtual ICollection<Product> Products { set; get; }
        public virtual ICollection<Color> Colors { set; get; }
        public virtual ICollection<Size> Sizes { set; get; }
        public virtual ICollection<AppUser> AppUsers { set; get; }
       

    }
}
