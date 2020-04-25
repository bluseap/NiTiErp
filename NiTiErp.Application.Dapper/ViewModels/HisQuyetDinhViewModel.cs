using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace NiTiErp.Application.Dapper.ViewModels
{
    public class HisQuyetDinhViewModel
    {
        public string Id { set; get; }


        [StringLength(100)]
        public string CorporationId { get; set; }

        [StringLength(100)]
        public string TempQuyeDinhId { get; set; }

        [StringLength(100)]
        public string TempSoQuyeDinh { get; set; }

        public DateTime TempNgayKyQuyetDinh { get; set; }

        [StringLength(100)]
        public string TempTenNguoiKyQuyeDinh { get; set; }

        [StringLength(100)]
        public string TempLoaiQuyeDinhId { get; set; }

        [StringLength(100)]
        public string TempTenLoaiQuyeDinh { get; set; }

        [StringLength(1000)]
        public string TempLyDoQuyeDinh { get; set; }

        [StringLength(1000)]
        public string TempGhiChuQuyeDinh { get; set; }

        public DateTime TempNgayHieuLuc { get; set; }

        public DateTime TempNgayKetThuc { get; set; }

        [StringLength(2000)]
        public string TempNoiDung { get; set; }

        public DateTime TempCreateDate { get; set; }



    }
}
