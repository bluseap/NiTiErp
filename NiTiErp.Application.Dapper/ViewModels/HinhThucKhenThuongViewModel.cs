using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace NiTiErp.Application.Dapper.ViewModels
{
    public class HinhThucKhenThuongViewModel
    {
        public string Id { set; get; }

        [StringLength(500)]
        public string TenHinhThucKhenThuong { get; set; }        

        public bool Active { get; set; }
        public int Stt { get; set; }
    }
}
