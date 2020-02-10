using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace NiTiErp.Application.Dapper.ViewModels
{
    public class RegisterDocViewModel
    {
        public int Id { get; set; }

        public string CorporationId { get; set; }

        public Guid AppUserId { get; set; }

        public string Code { get; set; }

        public string FirebaseNotifiId { get; set; }

        public string TinNhan { get; set; }

        public string Imei { get; set; }

        public string ModelName { get; set; }

        public string ModelNumber { get; set; }

        public string SerialNumber { get; set; }

        public string Network { get; set; }

        public string Seid { get; set; }

        public string GhiChu { get; set; }


        public int Status { get; set; }

        public bool Active { get; set; }

        public int Stt { get; set; }

        public DateTime CreateDate { get; set; }

        [StringLength(50)]
        public string CreateBy { get; set; }

        public DateTime UpdateDate { get; set; }

        [StringLength(50)]
        public string UpdateBy { get; set; }

    }
}
