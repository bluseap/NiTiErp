using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace NiTiErp.Application.Dapper.ViewModels
{
    public class ChiPhiLuongViewModel
    {
        public string Id { set; get; }

        public string KETQUA { set; get; }

        public int Nam { set; get; }

        public int Thang { set; get; }

        public int InsertChiPhiTangGiamId { set; get; }

        public Guid HoSoNhanVienId { set; get; }
        

        public string KyChiPhi { set; get; }

        [StringLength(1000)]
        public string TenNhanVien { get; set; }

        [StringLength(50)]
        public string CorporationId { get; set; }
        
        [StringLength(500)]
        public string TenKhuVuc { get; set; }
        
        [StringLength(20)]
        public string PhongBanDanhMucId { get; set; }

        [StringLength(1000)]
        public string TenPhong { get; set; }

        [StringLength(20)]
        public string ChucVuNhanVienId { get; set; }

        [StringLength(1000)]
        public string TenChucVu { get; set; }

        public int ChiPhiId { get; set; }

        [StringLength(200)]
        public string TenChiPhi { get; set; }

        public decimal TongTienChiPhitangGiam { get; set; }

        public bool IsChuyenKy { get; set; }
        
        public int LuongDotInKyId { get; set; }

        public decimal SoNgayCong { get; set; }

        public decimal SoNgayAn { get; set; }

        public decimal TienChiPhiKhac { get; set; }

        public decimal SoNgayTrucLe { get; set; }


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
