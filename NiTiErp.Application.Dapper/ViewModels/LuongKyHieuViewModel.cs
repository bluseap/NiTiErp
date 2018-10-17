using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace NiTiErp.Application.Dapper.ViewModels
{
    public class LuongKyHieuViewModel
    {
        public string Id { set; get; }

        [StringLength(20)]
        public string MaKyHieu { get; set; }
        
        [StringLength(100)]
        public string TenKyHieu { get; set; }

        [StringLength(1000)]
        public string GhiChu { get; set; }          


        public int Status { get; set; }

        public bool Active { get; set; }

        public int Stt { get; set; }

        [StringLength(50)]
        public string CreateBy { get; set; }

        public DateTime CreateDate { get; set; }

        [StringLength(50)]
        public string UpdateBy { get; set; }

        public DateTime UpdateDate { get; set; }



    }
}
