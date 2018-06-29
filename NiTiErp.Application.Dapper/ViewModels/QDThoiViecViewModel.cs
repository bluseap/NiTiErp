using System;
using System.Collections.Generic;
using System.Text;
using System.ComponentModel.DataAnnotations;

namespace NiTiErp.Application.Dapper.ViewModels
{
    public class QDThoiViecViewModel
    {
        public string Id { set; get; }

        [StringLength(50)]
        public string KETQUA { get; set; }


        [StringLength(50)]
        public string CorporationId { get; set; }

        public Guid HoSoNhanVienId { get; set; }

        [StringLength(20)]
        public string HopDongId { get; set; }

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


        public int Status { get; set; }

        public bool Active { get; set; }
        
        public int Stt { get; set; }

        public DateTime CreateDate { get; set; }

        [StringLength(50)]
        public string CreateBy { get; set; }
        
        public DateTime UpdateDate { get; set; }

        [StringLength(50)]
        public string UpdareBy { get; set; }
        



    }
}
