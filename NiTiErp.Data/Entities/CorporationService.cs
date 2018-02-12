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
    [Table("CorporationServices")]
    public class CorporationService : DomainEntity<string>
    {
        public CorporationService()
        {            
            Corporations = new List<Corporation>();
        }

        [StringLength(500)]
        [Required]
        public string Name { get; set; }
        public bool Active { get; set; }
        public int Order { get; set; }
        public DateTime DateCreated { set; get; }
        public DateTime DateModified { set; get; }

        public virtual ICollection<Corporation> Corporations { set; get; }
    }
}
