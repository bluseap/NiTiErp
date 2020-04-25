using System;
using System.Collections.Generic;
using System.Text;
using System.ComponentModel.DataAnnotations;

namespace NiTiErp.Application.Dapper.ViewModels
{
    public class QuanHuyenViewModel
    {
        public string Id { set; get; }

        public string ThanhPhoTinhId { set; get; }
        
        [StringLength(50)]
        public string KETQUA { get; set; }


        [StringLength(500)]
        public string TenQuanHuyen { get; set; }

        [StringLength(255)]
        public string LoaiQuanHuyen { get; set; }

        [StringLength(255)]
        public string KinhDoViDo { get; set; }


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
