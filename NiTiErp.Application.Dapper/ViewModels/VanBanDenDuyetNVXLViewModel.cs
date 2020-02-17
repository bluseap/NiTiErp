using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace NiTiErp.Application.Dapper.ViewModels
{
    public class VanBanDenDuyetNVXLViewModel
    {
        public long Id { get; set; }

        public string KETQUA { get; set; }

        public int InsertVanBanDenDuyetNVXLId { set; get; }

        public long VanBanDenDuyetId { get; set; }

        public Guid HoSoNhanVienId { get; set; }

        public int VBPhoiHopXuLyId { get; set; }

        public string TenPhoiHopXuLy { get; set; }

        public DateTime NgayNhanVBXL { get; set; }


        public long VanBanDenId { get; set; }

        public string CorporationId { get; set; }

        public string TenKhuVuc { get; set; }

        public string TenNhanVien { get; set; }

        public string PhongBanDanhMucId { get; set; }

        public string TenPhong { get; set; }

        public string ChucVuNhanVienId { get; set; }

        public string TenChucVu { get; set; }




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
