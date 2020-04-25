using System;
using System.Collections.Generic;
using System.Text;
using System.ComponentModel.DataAnnotations;

namespace NiTiErp.Application.Dapper.ViewModels
{
    public class PhuongXaViewModel
    {
        public string Id { set; get; }

        public string QuanHuyenId { set; get; }

        [StringLength(50)]
        public string KETQUA { get; set; }


        [StringLength(500)]
        public string TenPhuongXa { get; set; }

        [StringLength(255)]
        public string LoaiXa { get; set; }

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
