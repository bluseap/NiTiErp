using System;
using System.Collections.Generic;
using System.Text;

namespace NiTiErp.Application.Dapper.ViewModels
{
    public class EmailNoiBoNhanFileViewModel
    {
        public long Id { get; set; }

        public long EmailNoiBoNhanId { get; set; }

        public Guid CodeEmailNoiBoNhan { get; set; }

        public Guid CodeEmailNoiBoNhanFile { get; set; }

        public string TenFile { get; set; }

        public string DuongDan { get; set; }

        public int SoTrang { get; set; }

        public string GhiChu { get; set; }


        public int Status { get; set; }

        public bool Active { get; set; }

        public int Stt { get; set; }

        public string CreateBy { get; set; }

        public DateTime CreateDate { get; set; }

        public string UpdateBy { get; set; }

        public DateTime UpdateDate { get; set; }

    }
}
