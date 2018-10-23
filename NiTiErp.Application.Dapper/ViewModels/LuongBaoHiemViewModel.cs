using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace NiTiErp.Application.Dapper.ViewModels
{
    public class LuongBaoHiemViewModel
    {
        public Int64 Id { set; get; }

        public int InsertLuongBaoHiemId { set; get; }

        [StringLength(50)]
        public string KETQUA { get; set; }

        public string StringXML { get; set; }


        [StringLength(20)]
        public string HeSoLuongNhanVienId { get; set; }

        public int Nam { set; get; }

        public int Thang { set; get; }


        public int IsNgay { set; get; }


        public Guid HoSoNhanVienId { get; set; }

        [StringLength(1000)]
        public string TenNhanVien { get; set; }

        [StringLength(2)]
        public string GioiTinh { get; set; }

        public DateTime NgaySinh { get; set; }            

        [StringLength(150)]
        public string CorporationId { get; set; }

        [StringLength(500)]
        public string TenKhuVuc { get; set; }

        [StringLength(20)]
        public string PhongBanDanhMucId { get; set; }

        [StringLength(1000)]
        public string TenPhong { get; set; }

        [StringLength(20)]
        public string ChucVuNhanVienId { get; set; }

        [StringLength(500)]
        public string TenChucVu { get; set; }



        [StringLength(20)]
        public string HeSoLuongDanhMucId { get; set; }

        public decimal HeSo { get; set; }       

        [StringLength(20)]
        public string BacLuongId { get; set; }

        [StringLength(20)]
        public string MucLuongToiThieuId { get; set; }

        public decimal MucLuongToiThieu { get; set; }

        public decimal SoNgay { get; set; }

        public int SoGioCong { get; set; }

        public decimal MucLuong { get; set; }

        public decimal TienBaoHiem { get; set; }

        public bool IsChuyenKy { get; set; }

        [StringLength(20)]
        public string Ngay01 { get; set; }

        [StringLength(20)]
        public string Ngay02 { get; set; }

        [StringLength(20)]
        public string Ngay03 { get; set; }

        [StringLength(20)]
        public string Ngay04 { get; set; }

        [StringLength(20)]
        public string Ngay05 { get; set; }

        [StringLength(20)]
        public string Ngay06 { get; set; }

        [StringLength(20)]
        public string Ngay07 { get; set; }

        [StringLength(20)]
        public string Ngay08 { get; set; }

        [StringLength(20)]
        public string Ngay09 { get; set; }

        [StringLength(20)]
        public string Ngay10 { get; set; }

        [StringLength(20)]
        public string Ngay11 { get; set; }

        [StringLength(20)]
        public string Ngay12 { get; set; }

        [StringLength(20)]
        public string Ngay13 { get; set; }

        [StringLength(20)]
        public string Ngay14 { get; set; }

        [StringLength(20)]
        public string Ngay15 { get; set; }

        [StringLength(20)]
        public string Ngay16 { get; set; }

        [StringLength(20)]
        public string Ngay17 { get; set; }

        [StringLength(20)]
        public string Ngay18 { get; set; }

        [StringLength(20)]
        public string Ngay19 { get; set; }

        [StringLength(20)]
        public string Ngay20 { get; set; }

        [StringLength(20)]
        public string Ngay21 { get; set; }

        [StringLength(20)]
        public string Ngay22 { get; set; }

        [StringLength(20)]
        public string Ngay23 { get; set; }

        [StringLength(20)]
        public string Ngay24 { get; set; }

        [StringLength(20)]
        public string Ngay25 { get; set; }

        [StringLength(20)]
        public string Ngay26 { get; set; }

        [StringLength(20)]
        public string Ngay27 { get; set; }

        [StringLength(20)]
        public string Ngay28 { get; set; }

        [StringLength(20)]
        public string Ngay29 { get; set; }

        [StringLength(20)]
        public string Ngay30 { get; set; }

        [StringLength(20)]
        public string Ngay31 { get; set; }

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
