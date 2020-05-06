using System;
using System.Collections.Generic;
using System.Text;

namespace NiTiErp.Application.Dapper.ViewModels
{
    public class GiayDiDuongViewModel
    {
        public long Id { get; set; }

        public Guid Code { get; set; }

        public string CorporationId { get; set; }

        public string TenKhuVuc { get; set; }

        public int SoGDD { get; set; }

        public string KyHieuGDD { get; set; }

        public Guid HoSoNhanVienId { get; set; }

        public string Ten { get; set; }

        public string ChucVu { get; set; }

        public string CongTacTai { get; set; }

        public string LyDo { get; set; }

        public DateTime TuNgay { get; set; }

        public DateTime DenNgay { get; set; }

        public DateTime NgayNhap { get; set; }

        public string GhiChu { get; set; }

        public string NoiDung { get; set; }

        public int SoLanIn { get; set; }


        public int Status { get; set; }

        public bool Active { get; set; }

        public int Stt { get; set; }

        public DateTime CreateDate { get; set; }
       
        public string CreateBy { get; set; }

        public DateTime UpdateDate { get; set; }
       
        public string UpdateBy { get; set; }

    }
}
