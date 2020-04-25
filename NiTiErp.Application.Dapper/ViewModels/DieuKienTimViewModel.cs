using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace NiTiErp.Application.Dapper.ViewModels
{
    public class DieuKienTimViewModel
    {
        public string Id { set; get; }

        [StringLength(500)]
        public string TenDieuKien { set; get; }

        [StringLength(500)]
        public string BangDieuKien { set; get; }

        public bool Active { get; set; }
        public int Stt { get; set; }

    }
}
