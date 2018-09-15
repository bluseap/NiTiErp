using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace NiTiErp.Application.Dapper.ViewModels
{
    public class SucKhoeNoiKhamViewModel
    {
        public int Id { set; get; }

        public int InsertNoiKhamId { set; get; }

        [StringLength(500)]
        public string TenNoiKham { get; set; }

        [StringLength(500)]
        public string DiaChiNoiKham { get; set; }

        [StringLength(100)]
        public string SoDienThoai { get; set; }

        [StringLength(100)]
        public string Email { get; set; }        

        [StringLength(100)]
        public string MaSoThue { get; set; }        

         [StringLength(100)]
        public string TenInHoaDon { get; set; }
        
        [StringLength(100)]
        public string DiaChiInHoaDon { get; set; }
        
        [StringLength(1000)]
        public string GhiChu { get; set; }
        

        public int Status { get; set; }        

        public bool Active { get; set; }

        public int Stt { get; set; }

        public DateTime CreateDate { get; set; }

        [StringLength(20)]
        public string CreateBy { get; set; }

        public DateTime UpdateDate { get; set; }

        [StringLength(20)]
        public string UpdateBy { get; set; }

        

    }
}
