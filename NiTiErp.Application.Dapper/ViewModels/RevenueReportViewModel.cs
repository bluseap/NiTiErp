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

    }
}
