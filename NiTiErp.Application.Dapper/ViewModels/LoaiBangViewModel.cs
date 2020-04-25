using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace NiTiErp.Application.Dapper.ViewModels
{
    public class LoaiBangViewModel
    {
        public string Id { set; get; }

        [StringLength(1000)]
        public string TenLoaiBang { get; set; }

        public bool Active { get; set; }
        public int Stt { get; set; }
    }
}
