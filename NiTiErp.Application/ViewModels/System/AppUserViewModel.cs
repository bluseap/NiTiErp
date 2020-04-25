using System;
using System.Collections.Generic;
using System.Text;
using NiTiErp.Data.Enums;

namespace NiTiErp.Application.ViewModels.System
{
    public class AppUserViewModel
    {
        public AppUserViewModel()
        {
            Roles = new List<string>();
        }
        public Guid? Id { set; get; }
        public string FullName { set; get; }
        public string BirthDay { set; get; }
        public string Email { set; get; }
        public string Password { set; get; }
        public string CurrentPassword { set; get; }
        public string NewPassword { set; get; }
        public string UserName { set; get; }
        public string Address { get; set; }
        public string PhoneNumber { set; get; }
        public string CorporationId { get; set; }
        public string Avatar { get; set; }
        public Status Status { get; set; }

        public string Gender { get; set; }

        public Guid HoSoNhanVienId { get; set; }

        public DateTime DateCreated { get; set; }
        public string UserCreated { get; set; }
        public DateTime DateModified { get; set; }
        public string UserModified { get; set; }

        public List<string> Roles { get; set; }
    }
}
