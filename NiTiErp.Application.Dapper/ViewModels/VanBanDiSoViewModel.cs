using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace NiTiErp.Application.Dapper.ViewModels
{
    public class VanBanDiSoViewModel
    {
        public int Id { set; get; }

        [StringLength(50)]
        public string KETQUA { set; get; }

        public int InsertVanBanDiSoId { set; get; }


        [StringLength(50)]
        public string CorporationId { set; get; }

        [StringLength(500)]
        public string TenKhuVuc { set; get; }

        public int Nam { set; get; }

        [StringLength(100)]
        public string TenSo { set; get; }

        public int SoDiHienTai { set; get; }

        public int SoDiHet { set; get; }

        [StringLength(100)]
        public string DoUuTien { set; get; }


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
