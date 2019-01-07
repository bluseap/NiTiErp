using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace NiTiErp.Application.Dapper.ViewModels
{
    public class VanBanDienTuViewModel
    {
        public Int32 Id { set; get; }

        [StringLength(50)]
        public string KETQUA { set; get; }

        public int InsertVanBanDienTuId { set; get; }


        public Int32 VanBanDienTuPhatHanhId { set; get; }
        
        public bool IsVanBanNhan { set; get; }

        public DateTime NgayVanBanNhan { set; get; }
        
        public bool IsVanBanXem { set; get; }



        [StringLength(50)]
        public string KhuVucPhatHanhId { get; set; }

        [StringLength(500)]
        public string TenKhuVucPhatHanhId { get; set; }





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
