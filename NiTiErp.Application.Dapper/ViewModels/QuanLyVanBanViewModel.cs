using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace NiTiErp.Application.Dapper.ViewModels
{
    public class QuanLyVanBanViewModel
    {
        public long Id { get; set; }

        [StringLength(50)]
        public string KETQUA { set; get; }

        public int InsertQuanLyVanBanId { set; get; }

        public string Corporation { get; set; }

        public string TenKhuVuc { get; set; }        

        public int NamHinhThanh { get; set; }

        public string SoVaKyHieu { get; set; }

        public string TieuDe { get; set; }

        public string ThoiHanBaoQuan { get; set; }

        public string CheDoSuDung { get; set; }

        public string NguoiLap { get; set; }

        public string LanguageId { get; set; }

        public DateTime ThoiGianBatDau { get; set; }

        public DateTime ThoiGianKetThuc { get; set; }

        public decimal TongSoVBTrongHoSo { get; set; }

        public decimal TongSoTrangTrongHoSo { get; set; }

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
