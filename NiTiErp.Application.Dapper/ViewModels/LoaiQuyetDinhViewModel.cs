using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace NiTiErp.Application.Dapper.ViewModels
{
    public class LoaiQuyetDinhViewModel
    {
        public string Id { set; get; }

        [StringLength(50)]
        public string CorporationId { get; set; }

        [StringLength(500)]
        public string TenKhuVuc { get; set; }

        [StringLength(500)]
        public string TenLoaiQuyetDinh { get; set; }

        public bool Active { get; set; }
        public int Stt { get; set; }
    }
}
