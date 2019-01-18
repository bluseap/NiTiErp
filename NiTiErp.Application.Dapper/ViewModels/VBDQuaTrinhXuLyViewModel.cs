using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace NiTiErp.Application.Dapper.ViewModels
{
    public class VBDQuaTrinhXuLyViewModel
    {
        public long Id { get; set; }

        public Guid HoSoNhanVienId { get; set; }

        public string TenNhanVien { get; set; }

        [StringLength(500)]
        public string HinhNhanVien { get; set; }

        public long VanBanDenId { get; set; }

        public string CorporationId { get; set; }

        public string TenKhuVuc { get; set; }

        public string TrangThai { get; set; }

        public string MoTa { get; set; }

        public string GhiChu { get; set; }

        public string GhiChu2 { get; set; }



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
