using System;
using System.Collections.Generic;
using System.Text;
using System.ComponentModel.DataAnnotations;

namespace NiTiErp.Application.Dapper.ViewModels
{
    public class ChiPhiKhoiTaoViewModel
    {
        public int Id { set; get; }

        [StringLength(50)]
        public string KETQUA { set; get; }

        public int InsertChiPhiKhoiTaoId { set; get; }

        public int Nam { set; get; }

        public int Thang { set; get; }


        public int ChiPhiId { set; get; }

        [StringLength(200)]
        public string TenChiPhi { get; set; }


        [StringLength(150)]
        public string CorporationId { get; set; }

        [StringLength(500)]
        public string TenKhuVuc { get; set; }


        public bool IsKyKhoiTao { set; get; }

        public DateTime KyKhoiTao { set; get; }

        public bool IsChuyenKy { set; get; }
        

        [StringLength(1000)]
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
