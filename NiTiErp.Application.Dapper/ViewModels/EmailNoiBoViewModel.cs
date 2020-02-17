using System;
using System.Collections.Generic;
using System.Text;

namespace NiTiErp.Application.Dapper.ViewModels
{
    public class EmailNoiBoViewModel
    {
        public long Id { get; set; }

        public string CorporationId { get; set; }

        public string TenKhuVuc { get; set; }       


        public Guid NguoiGui { get; set; }

        public DateTime NgayGui { get; set; }


        public string TenNguoiGui { get; set; }


        public long EmailNoiBoNhanId { get; set; }

        public string TenNguoiNhan { get; set; }


        public Guid AppUserId { get; set; }

        public string UserName { get; set; }


        public string ClassEmailChuaXem { get; set; }

        public string ClassAddFile { get; set; }



        public string TieuDe { get; set; }

        public string NoiDung { get; set; }

        public bool EmailNoiBoNhanIsTraLoi { get; set; }

        public long EmailNoiBoNhanIdTraLoi { get; set; }

        public Guid EmailNoiBoNhanCodeTraLoi { get; set; }

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
