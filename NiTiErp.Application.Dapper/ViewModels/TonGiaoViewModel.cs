using System;
using System.Collections.Generic;
using System.Text;
using System.ComponentModel.DataAnnotations;

namespace NiTiErp.Application.Dapper.ViewModels
{
    public class TonGiaoViewModel
    {
        public string Id { set; get; }

        [StringLength(1000)]
        public string TenTonGiao { get; set; }

        public bool Active { get; set; }
        public int Stt { get; set; }

    }
}
