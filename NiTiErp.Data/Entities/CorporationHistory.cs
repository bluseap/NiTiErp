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
    public class CorporationHistory 
    {
        public CorporationHistory()
        {
            
        }
        [StringLength(50)]
        public string Id { get; set; }
        [StringLength(50)]
        public string corporationId { get; set; }
        [StringLength(500)]        
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

        public DateTime CreateHistory { get; set; }


    }
}
