using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace NiTiErp.Application.Dapper.ViewModels
{
    public class QDDieuDongViewModel
    {
        public string Id { set; get; }

        public int InsertqdnnId { set; get; }

        [StringLength(50)]
        public string KETQUA { get; set; }

        public Guid HoSoNhanVienId { get; set; }

        [StringLength(1000)]
        public string Ten { get; set; }

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

        [StringLength(500)]
        public string TenChucVu { get; set; }

        [StringLength(20)]
        public string HopDongId { get; set; }

        [StringLength(1000)]
        public string TenLoaiHopDong { get; set; }

        [StringLength(20)]
        public string LoaiQuyetDinhId { get; set; }

        [StringLength(500)]
        public string TenLoaiQuyetDinh { get; set; }

        [StringLength(1000)]
        public string LyDoQuyetDinh { get; set; }


        [StringLength(1000)]
        public string GhiChuQuyetDinh { get; set; }

        [StringLength(50)]
        public string SoQuyetDinh { get; set; }

        public DateTime NgayKyQuyetDinh { get; set; }

        [StringLength(50)]
        public string TenNguoiKyQuyetDinh { get; set; }

        public DateTime NgayHieuLuc { get; set; }

        public DateTime NgayKetThuc { get; set; }



       

        [StringLength(20)]
        public string ChucVuNhanVienCuId { get; set; }

        [StringLength(500)]
        public string TenChucVuCu { get; set; }

        [StringLength(20)]
        public string ChucVuNhanVienMoiId { get; set; }

        [StringLength(500)]
        public string TenChucVuMoi { get; set; }





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
