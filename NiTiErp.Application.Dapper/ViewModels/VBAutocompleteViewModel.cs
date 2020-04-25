using System;
using System.Collections.Generic;
using System.Text;

namespace NiTiErp.Application.Dapper.ViewModels
{
    public class VBAutocompleteViewModel
    {
        public int Id { get; set; }

        public string CodeXL { get; set; }

        public string TenChucVu { get; set; }

        public string TenNhanVien { get; set; }

        public string TrichYeu { get; set; }

        public string GhiChu { get; set; }

        public int Stt { get; set; }

        public int Status { get; set; }

        public bool Active { get; set; }

        public DateTime CreateDate { get; set; }

        public string CreateBy { get; set; }

        public DateTime UpdateDate { get; set; }

        public string UpdateBy { get; set; }

    }
}
