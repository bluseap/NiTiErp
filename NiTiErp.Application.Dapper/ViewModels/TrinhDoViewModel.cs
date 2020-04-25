using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace NiTiErp.Application.Dapper.ViewModels
{
    public class TrinhDoViewModel
    {
        public string Id { set; get; }

        public int InsertUpdateId { set; get; }

        public int InsertUpdateTrinhDoId { set; get; }

        public Guid HoSoNhanVienId { get; set; }

        [StringLength(20)]
        public string LoaiBangDanhMucId { set; get; }

        [StringLength(1000)]
        public string TenLoaiBang { get; set; }

        [StringLength(500)]
        public string ChuyenNganh { set; get; }

        [StringLength(20)]
        public string LoaiDaoTaoDanhMucId { set; get; }

        [StringLength(1000)]
        public string TenLoaiHinhDaoTao { get; set; }

        [StringLength(20)]
        public string XepLoaiDanhMucId { set; get; }

        [StringLength(1000)]
        public string TenXepLoai { get; set; }

        [StringLength(50)]
        public string NamCapBang { set; get; }

        [StringLength(500)]
        public string TenTruong { set; get; }

        [StringLength(1000)]
        public string GhiChu { set; get; }

        [StringLength(500)]
        public string HinhBangMatPath1 { set; get; }

        [StringLength(500)]
        public string HinhBangMatPath2 { set; get; }     

        public DateTime CreateDate { get; set; }

        [StringLength(20)]
        public string CreateBy { get; set; }

        public DateTime UpdateDate { get; set; }

        [StringLength(20)]
        public string UpdateBy { get; set; }

        


    }
}
