using System;
using System.Collections.Generic;
using System.Text;
using System.ComponentModel.DataAnnotations;

namespace NiTiErp.Application.Dapper.ViewModels
{
    public class HopDongViewModel
    {
        public string Id { set; get; }

        [StringLength(20)]
        public string HopDongNhanVienCuId { set; get; }

        public int InsertUpdateId { set; get; }

        public int InsertUpdateHopDongId { set; get; }

        public Guid HoSoNhanVienId { get; set; }

        [StringLength(1000)]
        public string Ten { get; set; }

        [StringLength(50)]
        public string CorporationId { get; set; }

        [StringLength(500)]
        public string TenKhuVuc { get; set; }

        [StringLength(20)]
        public string ChucVuNhanVienId { get; set; }

        [StringLength(1000)]
        public string TenPhong { get; set; }

        [StringLength(500)]
        public string TenChucVu { get; set; }

        [StringLength(50)]
        public string SoHopDong { get; set; }

        [StringLength(20)]
        public string HopDongDanhMucId { get; set; }

        [StringLength(1000)]
        public string TenLoaiHopDong { get; set; }

        public DateTime NgayKyHopDong { get; set; }

        public DateTime NgayHopDong { get; set; }

        public DateTime NgayHieuLuc { get; set; }

        public DateTime NgayHetHan { get; set; }

        public decimal HeSoLuong { get; set; }

        public decimal LuongCoBan { get; set; }

        [StringLength(20)]
        public string HeSoLuongDanhMucId { get; set; }

        [StringLength(20)]
        public string BacLuongId { get; set; }

        [StringLength(100)]
        public string TenBacLuong { get; set; }

        [StringLength(20)]
        public string ChucVuNguoiKyId { get; set; }

        [StringLength(1000)]
        public string TenNguoiKyHopDong { get; set; }

        [StringLength(1000)]
        public string TenHopDong { get; set; }

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
