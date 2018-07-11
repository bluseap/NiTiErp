using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace NiTiErp.Application.Dapper.ViewModels
{
    public class RevenueReportViewModel
    {
        public DateTime Date { get; set; }
        public decimal Revenue { get; set; }
        public decimal Profit { get; set; }

        [StringLength(50)]
        public string device { get; set; }
        public int geekbench { get; set; }

        [StringLength(50)]
        public string Id { get; set; }

        [StringLength(500)]
        public string TenPhong { get; set; }

        public int SoNguoi { get; set; }

    }
}
