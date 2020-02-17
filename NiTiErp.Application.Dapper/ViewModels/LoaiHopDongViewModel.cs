using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace NiTiErp.Application.Dapper.ViewModels
{
    public class LoaiHopDongViewModel
    {
        public string Id { set; get; }

        [StringLength(1000)]
        public string TenLoaiHopDong { get; set; }

        public int SoThang { get; set; }

        [StringLength(20)]
        public string HopDongKeTiepId { get; set; }

        public bool Active { get; set; }
        public int Stt { get; set; }
    }
}
