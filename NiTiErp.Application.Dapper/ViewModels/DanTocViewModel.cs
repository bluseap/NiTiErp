using System;
using System.Collections.Generic;
using System.Text;
using System.ComponentModel.DataAnnotations;

namespace NiTiErp.Application.Dapper.ViewModels
{
    public class DanTocViewModel
    {
        public string Id { set; get; }

        [StringLength(1000)]
        public string TenDanToc { get; set; }

        public bool Active { get; set; }
        public int Stt { get; set; }

    }
}
