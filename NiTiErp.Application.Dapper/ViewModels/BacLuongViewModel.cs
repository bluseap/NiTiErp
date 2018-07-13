using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace NiTiErp.Application.Dapper.ViewModels
{
    public class BacLuongViewModel
    {
        public string Id { set; get; }

        [StringLength(100)]
        public string TenBacLuong { get; set; }

        public bool Active { get; set; }
        public int Stt { get; set; }

    }
}
