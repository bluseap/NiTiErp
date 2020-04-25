using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace NiTiErp.Application.Dapper.ViewModels
{
    public class DaoTaoNoiViewModel
    {
        public int Id { set; get; }

        public int InsertDaoTaoNoiId { set; get; }

        [StringLength(50)]
        public string KETQUA { get; set; }


        [StringLength(100)]
        public string TenTruong { get; set; }

        [StringLength(100)]
        public string DiaChi { get; set; }

        [StringLength(100)]
        public string SoDienThoai { get; set; }

        [StringLength(100)]
        public string Email { get; set; }

        [StringLength(50)]
        public string TenHieuTruong { get; set; }

        [StringLength(1000)]
        public string Hinh { get; set; }



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
