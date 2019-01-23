using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace NiTiErp.Application.Dapper.ViewModels
{
    public class VanBanDenXuLyFileViewModel
    {
        public long Id { get; set; }

        public int InsertVBDXuLyFileId { get; set; }

        public long VanBanDenXuLyId { get; set; }

        public string TenFile { get; set; }

        public string DuongDan { get; set; }



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
