using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace NiTiErp.Application.Dapper.ViewModels
{
    public class VanBanDenFileViewModel
    {
        public int Id { set; get; }

        [StringLength(50)]
        public string KETQUA { set; get; }

        public int InsertVanBanDenFileId { set; get; }

        public Guid CodeId { get; set; }

        public int VanBanDenId { set; get; }



        [StringLength(100)]
        public string TenFile { set; get; }

        [StringLength(250)]
        public string DuongDan { set; get; }

        public int SoTrang { get; set; }



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
