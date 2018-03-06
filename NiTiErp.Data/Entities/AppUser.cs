using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Text;
using NiTiErp.Data.Interfaces;
using NiTiErp.Data.Enums;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace NiTiErp.Data.Entities
{
    [Table("AppUsers")]
    public class AppUser : IdentityUser<Guid>, IDateTracking, ISwitchable, IUserTracking
    {
        public AppUser() {  }
        public AppUser(Guid id, string fullName, string userName, 
            string email, string phoneNumber, string avatar, Status status, string corporationId)
        {
            Id = id;
            FullName = fullName;
            UserName = userName;
            Email = email;
            PhoneNumber = phoneNumber;
            Avatar = avatar;
            Status = status;
            CorporationId = corporationId;
        }
        public string FullName { get; set; }

        public DateTime? BirthDay { set; get; }

        public decimal Balance { get; set; }

        public string Avatar { get; set; }

        public DateTime DateCreated { get; set; }
        public DateTime DateModified { get; set; }
        public Status Status { get; set; }
        public string CorporationId { get; set; }
        [StringLength(20)]
        public string UserCreated { set; get; }
        [StringLength(20)]
        public string UserModified { set; get; }
    }
}
