using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace NiTiErp.Application.Dapper.ViewModels
{
    public class HeSoLuongViewModel
    {
        public string Id { set; get; }

        public int inserthesoluongId { set; get; }

        [StringLength(20)]
        public string ChucVuNhanVienId { get; set; }

        [StringLength(50)]
        public string MaKhuVuc { get; set; }

        [StringLength(500)]
        public string TenKhuVuc { get; set; }

        [StringLength(500)]
        public string TenChucVu { get; set; }

        public decimal HeSo { get; set; }

        public decimal MucLuong { get; set; }

        [StringLength(20)]
        public string BacLuongId { get; set; }

        [StringLength(100)]
        public string TenBacLuong { get; set; }


        public decimal HeSo02 { get; set; }

        public decimal MucLuong02 { get; set; }

        [StringLength(20)]
        public string BacLuong02 { get; set; }

        [StringLength(50)]
        public string MaSo { get; set; }

        [StringLength(100)]
        public string TenHeSoLuong { get; set; }

        [StringLength(500)]
        public string GhiChu { get; set; }

        [StringLength(20)]
        public string MucLuongToiThieuId { get; set; }

        public decimal MucLuongToiThieu { get; set; }

        [StringLength(500)]
        public string TenMucLuongToiThieu { get; set; }
        

        public decimal MucLuongToiThieu2 { get; set; }
        



        public int Status { get; set; }

        public bool Active { get; set; }

        public int Stt { get; set; }

        [StringLength(20)]
        public string CreateBy { get; set; }

        public DateTime CreateDate { get; set; }

        [StringLength(20)]
        public string UpdateBy { get; set; }

        public DateTime UpdateDate { get; set; }

        
    }
}
