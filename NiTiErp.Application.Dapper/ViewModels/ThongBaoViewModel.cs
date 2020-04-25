using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace NiTiErp.Application.Dapper.ViewModels
{
    public class ThongBaoViewModel
    {
        public string Id { set; get; }

        public int InsertThongbaoId { set; get; }

        [StringLength(50)]
        public string CorporationId { get; set; }

        [StringLength(500)]
        public string TenKhuVuc { get; set; }

        [StringLength(500)]
        public string TieuDe { get; set; }

        public string NoiDung { get; set; }

        public DateTime NgayNhap { get; set; }

        [StringLength(50)]
        public string CorporationSentId { get; set; }

        [StringLength(50)]
        public string NoiDat { get; set; }

        [StringLength(500)]
        public string TenKhuVucSent { get; set; }

        [StringLength(1000)]
        public string UploadFile1 { get; set; }

        [StringLength(1000)]
        public string UploadFile2 { get; set; }

        [StringLength(1000)]
        public string UploadFile3 { get; set; }



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
