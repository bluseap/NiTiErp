using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace NiTiErp.Application.Dapper.ViewModels
{
    public class LockViewModel
    {

        [StringLength(100)]
        public string KETQUA { set; get; }

        [StringLength(100)]
        public string KETQUAHOSO { get; set; }

        [StringLength(100)]
        public string KETQUALUONGTHANG{ get; set; }


        [StringLength(100)]
        public string KETQUALUONGNGAY { get; set; }

        [StringLength(100)]
        public string KETQUASUCKHOE { get; set; }

        [StringLength(100)]
        public string KETQUADAOTAO { get; set; }
    }
}
