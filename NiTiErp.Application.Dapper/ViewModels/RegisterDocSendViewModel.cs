using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace NiTiErp.Application.Dapper.ViewModels
{
    public class RegisterDocSendViewModel
    {
        public long Id { get; set; }

        public int RegisterDocId { get; set; }

        public long VanBanDenDuyetId { get; set; }

        public DateTime SendDate { get; set; }

        public string Code { get; set; }

        public string GhiChu { get; set; }


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
