using System;
using System.Collections.Generic;
using System.Text;
using System.ComponentModel.DataAnnotations;


namespace NiTiErp.Application.Dapper.ViewModels
{
    public class ThanhPhoTinhViewModel
    {
        public string Id { set; get; }

        [StringLength(50)]
        public string KETQUA { get; set; }


        [StringLength(500)]
        public string TenTinh { get; set; }
        [StringLength(255)]
        public string LoaiTinh { get; set; }

        [StringLength(255)]
        public string MaTinh { get; set; }


        public int Status { get; set; }

        public int Stt { get; set; }

        public bool Active { get; set; }

        [StringLength(50)]
        public string CreateBy { get; set; }

        public DateTime CreateDate { get; set; }

        [StringLength(50)]
        public string UpdateBy { get; set; }

        public DateTime UpdateDate { get; set; }       


    }
}
