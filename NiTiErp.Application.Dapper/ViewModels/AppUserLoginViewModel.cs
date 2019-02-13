using System;
using System.ComponentModel.DataAnnotations;

namespace NiTiErp.Application.Dapper.ViewModels
{
    public class AppUserLoginViewModel
    {
        public Int64 Id { set; get; }

        public Guid UserId { set; get; }

        public Guid HoSoNhanVienId { get; set; }

        public string UserName { get; set; }

        public string FullName { get; set; }

        [StringLength(50)]
        public string CorporationId { get; set; }

        [StringLength(500)]
        public string LoginIpAddress { get; set; }

        [StringLength(500)]
        public string LoginIp { get; set; }

        [StringLength(500)]
        public string LoginNameIp { get; set; }

        [StringLength(500)]
        public string LoginIp6Address { get; set; }

        [StringLength(500)]
        public string LoginLocalIp6Adress { get; set; }

        [StringLength(500)]
        public string LoginMacIp { get; set; }

        public int Status { get; set; }

        [StringLength(500)]
        public string StatusContent { get; set; }

        public string LoginProvider { get; set; }

        public string ProviderDisplayName { get; set; }

        public string ProviderKey { get; set; }




        public DateTime CreateDate { get; set; }

        [StringLength(50)]
        public string CreateBy { get; set; }

    }
}