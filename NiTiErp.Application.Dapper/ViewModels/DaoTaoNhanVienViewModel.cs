using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace NiTiErp.Application.Dapper.ViewModels
{
    public class DaoTaoNhanVienViewModel
    {
        public Guid Id { set; get; }

        public int InsertDaoTaoNhanVienId { set; get; }

        [StringLength(50)]
        public string KETQUA { get; set; }


        public Guid HoSoNhanVienId { set; get; }

        [StringLength(1000)]
        public string TenNhanVien { get; set; }

        public Guid DaoTaoLopId { set; get; }

        [StringLength(100)]
        public string ChuyenMon { get; set; }        

        [StringLength(1000)]
        public string Ten { get; set; }

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

        [StringLength(1000)]
        public string Hinh { get; set; }



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
