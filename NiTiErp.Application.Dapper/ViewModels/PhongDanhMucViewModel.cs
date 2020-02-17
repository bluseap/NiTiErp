using System;
using System.Collections.Generic;
using System.Text;
using System.ComponentModel.DataAnnotations;

namespace NiTiErp.Application.Dapper.ViewModels
{
    public class PhongDanhMucViewModel
    {
        public string Id { set; get; }

        
        public int InsertphongdmId { get; set; }


        [StringLength(50)]
        [Required]
        public string CorporationId { get; set; }

        [StringLength(500)]       
        public string TenKhuVuc { get; set; }

        [StringLength(1000)]
        public string TenPhong { get; set; }

        [StringLength(50)]
        public string SoDienThoai1 { get; set; }

        [StringLength(50)]
        public string SoDienThoai2 { get; set; }

        [StringLength(100)]
        public string Email { get; set; }


        public int Status { get; set; }

        public int Stt { get; set; }

        public bool Active { get; set; }



        [StringLength(20)]
        public string CreateBy { get; set; }
        
        public DateTime CreateDate { get; set; }
        [StringLength(20)]
        public string UpdareBy { get; set; }

        public DateTime UpdateDate { get; set; }

        

    }
}
