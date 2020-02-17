using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;


namespace NiTiErp.Application.Dapper.ViewModels
{
    public class PhanLoaiSucKhoeViewModel
    {
        public string Id { set; get; }

        [StringLength(1000)]
        public string TenPhanLoaiSucKhoe { set; get; }

        public int Status { get; set; }

        public int Stt { get; set; }

        public bool Active { get; set; }


        [StringLength(20)]
        public string CreateBy { get; set; }

        public DateTime CreateDate { get; set; }
        [StringLength(20)]
        public string UpdateBy { get; set; }

        public DateTime UpdateDate { get; set; }

    }
}
