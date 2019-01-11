using System;
using System.Collections.Generic;
using System.Text;
using System.ComponentModel.DataAnnotations;

namespace NiTiErp.Application.Dapper.ViewModels
{
    public class AppUserViewModel
    {
        public Guid Id  { get; set; }

        public int AccessFailedCount { get; set; }

        public string Avatar { get; set; }

        public decimal Balance { get; set; }

        public DateTime BirthDay { get; set; }

        public string ConcurrencyStamp { get; set; }

        public string CorporationId { get; set; }

        public DateTime DateCreated { get; set; }

        public DateTime DateModified { get; set; }

        public string Email { get; set; }

        public bool EmailConfirmed { get; set; }

        public string FullName { get; set; }

        public Guid HoSoNhanVienId { get; set; }

        public bool LockoutEnabled { get; set; }

        public DateTime LockoutEnd { get; set; }

        public string NormalizedEmail { get; set; }

        public string NormalizedUserName { get; set; }

        public string PasswordHash { get; set; }

        public string PhoneNumber { get; set; }

        public bool PhoneNumberConfirmed { get; set; }

        public string SecurityStamp { get; set; }

        public int Status { get; set; }

        public bool TwoFactorEnabled { get; set; }

        public string UserName { get; set; }

        public string UserCreated { get; set; }

        public string UserModified { get; set; }


    }
}
