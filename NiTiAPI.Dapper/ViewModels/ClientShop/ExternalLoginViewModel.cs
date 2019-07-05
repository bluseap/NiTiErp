using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace NiTiAPI.Dapper.ViewModels.ClientShop
{
    public class ExternalLoginViewModel
    {
        [Required]
        public string FullName { get; set; }

        [Required]
        public string DOB { get; set; }

        [Required]
        public string PhoneNumber { get; set; }
    }
}
