using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace NiTiErp.Application.Dapper.ViewModels
{
    public class VanBanPHXLViewModel
    {
        public int Id { get; set; }

        public string KETQUA { get; set; }

        public int InsertVBPHXLId { get; set; }

        public string Ten { get; set; }

        public string MoTa { get; set; }

        public string Code { get; set; }

        public string IconCss { get; set; }      



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
