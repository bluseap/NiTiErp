using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace NiTiErp.Application.Dapper.ViewModels
{
    public class ChiPhiViewModel
    {
        public int Id { set; get; }

        [StringLength(50)]
        public string KETQUA { set; get; }

        public int InsertChiPhiId { set; get; }


        [StringLength(150)]
        public string CorporationId { get; set; }

        [StringLength(500)]
        public string TenKhuVuc { get; set; }


        [StringLength(200)]
        public string TenChiPhi { get; set; }

        public bool IsChiPhiTang { get; set; }

        public int ChiPhiLoaiId { get; set; }

        [StringLength(200)]
        public string TenLoaiChiPhi { get; set; }

        public bool IsSoTienChiPhi { get; set; }

        public decimal SoTienChiPhi { get; set; }

        public bool IsSoNgayCongXMucLuongNgay { get; set; }

        public decimal SoNgayCongXMucLuongNgay { get; set; }

        public bool IsSoGioCongXMucLuongGio { get; set; }

        public int SoGioCongXMucLuongGio { get; set; }

        public bool IsTienSoXNgayCong { get; set; }

        public decimal SoTienXSoNgayCong { get; set; }

        public bool IsHeSoXTienThucLinh { get; set; }

        public decimal HeSoXTienThucLinh { get; set; }

        public bool IsHeSoXThanhTien { get; set; }

        public decimal HeSoXThanhTien { get; set; }

        public bool IsHeSoXMucLuongCanBan { get; set; }

        public decimal HeSoXMucLuongCanBan { get; set; }
        
        public bool IsTienSoXSoNgayAn { get; set; }

        public decimal TienSoXSoNgayAn { get; set; }

        public bool IsHeSoXMucLuong { get; set; }

        public decimal HeSoXMucLuong { get; set; }

        public bool IsTienSoXHeSo { get; set; }

        public decimal TienSoXHeSo { get; set; }
        
        public bool IsChiPhiKhac { get; set; }

        public decimal ChiPhiKhac { get; set; }

        public int ChiPhiBangDanhMucId { get; set; }

        [StringLength(500)]
        public string TenChiPhiBang { get; set; }
        


        [StringLength(1000)]
        public string GhiChu { get; set; }



        public int Status { get; set; }

        public bool Active { get; set; }

        public int Stt { get; set; }

        public DateTime CreateDate { get; set; }

        [StringLength(50)]
        public string CreateBy { get; set; }

        public DateTime UpdateDate { get; set; }

        [StringLength(50)]
        public string UpdateBy { get; set; }



    }
}
