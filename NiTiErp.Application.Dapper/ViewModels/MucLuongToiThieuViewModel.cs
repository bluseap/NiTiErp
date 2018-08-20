using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace NiTiErp.Application.Dapper.ViewModels
{
    public class MucLuongToiThieuViewModel
    {
        public string Id { set; get; }       

        public decimal MucLuong { get; set; }

        [StringLength(500)]
        public string Ten { get; set; }

        public DateTime NgayBatDau { get; set; }

        public DateTime NgayKetThuc { get; set; }

        [StringLength(50)]
        public string CorporationId { get; set; }

        [StringLength(500)]
        public string TenKhuVuc{ get; set; }

        [StringLength(1000)]
        public string GhiChu { get; set; }


        public int Status { get; set; }

        public bool Active { get; set; }

        public int Stt { get; set; }

        [StringLength(20)]
        public string CreateBy { get; set; }

        public DateTime CreateDate { get; set; }

        [StringLength(20)]
        public string UpdateBy { get; set; }

        public DateTime UpdateDate { get; set; }


    }
}
