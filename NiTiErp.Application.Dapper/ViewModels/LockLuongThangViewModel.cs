using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace NiTiErp.Application.Dapper.ViewModels
{
    public class LockLuongThangViewModel
    {
        public int Id { set; get; }

        public int InsertLockLuongDotInId { set; get; }

        [StringLength(50)]
        public string KETQUA { get; set; }

        [StringLength(150)]
        public string CorporationId { get; set; }

        [StringLength(500)]
        public string TenKhuVuc { get; set; }


        public DateTime LockThang { get; set; }

        public bool IsLockLuongThang { get; set; }

        public bool IsLockKhoiTao { get; set; }



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
