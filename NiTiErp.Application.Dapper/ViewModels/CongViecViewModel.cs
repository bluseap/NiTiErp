using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace NiTiErp.Application.Dapper.ViewModels
{
    public class CongViecViewModel
    {
        public string Id { set; get; }

        [StringLength(50)]
        public string KETQUA { set; get; }

        public int InsertUpdateId { set; get; }

        public int InsertUpdateCongViecId { set; get; }

        public Guid HoSoNhanVienId { get; set; }

        [StringLength(20)]
        public string CorporationId { set; get; }

        [StringLength(20)]
        public string PhongDanhMucId { set; get; }
        [StringLength(1000)]
        public string TenPhong { set; get; }

        [StringLength(20)]
        public string ChucVuCongTyId { set; get; }
        [StringLength(500)]
        public string TenChucVu { set; get; }

        [StringLength(1000)]
        public string CongTacChinh { set; get; }

        [StringLength(50)]
        public string SoQuyetDinh { set; get; }

        [StringLength(500)]
        public string TenQuyetDinh { set; get; }

        public DateTime NgayKy { get; set; }
        public DateTime NgayHieuLuc { get; set; }
        public DateTime NgayKetThuc { get; set; }

        [StringLength(100)]
        public string TenNguoiKy { set; get; }
        

        public DateTime CreateDate { get; set; }

        [StringLength(20)]
        public string CreateBy { get; set; }

        public DateTime UpdateDate { get; set; }

        [StringLength(20)]
        public string UpdateBy { get; set; }



    }
}
