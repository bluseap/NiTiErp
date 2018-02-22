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
    [Table("UserTrackings")]
    public class UserTracking : DomainEntity<int>
    {

        [StringLength(50)]
        public string TableId { set; get; }
        [StringLength(500)]
        public string Description { set; get; }


        [StringLength(100)]
        public string DeviceName {set; get;}
        [StringLength(100)]
        public string IpAddress { set; get; }
        [StringLength(200)]
        public DateTime DateIpAddress { set; get; }
        [StringLength(200)]
        public string MacAddress { set; get; }
        

        public DateTime DateCreated { set; get; }
        [StringLength(20)]
        public string UserCreated { set; get; }

    }
}
