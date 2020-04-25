using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace NiTiErp.Application.Dapper.ViewModels
{
    public class LuongDotInKyViewModel
    {
        public int Id { set; get; }

        public int InsertLuongDotInKyId { set; get; }

        [StringLength(50)]
        public string KETQUA { get; set; }


        public int Nam { set; get; }

        public int Thang { set; get; }

        [StringLength(150)]
        public string CorporationId { get; set; }

        [StringLength(500)]
        public string TenKhuVuc { get; set; }

        [StringLength(100)]
        public string TenDotIn { get; set; }

        [StringLength(1000)]
        public string GhiChu { get; set; }


        public int Status { get; set; }

        public bool Active { get; set; }

        public int Stt { get; set; }

        [StringLength(50)]
        public string CreateBy { get; set; }

        public DateTime CreateDate { get; set; }

        [StringLength(50)]
        public string UpdateBy { get; set; }

        public DateTime UpdateDate { get; set; }




    }
}
