using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace NiTiErp.Application.Dapper.ViewModels
{
    public class HoSoNhanVienViewModel
    {        
        public Guid Id { set; get; }

        public int InsertUpdateId { set; get; }

        [StringLength(1000)]
        public string Ten { get; set; }

        [StringLength(50)]
        public string CorporationId { get; set; }
       
        [StringLength(500)]
        public string CorporationName { get; set; }       

        [StringLength(20)]
        public string PhongBanDanhMucId { get; set; }

        [StringLength(1000)]
        public string TenPhong { get; set; }

        [StringLength(20)]
        public string ChucVuNhanVienId { get; set; }

        [StringLength(500)]
        public string TenChucVu { get; set; }

        [StringLength(100)]
        public string SoDienThoai { get; set; }

        [StringLength(100)]
        public string SoTheNhanVien { get; set; }

        [StringLength(100)]
        public string Email { get; set; }

        [StringLength(1000)]
        public string TenGoiKhac { get; set; }

        [StringLength(2)]
        public string GioiTinh { get; set; }
       
        public DateTime NgaySinh { get; set; }

        [StringLength(50)]
        public string SoCMND { get; set; }
       
        public DateTime NgayCapCMND { get; set; }

        [StringLength(100)]
        public string NoiCapCMND { get; set; }

        [StringLength(1000)]
        public string NoiSinh { get; set; }

        [StringLength(1000)]
        public string QueQuan { get; set; }

        [StringLength(1000)]
        public string NoiOHienNay { get; set; }

        [StringLength(20)]
        public string HonNhanDanhMucId { get; set; }

        [StringLength(20)]
        public string DanTocDanhMucId { get; set; }

        [StringLength(20)]
        public string TonGiaoDanhMucId { get; set; }

        [StringLength(20)]
        public string XuatThanDanhMucId { get; set; }
       
        public bool IsDelete { get; set; }
       
        public Guid HoSoNhanVienXoaId { get; set; }
      
        public DateTime NgayXoa { get; set; }

        [StringLength(500)]
        public string HinhNhanVien { get; set; }


        [StringLength(20)]
        public string BacLuongId { get; set; }

        [StringLength(100)]
        public string TenBacLuong { get; set; }


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
